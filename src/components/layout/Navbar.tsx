import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Car,
  Heart,
  Moon,
  Sun,
  Shield,
  Menu,
  X,
  PhoneCall,
  Send,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    t,
    favorites,
    openFavorites,
    openAdminLogin,
    authSession,
    settings,
  } = useSalon();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'catalog', label: t.nav.catalog },
    { id: 'test-drive', label: t.nav.testDrive },
    { id: 'why-us', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-zinc-950/85 border-zinc-800/80 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3.5 group text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <span className="font-heading font-extrabold text-lg text-amber-400 tracking-wider">IAS</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-xl tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors">
                IAS AUTO SALON
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
              Premium Automotive
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeSection === item.id
                  ? 'text-amber-400 bg-amber-400/10 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg p-0.5 bg-zinc-900 border border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setLanguage('uz')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                language === 'uz'
                  ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              UZ
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                language === 'ru'
                  ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              RU
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Favorites Button */}
          <button
            onClick={openFavorites}
            aria-label="Favorites"
            className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-zinc-950">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={openAdminLogin}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              authSession
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/20 font-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {authSession ? authSession.adminId : t.nav.adminPortal}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-zinc-800 bg-zinc-950 space-y-2 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeSection === item.id
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 px-2">
            <span>{settings.phonePrimary}</span>
            <a
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 flex items-center gap-1 font-semibold"
            >
              <Send className="w-3.5 h-3.5" /> Telegram
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
