import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Send,
  Instagram,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface HeroProps {
  onExploreCatalog: (searchQuery?: string) => void;
  onBookDrive: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onBookDrive }) => {
  const { t, settings } = useSalon();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreCatalog(searchInput);
  };

  const luxuryBrands = [
    'Mercedes-Benz',
    'BMW',
    'Porsche',
    'Li Auto',
    'Zeekr',
    'BYD',
    'Land Rover',
    'Lexus',
    'Chevrolet',
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 animate-pulse shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] mb-6">
            <span className="block text-zinc-100">{t.hero.titleMain}</span>
            <span className="block gold-text-gradient font-black tracking-normal mt-1">
              {t.hero.titleGold}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10">
            {t.hero.subtitle}
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto mb-8 relative p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-2xl backdrop-blur-xl flex items-center gap-2"
          >
            <div className="pl-3.5 text-zinc-400">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none py-2"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shrink-0 cursor-pointer"
            >
              Qidirish
            </button>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => onExploreCatalog()}
              className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t.hero.viewCatalog}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBookDrive}
              className="px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 text-zinc-100 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{t.hero.bookDrive}</span>
            </button>

            {/* Quick Telegram Button */}
            <a
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Telegram Kanal</span>
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-8 border-t border-zinc-800/80">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400 mb-1">
                50+
              </div>
              <div className="text-xs text-zinc-400 font-medium">{t.hero.statsAvailable}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400 mb-1">
                450+
              </div>
              <div className="text-xs text-zinc-400 font-medium">{t.hero.statsDelivered}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400 mb-1">
                100%
              </div>
              <div className="text-xs text-zinc-400 font-medium">{t.hero.statsWarranty}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400 mb-1">
                14-25
              </div>
              <div className="text-xs text-zinc-400 font-medium">Kun yetkazib berish</div>
            </div>
          </div>
        </div>

        {/* Brand marquee / pill badges */}
        <div className="mt-14 pt-8 border-t border-zinc-900 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mr-2">
            Top Brands:
          </span>
          {luxuryBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => onExploreCatalog(brand)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 text-xs text-zinc-300 font-semibold transition-all cursor-pointer"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
