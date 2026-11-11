import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Vehicle,
  Booking,
  Inquiry,
  SalonSettings,
  Language,
  Theme,
  AuthSession,
} from '../types';
import { initialSalonSettings, initialVehicles } from '../lib/mockData';
import { translations } from '../lib/i18n';
import { testConnection } from '../lib/firebase';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface SalonContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: typeof translations.uz;
  vehicles: Vehicle[];
  settings: SalonSettings;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  authSession: AuthSession | null;
  superAdminSetupComplete: boolean;
  checkAuthStatus: () => Promise<void>;
  setupSuperAdmin: (email: string, password: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  loginAdmin: (adminId: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  activeModal: 'booking' | 'vehicleDetail' | 'adminLogin' | 'favorites' | 'deployGuide' | null;
  selectedVehicle: Vehicle | null;
  openBooking: (vehicle?: Vehicle) => void;
  openVehicleDetail: (vehicle: Vehicle) => void;
  openAdminLogin: () => void;
  openFavorites: () => void;
  openDeployGuide: () => void;
  closeModal: () => void;
  refreshVehicles: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  createBooking: (data: {
    fullName: string;
    phone: string;
    vehicleId: string;
    vehicleTitle: string;
    preferredDate: string;
    preferredTime: string;
    comments?: string;
  }) => Promise<boolean>;
  createInquiry: (data: {
    fullName: string;
    phone: string;
    email?: string;
    message: string;
  }) => Promise<boolean>;
  addVehicle: (vehicleData: Partial<Vehicle>) => Promise<boolean>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<boolean>;
  deleteVehicle: (id: string) => Promise<boolean>;
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('ias_lang') as Language) || 'uz';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('ias_theme') as Theme) || 'dark';
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('ias_vehicles');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialVehicles; }
    }
    return initialVehicles;
  });

  const [settings, setSettings] = useState<SalonSettings>(() => {
    const saved = localStorage.getItem('ias_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialSalonSettings; }
    }
    return initialSalonSettings;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ias_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('ias_auth_session');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [superAdminSetupComplete, setSuperAdminSetupComplete] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<SalonContextType['activeModal']>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const t = translations[language];

  // Apply theme class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('ias_theme', theme);
  }, [theme]);

  // Persist language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ias_lang', lang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Test connection to Firestore on boot
  useEffect(() => {
    testConnection().then((connected) => {
      if (connected) {
        console.log('IAS AUTO SALON: Cloud services connected.');
      }
    });
  }, []);

  // Fetch API status on mount
  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data = await res.json();
        setSuperAdminSetupComplete(data.superAdminSetupComplete);
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem('ias_settings', JSON.stringify(data.settings));
        }
      }
    } catch {
      // Backend fallback
    }
  };

  useEffect(() => {
    checkAuthStatus();
    refreshVehicles();
  }, []);

  const refreshVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      if (res.ok) {
        const data = await res.json();
        if (data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles);
          localStorage.setItem('ias_vehicles', JSON.stringify(data.vehicles));
        }
      }
    } catch {
      // Keep local cached vehicles
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem('ias_settings', JSON.stringify(data.settings));
        }
      }
    } catch {
      // Keep local settings
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('ias_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // Setup initial Super Admin IAS-ADMIN-001
  const setupSuperAdmin = async (email: string, password: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/setup-super-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Setup failed' };
      }
      const session: AuthSession = {
        token: data.token,
        adminId: data.admin.adminId,
        name: data.admin.name,
        email: data.admin.email,
        role: data.admin.role,
        requirePasswordChange: data.admin.requirePasswordChange,
      };
      setAuthSession(session);
      localStorage.setItem('ias_auth_session', JSON.stringify(session));
      setSuperAdminSetupComplete(true);
      showToast('Super Admin (IAS-ADMIN-001) muvaffaqiyatli faollashtirildi!', 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tarmoq xatosi yuz berdi';
      return { success: false, message: msg };
    }
  };

  // Login Administrator
  const loginAdmin = async (adminId: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Kirishda xatolik' };
      }
      const session: AuthSession = {
        token: data.token,
        adminId: data.admin.adminId,
        name: data.admin.name,
        email: data.admin.email,
        role: data.admin.role,
        requirePasswordChange: data.admin.requirePasswordChange,
      };
      setAuthSession(session);
      localStorage.setItem('ias_auth_session', JSON.stringify(session));
      showToast(`Xush kelibsiz, ${session.name}!`, 'success');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tarmoq xatosi yuz berdi';
      return { success: false, message: msg };
    }
  };

  const logoutAdmin = () => {
    setAuthSession(null);
    localStorage.removeItem('ias_auth_session');
    showToast('Tizimdan muvaffaqiyatli chiqildi.', 'info');
  };

  const openBooking = (vehicle?: Vehicle) => {
    setSelectedVehicle(vehicle || null);
    setActiveModal('booking');
  };

  const openVehicleDetail = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setActiveModal('vehicleDetail');
  };

  const openAdminLogin = () => setActiveModal('adminLogin');
  const openFavorites = () => setActiveModal('favorites');
  const openDeployGuide = () => setActiveModal('deployGuide');
  const closeModal = () => setActiveModal(null);

  // Submit test-drive booking
  const createBooking = async (bookingData: {
    fullName: string;
    phone: string;
    vehicleId: string;
    vehicleTitle: string;
    preferredDate: string;
    preferredTime: string;
    comments?: string;
  }) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        showToast(
          language === 'uz' ? 'Test-drayv arizangiz qabul qilindi!' : 'Заявка на тест-драйв успешно принята!',
          'success'
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Submit contact inquiry
  const createInquiry = async (inquiryData: {
    fullName: string;
    phone: string;
    email?: string;
    message: string;
  }) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });
      if (res.ok) {
        showToast(
          language === 'uz' ? 'Xabaringiz yuborildi!' : 'Сообщение отправлено!',
          'success'
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Add vehicle
  const addVehicle = async (vehicleData: Partial<Vehicle>) => {
    if (!authSession) {
      showToast('Faqat avtorizatsiyadan o‘tgan adminlar yangi mashina qo‘sha oladi.', 'error');
      return false;
    }
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession.token}`,
        },
        body: JSON.stringify(vehicleData),
      });
      if (res.ok) {
        await refreshVehicles();
        showToast('Yangi avtomobil katalogga qo‘shildi!', 'success');
        return true;
      }
      const err = await res.json();
      showToast(err.error || 'Qo‘shishda xatolik', 'error');
      return false;
    } catch {
      showToast('Tarmoq xatosi', 'error');
      return false;
    }
  };

  // Update vehicle
  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    if (!authSession) return false;
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession.token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await refreshVehicles();
        showToast('Avtomobil ma’lumotlari yangilandi!', 'success');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id: string) => {
    if (!authSession) return false;
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authSession.token}`,
        },
      });
      if (res.ok) {
        await refreshVehicles();
        showToast('Avtomobil o‘chirildi!', 'success');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <SalonContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
        vehicles,
        settings,
        favorites,
        toggleFavorite,
        isFavorite,
        authSession,
        superAdminSetupComplete,
        checkAuthStatus,
        setupSuperAdmin,
        loginAdmin,
        logoutAdmin,
        activeModal,
        selectedVehicle,
        openBooking,
        openVehicleDetail,
        openAdminLogin,
        openFavorites,
        openDeployGuide,
        closeModal,
        refreshVehicles,
        refreshSettings,
        createBooking,
        createInquiry,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        toast,
        showToast,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) throw new Error('useSalon must be used within a SalonProvider');
  return context;
};
