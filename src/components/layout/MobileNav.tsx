import React from 'react';
import { useSalon } from '../../context/SalonContext';
import { Home, Compass, Calendar, Heart, Shield } from 'lucide-react';

interface MobileNavProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onNavigate, activeSection }) => {
  const { t, favorites, openFavorites, openAdminLogin, authSession } = useSalon();

  const items = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'catalog', label: t.nav.catalog, icon: Compass },
    { id: 'test-drive', label: t.nav.testDrive, icon: Calendar },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-amber-400 font-bold scale-105' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Favorites */}
        <button
          onClick={openFavorites}
          className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-zinc-400 hover:text-rose-400 transition-all cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-1" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{t.nav.favorites}</span>
        </button>

        {/* Admin Portal */}
        <button
          onClick={openAdminLogin}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            authSession ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">
            {authSession ? 'Admin' : 'Portal'}
          </span>
        </button>
      </div>
    </div>
  );
};
