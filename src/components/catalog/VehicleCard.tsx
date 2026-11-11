import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { useSalon } from '../../context/SalonContext';
import {
  Heart,
  Calendar,
  Gauge,
  Zap,
  Fuel,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Eye,
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onBookDrive: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect, onBookDrive }) => {
  const { t, isFavorite, toggleFavorite, settings } = useSalon();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const isFav = isFavorite(vehicle.id);
  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80'];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const formattedUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedUzs = new Intl.NumberFormat('uz-UZ', {
    maximumFractionDigits: 0,
  }).format(vehicle.price * (settings.usdToUzsRate || 12850)) + " so'm";

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-amber-500/5 cursor-pointer"
    >
      {/* Image Gallery Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <img
          src={images[currentImgIdx]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {vehicle.status === 'available' ? (
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/90 text-zinc-950 text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
              {t.specs.available}
            </span>
          ) : vehicle.status === 'sold' ? (
            <span className="px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
              {t.specs.sold}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-zinc-950 text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
              {t.specs.reserved}
            </span>
          )}

          {vehicle.isFeatured && (
            <span className="px-2 py-1 rounded-md bg-zinc-950/80 border border-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              VIP
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(vehicle.id);
          }}
          aria-label="Save to favorites"
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isFav
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-zinc-950/60 text-zinc-300 hover:text-white hover:bg-zinc-900/80'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Image Slider Controls (if multiple) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous Image"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/60 hover:bg-zinc-950 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next Image"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/60 hover:bg-zinc-950 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImgIdx ? 'bg-amber-400 w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-1">
            {vehicle.brand}
          </div>
          <h3 className="font-heading font-black text-lg text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
            {vehicle.model}
          </h3>

          {/* Key Specs Row */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs text-zinc-400 border-y border-zinc-800/80 py-2.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>{vehicle.year} yil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{vehicle.power ? `${vehicle.power} ot kuchi` : vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="capitalize">{vehicle.fuelType}</span>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-2">
          <div className="mb-3">
            <div className="font-heading font-black text-xl text-amber-400">
              {formattedUsd}
            </div>
            <div className="text-[11px] text-zinc-500 font-medium">
              ≈ {formattedUzs}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(vehicle);
              }}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.catalog.viewDetails}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookDrive(vehicle);
              }}
              disabled={vehicle.status === 'sold'}
              className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                vehicle.status === 'sold'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
              }`}
            >
              <span>{t.catalog.bookTestDrive}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
