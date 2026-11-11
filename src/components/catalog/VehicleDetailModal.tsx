import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { useSalon } from '../../context/SalonContext';
import {
  X,
  Heart,
  Calendar,
  Gauge,
  Zap,
  Fuel,
  ShieldCheck,
  Send,
  Phone,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle,
  Award,
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onBookDrive: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onBookDrive,
}) => {
  const { t, language, settings, isFavorite, toggleFavorite, showToast } = useSalon();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isFav = isFavorite(vehicle.id);
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [];

  const formattedUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedUzs = new Intl.NumberFormat('uz-UZ', {
    maximumFractionDigits: 0,
  }).format(vehicle.price * (settings.usdToUzsRate || 12850)) + " so'm";

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        language === 'uz' ? 'Havola nusxalandi!' : 'Ссылка скопирована в буфер обмена!',
        'success'
      );
    }
  };

  const handleTelegramOrder = () => {
    const text = encodeURIComponent(
      `Assalomu alaykum! IAS AUTO SALON'dan ushbu avtomobil bo'yicha ma'lumot olmoqchiman:\n${vehicle.brand} ${vehicle.model} (${vehicle.year} yil) - ${formattedUsd}`
    );
    window.open(`${settings.telegramLink}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              {vehicle.brand}
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
              {vehicle.model}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
              title={t.specs.shareCar}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(vehicle.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isFav ? 'bg-rose-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
              title="Saqlab qo'yish"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Main Gallery */}
          <div className="space-y-3 mb-8">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                src={images[selectedImgIdx]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover object-center"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImgIdx((prev) => (prev - 1 + images.length) % images.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImgIdx((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === selectedImgIdx
                        ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Callouts */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-0.5">
                {t.specs.price}
              </div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-amber-400">
                {formattedUsd}
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                {t.specs.approxUzs}: {formattedUzs}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onBookDrive(vehicle);
                }}
                disabled={vehicle.status === 'sold'}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.catalog.bookTestDrive}</span>
              </button>

              <button
                onClick={handleTelegramOrder}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </button>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Texnik Ko‘rsatkichlar</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.year}</span>
                <span className="font-bold text-zinc-200 text-sm">{vehicle.year}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.mileage}</span>
                <span className="font-bold text-zinc-200 text-sm">
                  {vehicle.mileage.toLocaleString()} {t.specs.km}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.fuel}</span>
                <span className="font-bold text-zinc-200 text-sm capitalize">{vehicle.fuelType}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.power}</span>
                <span className="font-bold text-zinc-200 text-sm">
                  {vehicle.power ? `${vehicle.power} ${t.specs.hp}` : '-'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.transmission}</span>
                <span className="font-bold text-zinc-200 text-sm capitalize">
                  {vehicle.transmission}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.drive}</span>
                <span className="font-bold text-zinc-200 text-sm">{vehicle.driveType || 'AWD'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.acceleration}</span>
                <span className="font-bold text-zinc-200 text-sm">
                  {vehicle.acceleration || '-'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block mb-1">{t.specs.color}</span>
                <span className="font-bold text-zinc-200 text-sm">{vehicle.color}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wider mb-2">
              {t.specs.description}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-line bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
              {language === 'uz' ? vehicle.descriptionUz : vehicle.descriptionRu}
            </p>
          </div>

          {/* Equipment / Features checklist */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wider mb-3">
                {t.specs.features}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300 font-medium"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
