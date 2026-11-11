import React from 'react';
import { useSalon } from '../../context/SalonContext';
import { X, Heart, Trash2, Calendar, Eye, ArrowRight, Car } from 'lucide-react';

interface FavoritesModalProps {
  onClose: () => void;
  onExploreCatalog: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ onClose, onExploreCatalog }) => {
  const {
    t,
    favorites,
    vehicles,
    toggleFavorite,
    openVehicleDetail,
    openBooking,
    settings,
  } = useSalon();

  const favoriteVehicles = vehicles.filter((v) => favorites.includes(v.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h2 className="text-xl font-heading font-black text-white">
              {t.nav.favorites} ({favoriteVehicles.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {favoriteVehicles.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-zinc-200">
                Hozircha saqlangan avtomobillar yo‘q
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Katalogdagi istalgan avtomobil ustidagi yurakcha belgisini bosib, uni shaxsiy tanlanganlaringiz ro‘yxatiga qo‘shing.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreCatalog();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.hero.viewCatalog}
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {favoriteVehicles.map((car) => {
                const img = car.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
                const formattedUsd = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(car.price);

                return (
                  <div
                    key={car.id}
                    className="p-3 sm:p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={img}
                        alt={car.model}
                        className="w-20 h-16 rounded-xl object-cover shrink-0 border border-zinc-800"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400">
                          {car.brand}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-zinc-100">
                          {car.model} ({car.year})
                        </h4>
                        <div className="text-sm font-black text-amber-400 mt-0.5">
                          {formattedUsd}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                      <button
                        onClick={() => {
                          onClose();
                          openVehicleDetail(car);
                        }}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title={t.catalog.viewDetails}
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">Ko‘rish</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          openBooking(car);
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title={t.catalog.bookTestDrive}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">Test-drayv</span>
                      </button>

                      <button
                        onClick={() => toggleFavorite(car.id)}
                        className="p-2 rounded-xl bg-zinc-800/60 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
