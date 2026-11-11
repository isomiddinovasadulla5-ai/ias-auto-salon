import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Send,
  Instagram,
  Phone,
  MapPin,
  Clock,
  Mail,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t, settings, language, createInquiry } = useSalon();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) return;

    setLoading(true);
    const ok = await createInquiry({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      message: message.trim(),
    });
    setLoading(false);

    if (ok) {
      setSent(true);
      setFullName('');
      setPhone('+998 ');
      setEmail('');
      setMessage('');
      setTimeout(() => setSent(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight mb-3">
            {t.contact.title}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Socials & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Attractive Social Cards */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <h3 className="font-heading font-bold text-base text-zinc-200 uppercase tracking-wider">
                Ijtimoiy Tarmoqlarimiz
              </h3>
              <p className="text-xs text-zinc-400">
                Eng so‘nggi kelgan premium avtolar va maxsus narxlarni birinchi bo‘lib bizning rasmiy kanallarda bilib boring:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Telegram Card */}
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white transition-all group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-400/30 text-blue-300">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Telegram Kanal</div>
                    <div className="text-[11px] opacity-75 flex items-center gap-1">
                      <span>@ilmiy_ishlar5</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>

                {/* Instagram Card */}
                <a
                  href={settings.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-pink-500/20 group-hover:bg-pink-400/30 text-pink-300">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">Instagram Blog</div>
                    <div className="text-[11px] opacity-75 flex items-center gap-1">
                      <span>@asadulla_...</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Address & Phones Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <h3 className="font-heading font-bold text-base text-zinc-200 uppercase tracking-wider">
                Showroom Ma’lumotlari
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-0.5">{t.contact.addressTitle}</span>
                    <span className="font-semibold text-zinc-200 leading-relaxed text-sm">
                      {language === 'uz' ? settings.addressUz : settings.addressRu}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-0.5">{t.contact.phoneTitle}</span>
                    <div className="space-y-1">
                      <a
                        href={`tel:${settings.phonePrimary}`}
                        className="font-bold text-zinc-200 hover:text-amber-400 text-sm block"
                      >
                        {settings.phonePrimary}
                      </a>
                      {settings.phoneSecondary && (
                        <a
                          href={`tel:${settings.phoneSecondary}`}
                          className="font-bold text-zinc-300 hover:text-amber-400 text-sm block"
                        >
                          {settings.phoneSecondary}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-0.5">{t.contact.hoursTitle}</span>
                    <span className="font-semibold text-zinc-200 text-sm">
                      {settings.workingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl">
              <h3 className="font-heading font-black text-xl text-white mb-2">
                {t.contact.formTitle}
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                Qiziqtirgan savolingizni qoldiring, tajribali mutaxassisimiz tez fursatda sizga qo‘ng‘iroq qiladi.
              </p>

              {sent && (
                <div className="p-4 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{t.contact.inquirySent}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
                      {t.booking.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.booking.fullNamePlaceholder}
                      className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
                      {t.booking.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
                    Elektron pochta (ixtiyoriy)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.uz"
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
                    Xabaringiz *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Yuborilmoqda...' : t.contact.send}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
