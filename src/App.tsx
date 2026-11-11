import React, { useState, useMemo } from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { WhyUs } from './components/home/WhyUs';
import { ContactSection } from './components/home/ContactSection';
import { VehicleCard } from './components/catalog/VehicleCard';
import { VehicleFilters } from './components/catalog/VehicleFilters';
import { VehicleDetailModal } from './components/catalog/VehicleDetailModal';
import { TestDriveModal } from './components/booking/TestDriveModal';
import { FavoritesModal } from './components/favorites/FavoritesModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Toast } from './components/common/Toast';
import { FilterState, Vehicle } from './types';
import { Sparkles, Compass, Flame, Shield, Calendar, ArrowRight, Send, Instagram } from 'lucide-react';

const initialFilterState: FilterState = {
  searchQuery: '',
  brand: '',
  model: '',
  bodyType: '',
  fuelType: '',
  transmission: '',
  minPrice: 0,
  maxPrice: 0,
  minYear: 0,
  maxYear: 0,
  status: 'all',
  sortBy: 'featured',
};

const SalonApp: React.FC = () => {
  const {
    t,
    vehicles,
    activeModal,
    selectedVehicle,
    openBooking,
    openVehicleDetail,
    closeModal,
    authSession,
    settings,
  } = useSalon();

  const [activeSection, setActiveSection] = useState('home');
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Extract unique brands for filter dropdown
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.brand) set.add(v.brand);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Filter & Sort vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((car) => {
        // Only published cars on public website
        if (!car.isPublished) return false;

        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matches =
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            car.year.toString().includes(q);
          if (!matches) return false;
        }

        // Brand
        if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) {
          return false;
        }

        // Body type
        if (filters.bodyType && car.bodyType !== filters.bodyType) {
          return false;
        }

        // Fuel type
        if (filters.fuelType && car.fuelType !== filters.fuelType) {
          return false;
        }

        // Transmission
        if (filters.transmission && car.transmission !== filters.transmission) {
          return false;
        }

        // Min / Max Price
        if (filters.minPrice > 0 && car.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice > 0 && car.price > filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        if (filters.sortBy === 'year_desc') return b.year - a.year;
        if (filters.sortBy === 'mileage_asc') return a.mileage - b.mileage;
        // Featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [vehicles, filters]);

  // Featured luxury cars (top 3)
  const featuredCars = useMemo(() => {
    return vehicles.filter((v) => v.isPublished && v.isFeatured).slice(0, 3);
  }, [vehicles]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroExplore = (searchQuery?: string) => {
    if (searchQuery) {
      setFilters((prev) => ({ ...prev, searchQuery, brand: '' }));
    }
    scrollToSection('catalog');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Sticky Navigation */}
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <div id="home">
          <Hero onExploreCatalog={handleHeroExplore} onBookDrive={() => openBooking()} />
        </div>

        {/* FEATURED CARS SPOTLIGHT */}
        {featuredCars.length > 0 && (
          <section className="py-14 bg-zinc-900/40 border-y border-zinc-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 mb-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>IAS Featured Collection</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                    Tanlangan VIP Modellar
                  </h2>
                </div>

                <button
                  onClick={() => scrollToSection('catalog')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Barcha avtomobillarni ko‘rish ({vehicles.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.map((car) => (
                  <VehicleCard
                    key={car.id}
                    vehicle={car}
                    onSelect={openVehicleDetail}
                    onBookDrive={openBooking}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FULL PUBLIC CATALOG WITH ADVANCED FILTERS */}
        <section id="catalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Avtomobillar Katalogi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight mb-2">
              {t.catalog.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              {t.catalog.subtitle}
            </p>
          </div>

          {/* Filter Panel */}
          <VehicleFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(initialFilterState)}
            availableBrands={availableBrands}
          />

          {/* Results Counter */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 px-1">
            <span>
              <strong className="text-amber-400 font-mono text-sm">
                {filteredVehicles.length}
              </strong>{' '}
              {t.catalog.carsFound}
            </span>
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-16 px-4 bg-zinc-900/40 rounded-3xl border border-zinc-800">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500 mb-4">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-zinc-200 mb-1">
                {t.catalog.noResults}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                {t.catalog.noResultsHint}
              </p>
              <button
                onClick={() => setFilters(initialFilterState)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.catalog.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((car) => (
                <VehicleCard
                  key={car.id}
                  vehicle={car}
                  onSelect={openVehicleDetail}
                  onBookDrive={openBooking}
                />
              ))}
            </div>
          )}
        </section>

        {/* WHY US SECTION */}
        <WhyUs />

        {/* TEST-DRIVE CTA BANNER */}
        <section id="test-drive" className="py-16 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-t border-zinc-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase mb-2">
                <Calendar className="w-4 h-4" />
                <span>Eksklyuziv Xizmat</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white mb-2">
                Haqiqiy Dinamika va Hashamatni Sinab Ko‘ring
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                O‘zingiz istagan avtomobilga hoziroq bepul test-drayv bron qiling. Bizning mutaxassislar sizga mashinaning barcha imkoniyatlarini to‘liq tushuntirib berishadi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openBooking()}
                className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
              >
                Test-drayvga yozilish
              </button>
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4 text-blue-400" />
                <span>Telegram orqali</span>
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT & ABOUT SECTION */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav onNavigate={scrollToSection} activeSection={activeSection} />

      {/* Global Toast Alert */}
      <Toast />

      {/* MODALS */}
      {activeModal === 'vehicleDetail' && selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={closeModal}
          onBookDrive={openBooking}
        />
      )}

      {activeModal === 'booking' && (
        <TestDriveModal initialVehicle={selectedVehicle} onClose={closeModal} />
      )}

      {activeModal === 'favorites' && (
        <FavoritesModal
          onClose={closeModal}
          onExploreCatalog={() => scrollToSection('catalog')}
        />
      )}

      {activeModal === 'adminLogin' && (
        <AdminLoginModal
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            setShowAdminDashboard(true);
          }}
        />
      )}

      {/* Full Admin Dashboard Overlay */}
      {showAdminDashboard && authSession && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <SalonApp />
    </SalonProvider>
  );
}
