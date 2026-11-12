import React, { useState, useEffect } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Vehicle,
  Booking,
  Inquiry,
  AdminAccount,
  AuditLog,
  AdminRole,
  FuelType,
  TransmissionType,
  BodyType,
} from '../../types';
import {
  Car,
  Calendar,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  History,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  DollarSign,
  ShieldAlert,
  KeyRound,
  ExternalLink,
  Upload,
  Globe,
  Share2,
  Check,
  X,
  Send,
  Instagram,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

type TabType =
  | 'overview'
  | 'vehicles'
  | 'bookings'
  | 'inquiries'
  | 'admins'
  | 'analytics'
  | 'settings'
  | 'audit'
  | 'deploy';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    t,
    vehicles,
    settings,
    authSession,
    logoutAdmin,
    refreshVehicles,
    refreshSettings,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    showToast,
  } = useSalon();

  const isSuperAdmin = authSession?.role === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Bookings & Inquiries state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [adminsList, setAdminsList] = useState<AdminAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Vehicle editor modal state
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  // New admin modal state (Super Admin only)
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('ADMIN');
  const [newAdminTempPassword, setNewAdminTempPassword] = useState('');

  // Password Reset state (Super Admin only)
  const [resettingAdmin, setResettingAdmin] = useState<AdminAccount | null>(null);
  const [newTempPassword, setNewTempPassword] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  // Load backend data
  const fetchDashboardData = async () => {
    if (!authSession) return;
    setLoadingData(true);
    try {
      // Fetch bookings
      const bRes = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${authSession.token}` },
      });
      if (bRes.ok) {
        const bData = await bRes.json();
        setBookings(bData.bookings || []);
      }

      // Fetch inquiries
      const iRes = await fetch('/api/inquiries', {
        headers: { Authorization: `Bearer ${authSession.token}` },
      });
      if (iRes.ok) {
        const iData = await iRes.json();
        setInquiries(iData.inquiries || []);
      }

      // Fetch audit logs
      const aRes = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${authSession.token}` },
      });
      if (aRes.ok) {
        const aData = await aRes.json();
        setAuditLogs(aData.logs || []);
      }

      // Fetch admins (Super Admin only)
      if (isSuperAdmin) {
        const admRes = await fetch('/api/admin/admins', {
          headers: { Authorization: `Bearer ${authSession.token}` },
        });
        if (admRes.ok) {
          const admData = await admRes.json();
          setAdminsList(admData.admins || []);
        }
      }
    } catch {
      // offline handling
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [authSession]);

  // Status updates
  const handleBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        showToast('Holat muvaffaqiyatli yangilandi', 'success');
      }
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  const handleInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
        showToast('Murojaat holati yangilandi', 'success');
      }
    } catch {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  // Super Admin: Create Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminId || !newAdminName || !newAdminEmail || !newAdminTempPassword) {
      showToast('Barcha maydonlarni to‘ldiring.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.token}`,
        },
        body: JSON.stringify({
          adminId: newAdminId.toUpperCase().trim(),
          name: newAdminName.trim(),
          email: newAdminEmail.trim(),
          role: newAdminRole,
          temporaryPassword: newAdminTempPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Administrator ${newAdminId} muvaffaqiyatli yaratildi!`, 'success');
        setShowNewAdminModal(false);
        setNewAdminId('');
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminTempPassword('');
        fetchDashboardData();
      } else {
        showToast(data.error || 'Xatolik yuz berdi', 'error');
      }
    } catch {
      showToast('Tarmoq xatosi', 'error');
    }
  };

  // Super Admin: Change Role
  const handleChangeRole = async (targetId: string, role: AdminRole) => {
    if (targetId === 'IAS-ADMIN-001') {
      showToast(t.admin.cannotModifySuperAdmin, 'error');
      return;
    }
    try {
      const res = await fetch(`/api/admin/admins/${targetId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        showToast(`${targetId} roli o‘zgartirildi`, 'success');
        fetchDashboardData();
      }
    } catch {
      showToast('Xatolik', 'error');
    }
  };

  // Super Admin: Toggle Status (Suspend/Activate)
  const handleToggleAdminStatus = async (targetId: string, currentStatus: string) => {
    if (targetId === 'IAS-ADMIN-001') {
      showToast(t.admin.cannotModifySuperAdmin, 'error');
      return;
    }
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/admin/admins/${targetId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast(`${targetId} hisobi ${nextStatus === 'active' ? 'faollashtirildi' : 'to‘xtatildi'}`, 'success');
        fetchDashboardData();
      }
    } catch {
      showToast('Xatolik', 'error');
    }
  };

  // Super Admin: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingAdmin || !newTempPassword) return;
    try {
      const res = await fetch(`/api/admin/admins/${resettingAdmin.adminId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.token}`,
        },
        body: JSON.stringify({ newTemporaryPassword: newTempPassword }),
      });
      if (res.ok) {
        showToast(`${resettingAdmin.adminId} uchun yangi vaqtinchalik parol o‘rnatildi`, 'success');
        setResettingAdmin(null);
        setNewTempPassword('');
      }
    } catch {
      showToast('Xatolik', 'error');
    }
  };

  // Super Admin: Delete Admin
  const handleDeleteAdmin = async (targetId: string) => {
    if (targetId === 'IAS-ADMIN-001') {
      showToast(t.admin.cannotModifySuperAdmin, 'error');
      return;
    }
    if (!window.confirm(`${targetId} hisobini butunlay o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      const res = await fetch(`/api/admin/admins/${targetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authSession?.token}` },
      });
      if (res.ok) {
        showToast(`Administrator ${targetId} o‘chirildi`, 'success');
        fetchDashboardData();
      }
    } catch {
      showToast('Xatolik', 'error');
    }
  };

  // Save Settings (Super Admin)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Faqat Super Admin sozlamalarni o‘zgartira oladi.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession?.token}`,
        },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        await refreshSettings();
        showToast('Sayt sozlamalari va ijtimoiy havolalar yangilandi!', 'success');
      }
    } catch {
      showToast('Xatolik', 'error');
    }
  };

  // Vehicle Save
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    if (!editingVehicle.brand || !editingVehicle.model || !editingVehicle.price || !editingVehicle.year) {
      showToast('Majburiy maydonlarni to‘ldiring: Brend, Model, Yil, Narx', 'error');
      return;
    }

    if (isNewVehicle) {
      const ok = await addVehicle(editingVehicle);
      if (ok) {
        setEditingVehicle(null);
        setIsNewVehicle(false);
      }
    } else if (editingVehicle.id) {
      const ok = await updateVehicle(editingVehicle.id, editingVehicle);
      if (ok) {
        setEditingVehicle(null);
      }
    }
  };

  // Total metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
  const soldVehicles = vehicles.filter((v) => v.status === 'sold').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex flex-col text-zinc-100">
      {/* Top Navbar */}
      <div className="sticky top-0 z-20 bg-zinc-950/90 border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center font-heading font-black text-amber-400 text-sm">
              IAS
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-base sm:text-lg text-white">
                IAS AUTO SALON
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isSuperAdmin
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {authSession?.role}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Admin: <span className="text-zinc-200 font-bold">{authSession?.name}</span> ({authSession?.adminId})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData()}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:text-amber-400 text-zinc-400 transition-colors cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.nav.logout}</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>{t.admin.dashboard}</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4" />
              <span>{t.admin.vehicles}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {totalVehicles}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>{t.admin.bookings}</span>
            </div>
            {pendingBookings > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-black">
                {pendingBookings} yangi
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>{t.admin.inquiries}</span>
            </div>
            {newInquiries > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold">
                {newInquiries}
              </span>
            )}
          </button>

          {/* Super Admin exclusive tabs */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admins'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>{t.admin.adminUsers}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                Super Admin
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>{t.admin.analytics}</span>
            </div>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>{t.admin.settings}</span>
              </div>
            </button>
          )}

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4" />
              <span>{t.admin.auditLogs}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {auditLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'deploy'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4" />
              <span>{t.admin.deployGuide}</span>
            </div>
          </button>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 min-w-0 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-7 overflow-hidden">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-black text-white">
                  Boshqaruv Paneli Umumiy Ko‘rinishi
                </h2>
                <p className="text-xs text-zinc-400">
                  IAS AUTO SALON inventari, mijozlar talablari va real vaqtdagi statistika
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs uppercase font-bold">Jami Avtolar</span>
                    <Car className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-heading font-black text-white">
                    {totalVehicles}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {availableVehicles} ta sotuvda mavjud
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs uppercase font-bold">Sotilgan</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">
                    {soldVehicles}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">Muvaffaqiyatli yetkazilgan</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs uppercase font-bold">Test-Drayv</span>
                    <Calendar className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-heading font-black text-amber-400">
                    {bookings.length}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {pendingBookings} kutilayotgan
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs uppercase font-bold">Murojaatlar</span>
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-heading font-black text-blue-400">
                    {inquiries.length}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">{newInquiries} yangi xabar</div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-semibold text-zinc-300">
                  Tezkor amallar:
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      setEditingVehicle({
                        brand: '',
                        model: '',
                        year: 2024,
                        price: 50000,
                        mileage: 0,
                        fuelType: 'hybrid',
                        transmission: 'automatic',
                        bodyType: 'suv',
                        color: 'Black',
                        status: 'available',
                        isPublished: true,
                        isFeatured: false,
                        features: ['Panoramic Sunroof', '360 Camera', 'Heated Seats'],
                        images: [
                          'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
                        ],
                        descriptionUz: '',
                        descriptionRu: '',
                      });
                      setIsNewVehicle(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.admin.addVehicle}</span>
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={() => setShowNewAdminModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.admin.createAdmin}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Recent Test-Drive Bookings Table */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-sm text-white">
                    So‘nggi Test-drayv Arizalari
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Barchasini ko‘rish
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-3">Hozircha arizalar mavjud emas</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                          <th className="py-2.5">Mijoz</th>
                          <th className="py-2.5">Telefon</th>
                          <th className="py-2.5">Avtomobil</th>
                          <th className="py-2.5">Sana / Vaqt</th>
                          <th className="py-2.5">Holat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {bookings.slice(0, 4).map((b) => (
                          <tr key={b.id}>
                            <td className="py-2.5 font-bold text-zinc-200">{b.fullName}</td>
                            <td className="py-2.5 text-zinc-300 font-mono">{b.phone}</td>
                            <td className="py-2.5 text-amber-400">{b.vehicleTitle}</td>
                            <td className="py-2.5 text-zinc-400">
                              {b.preferredDate} ({b.preferredTime})
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : b.status === 'completed'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : b.status === 'cancelled'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VEHICLES TAB */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-heading font-black text-white">
                    Avtomobillar Inventari Boshqaruvi
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Avtolarni tahrirlash, rasmlarni yangilash, narx o‘zgartirish va sotuv holatini belgilash
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingVehicle({
                      brand: '',
                      model: '',
                      year: 2024,
                      price: 60000,
                      mileage: 0,
                      fuelType: 'electric',
                      transmission: 'automatic',
                      bodyType: 'sedan',
                      color: 'Black Metallic',
                      status: 'available',
                      isPublished: true,
                      isFeatured: false,
                      features: ['Panoramic Roof', '360 Camera', 'Leather Seats'],
                      images: [
                        'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
                      ],
                      descriptionUz: '',
                      descriptionRu: '',
                    });
                    setIsNewVehicle(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.admin.addVehicle}</span>
                </button>
              </div>

              {/* Vehicle List */}
              <div className="space-y-3">
                {vehicles.map((v) => {
                  const img = v.images?.[0] || '';
                  return (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={img}
                          alt={v.model}
                          className="w-20 h-16 rounded-xl object-cover shrink-0 border border-zinc-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-400 uppercase">
                              {v.brand}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                v.status === 'available'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : v.status === 'sold'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {v.status}
                            </span>
                            {!v.isPublished && (
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                                Yashirin
                              </span>
                            )}
                          </div>
                          <h3 className="font-heading font-black text-sm text-white">
                            {v.model} ({v.year})
                          </h3>
                          <div className="text-xs font-mono font-bold text-zinc-300 mt-0.5">
                            ${v.price.toLocaleString()} | {v.mileage.toLocaleString()} km | {v.fuelType}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-zinc-800">
                        {/* Toggle Sold / Available */}
                        <button
                          onClick={() =>
                            updateVehicle(v.id, {
                              status: v.status === 'available' ? 'sold' : 'available',
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            v.status === 'available'
                              ? 'bg-zinc-800 hover:bg-rose-500/20 text-rose-300'
                              : 'bg-zinc-800 hover:bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {v.status === 'available' ? 'Sotildi deb belgilash' : 'Sotuvga qaytarish'}
                        </button>

                        {/* Toggle Publish / Hide */}
                        <button
                          onClick={() => updateVehicle(v.id, { isPublished: !v.isPublished })}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                          title={v.isPublished ? 'Yashirish' : 'Ko‘rsatish'}
                        >
                          {v.isPublished ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-zinc-500" />}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => {
                            setEditingVehicle(v);
                            setIsNewVehicle(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tahrirlash</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(t.admin.confirmDelete)) {
                              deleteVehicle(v.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 cursor-pointer"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-black text-white">
                  Test-drayv Arizalari Ro‘yxati
                </h2>
                <p className="text-xs text-zinc-400">
                  Mijozlar tomonidan jo‘natilgan barcha sinov drayvi vaqtlari
                </p>
              </div>

              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">Arizalar mavjud emas</p>
                ) : (
                  bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-white">
                            {b.fullName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : b.status === 'completed'
                                ? 'bg-blue-500/20 text-blue-400'
                                : b.status === 'cancelled'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-300 font-mono mt-1">
                          Telefon: <a href={`tel:${b.phone}`} className="text-amber-400 underline">{b.phone}</a>
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          Avto: <span className="text-zinc-200 font-semibold">{b.vehicleTitle}</span> | Sana: {b.preferredDate} ({b.preferredTime})
                        </div>
                        {b.comments && (
                          <div className="text-xs text-zinc-400 mt-1 bg-zinc-900/60 p-2 rounded-lg italic">
                            "{b.comments}"
                          </div>
                        )}
                      </div>

                      {/* Status Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBookingStatus(b.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-pointer"
                        >
                          Tasdiqlash
                        </button>
                        <button
                          onClick={() => handleBookingStatus(b.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold cursor-pointer"
                        >
                          Bajarildi
                        </button>
                        <button
                          onClick={() => handleBookingStatus(b.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold cursor-pointer"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-black text-white">
                  Mijoz Murojaatlari (Inquiries)
                </h2>
                <p className="text-xs text-zinc-400">
                  Saytdan jo‘natilgan barcha xabarlar va savollar
                </p>
              </div>

              <div className="space-y-3">
                {inquiries.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">Hozircha murojaatlar yo‘q</p>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-white">
                            {inq.fullName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inq.status === 'resolved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : inq.status === 'contacted'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="text-xs text-zinc-400">
                        Telefon: <a href={`tel:${inq.phone}`} className="text-amber-400 font-mono underline">{inq.phone}</a>
                        {inq.email && <span> | E-mail: {inq.email}</span>}
                      </div>

                      <p className="text-xs text-zinc-200 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 leading-relaxed">
                        {inq.message}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'contacted')}
                          className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
                        >
                          Bog‘lanildi
                        </button>
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'resolved')}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-pointer"
                        >
                          Hal qilindi
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ADMIN MANAGEMENT TAB (SUPER ADMIN ONLY) */}
          {activeTab === 'admins' && isSuperAdmin && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Eksklyuziv Boshqaruv (Super Admin: IAS-ADMIN-001)</span>
                  </div>
                  <h2 className="text-xl font-heading font-black text-white">
                    Administratorlar Ro‘yxati va Ruxsatlar
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Yangi adminlar qo‘shish, vaqtinchalik parol berish, rollarni o‘zgartirish yoki bloklash
                  </p>
                </div>

                <button
                  onClick={() => setShowNewAdminModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.admin.createAdmin}</span>
                </button>
              </div>

              {/* Admins Table */}
              <div className="space-y-3">
                {adminsList.map((admin) => {
                  const isOwner = admin.adminId === 'IAS-ADMIN-001';
                  return (
                    <div
                      key={admin.adminId}
                      className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-amber-400 text-sm">
                            {admin.adminId}
                          </span>
                          <span className="font-bold text-white text-sm">{admin.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              admin.role === 'SUPER_ADMIN'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {admin.role}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              admin.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {admin.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          E-mail: {admin.email} | Yaratilgan: {new Date(admin.createdAt).toLocaleDateString()}
                          {admin.requirePasswordChange && (
                            <span className="ml-2 text-amber-400 font-semibold">(Parol o‘zgartirishi kutilmoqda)</span>
                          )}
                        </div>
                      </div>

                      {/* Super Admin Control Actions */}
                      <div className="flex items-center gap-2">
                        {!isOwner ? (
                          <>
                            <button
                              onClick={() =>
                                handleChangeRole(
                                  admin.adminId,
                                  admin.role === 'ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'
                                )
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                              title="Rolni o‘zgartirish"
                            >
                              {admin.role === 'ADMIN' ? 'Super Admin qilish' : 'Adminga tushirish'}
                            </button>

                            <button
                              onClick={() => handleToggleAdminStatus(admin.adminId, admin.status)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                                admin.status === 'active'
                                  ? 'bg-zinc-800 hover:bg-red-500/20 text-red-300'
                                  : 'bg-zinc-800 hover:bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {admin.status === 'active' ? t.admin.suspendAdmin : t.admin.activateAdmin}
                            </button>

                            <button
                              onClick={() => {
                                setResettingAdmin(admin);
                                setNewTempPassword('');
                              }}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                              title={t.admin.resetPassword}
                            >
                              <KeyRound className="w-4 h-4 text-amber-400" />
                            </button>

                            <button
                              onClick={() => handleDeleteAdmin(admin.adminId)}
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 cursor-pointer"
                              title={t.admin.deleteAdmin}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-400/80 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                            Himoyalangan Bosh Administrator
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-black text-white">
                  Biznes Tahlil va Statistika
                </h2>
                <p className="text-xs text-zinc-400">
                  IAS AUTO SALON savdo hajmi, brendlar taqsimoti va talab tahlili
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand breakdown */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <h3 className="font-heading font-bold text-sm text-zinc-200 mb-4">
                    Katalogdagi Brendlar Taqsimoti
                  </h3>
                  <div className="space-y-3">
                    {['Mercedes-Benz', 'Li Auto', 'Porsche', 'BMW', 'Zeekr', 'BYD', 'Land Rover', 'Chevrolet'].map(
                      (brand) => {
                        const count = vehicles.filter((v) => v.brand.toLowerCase() === brand.toLowerCase()).length;
                        const pct = totalVehicles > 0 ? Math.round((count / totalVehicles) * 100) : 0;
                        return (
                          <div key={brand}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-semibold text-zinc-300">{brand}</span>
                              <span className="font-bold text-amber-400">{count} ta ({pct}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                                style={{ width: `${Math.max(pct, 5)}%` }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Fuel type breakdown */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <h3 className="font-heading font-bold text-sm text-zinc-200 mb-4">
                    Yoqilg‘i Turi Bo‘yicha Taqsimot
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'hybrid', label: 'Gibrid (Hybrid)', color: 'from-blue-500 to-cyan-400' },
                      { key: 'electric', label: 'Elektromobil (EV)', color: 'from-emerald-500 to-teal-400' },
                      { key: 'petrol', label: 'Benzin (Petrol)', color: 'from-amber-500 to-orange-400' },
                      { key: 'diesel', label: 'Dizel (Diesel)', color: 'from-purple-500 to-pink-400' },
                    ].map((f) => {
                      const count = vehicles.filter((v) => v.fuelType === f.key).length;
                      const pct = totalVehicles > 0 ? Math.round((count / totalVehicles) * 100) : 0;
                      return (
                        <div key={f.key}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-zinc-300">{f.label}</span>
                            <span className="font-bold text-zinc-100">{count} ta ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${f.color} rounded-full`}
                              style={{ width: `${Math.max(pct, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB (SUPER ADMIN ONLY) */}
          {activeTab === 'settings' && isSuperAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-black text-white">
                  Sayt va Ijtimoiy Tarmoq Sozlamalari
                </h2>
                <p className="text-xs text-zinc-400">
                  Telegram, Instagram, telefon raqamlari va valyuta kursini boshqarish
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                    <span>Telegram Havolasi (Talab etilgan) *</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={settingsForm.telegramLink}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, telegramLink: e.target.value })
                    }
                    placeholder="https://t.me/ilmiy_ishlar5"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram Havolasi (Talab etilgan) *</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={settingsForm.instagramLink}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, instagramLink: e.target.value })
                    }
                    placeholder="https://www.instagram.com/asadulla_saydullayev1ch/"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
                      Asosiy Telefon
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phonePrimary}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
                      USD / UZS Valyuta kursi
                    </label>
                    <input
                      type="number"
                      value={settingsForm.usdToUzsRate}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          usdToUzsRate: Number(e.target.value) || 12850,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
                    Showroom Manzili (O‘zbekcha)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.addressUz}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, addressUz: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  {t.admin.saveChanges}
                </button>
              </form>
            </div>
          )}

          {/* AUDIT LOGS TAB */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-black text-white">
                  Xavfsizlik va Ma’muriy Audit Jurnali
                </h2>
                <p className="text-xs text-zinc-400">
                  Barcha o‘zgarishlar, loginlar va administrator harakatlari xronologiyasi
                </p>
              </div>

              <div className="space-y-2.5">
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">Audit jurnali bo‘sh</p>
                ) : (
                  auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{log.adminId}</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-200">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-zinc-300">{log.details}</p>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* DEPLOYMENT & GOOGLE SEARCH GUIDE TAB */}
          {activeTab === 'deploy' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-heading font-black text-white">
                  Netlify va Google Search Console O‘rnatish Yo‘riqnomasi
                </h2>
                <p className="text-xs text-zinc-400">
                  Ilovani bepul xostingga joylash va qidiruv tizimlariga tayyorlash bosqichlari
                </p>
              </div>

              <div className="space-y-4 text-xs text-zinc-300">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>1. Netlify-ga Deploy Qilish (SPA Build)</span>
                  </h3>
                  <p>IAS AUTO SALON loyihasi Netlify uchun to‘liq tayyorlangan:</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li><code className="text-amber-300">public/_redirects</code> fayli mavjud (<code className="text-zinc-300">/* /index.html 200</code>)</li>
                    <li>Build command: <code className="text-amber-300">npm run build</code></li>
                    <li>Publish directory: <code className="text-amber-300">dist</code></li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                    <History className="w-4 h-4" />
                    <span>2. SEO, robots.txt va sitemap.xml</span>
                  </h3>
                  <p>Google qidiruv botlari va indekslash uchun barcha fayllar shakllantirilgan:</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li><code className="text-amber-300">/robots.txt</code> – Sayt xaritasini ko‘rsatadi va admin panelni yopadi.</li>
                    <li><code className="text-amber-300">/sitemap.xml</code> – Barcha asosiy bo‘limlar manzillari kiritilgan.</li>
                    <li><code className="text-amber-300">index.html</code> – Schema.org AutoDealer mikro-formati va OpenGraph teglari sozlangan.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>3. Google Search Console orqali Indekslash</span>
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                    <li>Google Search Console (search.google.com/search-console) ga kiring.</li>
                    <li>Sayt domenini (URL prefix) kiriting.</li>
                    <li>HTML teg yoki fayl orqali tasdiqlang.</li>
                    <li>Sitemaps bo‘limida <code className="text-amber-300">https://ias-auto-salon.vercel.app/sitemap.xml</code> manzilini yuboring.</li>
                  </ol>
                  <p className="text-[11px] text-amber-300/80 italic mt-2">
                    Eslatma: Google qidiruv tizimida indekslash avtomatik yoki 100% kafolatlangan emas, u Google algoritmlari va kontent sifatiga bog‘liq.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT VEHICLE */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <h3 className="font-heading font-black text-lg text-white">
                {isNewVehicle ? t.admin.addVehicle : t.admin.editVehicle}
              </h3>
              <button
                onClick={() => setEditingVehicle(null)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Brend *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.brand || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                    placeholder="Mercedes-Benz"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.model || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    placeholder="S 580 4MATIC"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Yil *</label>
                  <input
                    type="number"
                    required
                    value={editingVehicle.year || 2024}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Narx ($) *</label>
                  <input
                    type="number"
                    required
                    value={editingVehicle.price || 0}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, price: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Bosgan yo‘li (km)</label>
                  <input
                    type="number"
                    value={editingVehicle.mileage || 0}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, mileage: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Yoqilg‘i turi</label>
                  <select
                    value={editingVehicle.fuelType || 'hybrid'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuelType: e.target.value as FuelType })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="hybrid">Gibrid</option>
                    <option value="electric">Elektromobil</option>
                    <option value="petrol">Benzin</option>
                    <option value="diesel">Dizel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Kuzov turi</label>
                  <select
                    value={editingVehicle.bodyType || 'sedan'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, bodyType: e.target.value as BodyType })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="coupe">Kupe</option>
                    <option value="crossover">Krossover</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Holati</label>
                  <select
                    value={editingVehicle.status || 'available'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="available">Mavjud</option>
                    <option value="sold">Sotilgan</option>
                    <option value="reserved">Bron qilingan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Rasm havolalari (Har bir qatorda bittadan URL)
                </label>
                <textarea
                  rows={3}
                  value={(editingVehicle.images || []).join('\n')}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      images: e.target.value.split('\n').map((url) => url.trim()).filter(Boolean),
                    })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Tavsif (O‘zbekcha)
                </label>
                <textarea
                  rows={2}
                  value={editingVehicle.descriptionUz || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, descriptionUz: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVehicle.isPublished !== false}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, isPublished: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-500"
                  />
                  <span>Saytda ko‘rsatish</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingVehicle.isFeatured}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, isFeatured: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-500"
                  />
                  <span>VIP Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black cursor-pointer shadow-md"
                >
                  {t.admin.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW ADMIN (SUPER ADMIN ONLY) */}
      {showNewAdminModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="font-heading font-black text-base text-white">
                {t.admin.createAdmin}
              </h3>
              <button
                onClick={() => setShowNewAdminModal(false)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Yangi Administrator ID *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value.toUpperCase())}
                  placeholder="IAS-ADMIN-002"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  To‘liq Ismi *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Jasur Rahimov"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Elektron Pochta *
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@ias-autosalon.uz"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Roli *
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                >
                  <option value="ADMIN">ADMIN (Avtolar va arizalarni boshqarish)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (To‘liq huquqlar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Vaqtinchalik Parol *
                </label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={newAdminTempPassword}
                  onChange={(e) => setNewAdminTempPassword(e.target.value)}
                  placeholder="Masalan: Pass2026!#"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Admin birinchi kirishida parolni yangilashi talab etiladi.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold cursor-pointer"
                >
                  Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD (SUPER ADMIN ONLY) */}
      {resettingAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-heading font-black text-sm text-white mb-2">
              Parolni Tiklash: {resettingAdmin.adminId}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {resettingAdmin.name} uchun yangi vaqtinchalik parol kiriting:
            </p>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <input
                type="text"
                required
                minLength={6}
                value={newTempPassword}
                onChange={(e) => setNewTempPassword(e.target.value)}
                placeholder="Yangi vaqtinchalik parol"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResettingAdmin(null)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 text-xs text-zinc-300"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
