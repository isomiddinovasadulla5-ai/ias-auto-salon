import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Vehicle } from '../../types';
import { X, Calendar, Clock, User, Phone, MessageSquare, CheckCircle2, Car } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestDriveModalProps {
  initialVehicle?: Vehicle | null;
  onClose: () => void;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({ initialVehicle, onClose }) => {
  const { t, vehicles, createBooking, settings } = useSalon();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialVehicle?.id || (vehicles[0]?.id ?? '')
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('14:00');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || initialVehicle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !date) {
      setErrorMsg(t.booking.requiredError);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const vehicleTitle = currentVehicle
      ? `${currentVehicle.brand} ${currentVehicle.model} (${currentVehicle.year})`
      : 'General Test Drive';

    const ok = await createBooking({
      fullName: fullName.trim(),
      phone: phone.trim(),
      vehicleId: selectedVehicleId || 'general',
      vehicleTitle,
      preferredDate: date,
      preferredTime: time,
      comments: comments.trim(),
    });

    setSubmitting(false);

    if (ok) {
      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setErrorMsg('Xatolik yuz berdi. Iltimos qayta urinib ko‘ring.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div>
            <h2 className="text-xl font-heading font-black text-white">
              {t.booking.title}
            </h2>
            <p className="text-xs text-zinc-400">{t.booking.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-black text-2xl text-white">
                {t.booking.successTitle}
              </h3>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {t.booking.successDesc}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-colors cursor-pointer"
                >
                  {t.booking.close}
                </button>
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm font-semibold text-center transition-colors"
                >
                  Telegram orqali bog‘lanish
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Select Car */}
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.booking.selectedCar}</span>
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.year}) - ${v.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.booking.fullName} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.booking.fullNamePlaceholder}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.booking.phone} *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.booking.preferredDate} *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.booking.preferredTime}</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="10:00">10:00 - 11:00</option>
                    <option value="12:00">12:00 - 13:00</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="16:00">16:00 - 17:00</option>
                    <option value="18:00">18:00 - 19:00</option>
                    <option value="19:30">19:30 - 20:30</option>
                  </select>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.booking.comments}</span>
                </label>
                <textarea
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Masalan: Test-drayv vaqtida lizing shartlarini ham ko'rib chiqish..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                {submitting ? t.booking.submitting : t.booking.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
