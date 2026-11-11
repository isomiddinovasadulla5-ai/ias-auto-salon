import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Shield, Lock, User, Mail, KeyRound, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const {
    t,
    superAdminSetupComplete,
    setupSuperAdmin,
    loginAdmin,
    authSession,
    logoutAdmin,
  } = useSalon();

  // If super admin is not setup yet, default to setup mode; otherwise login mode
  const [isSetupMode, setIsSetupMode] = useState(!superAdminSetupComplete);

  // Login form state
  const [adminId, setAdminId] = useState('IAS-ADMIN-001');
  const [password, setPassword] = useState('');

  // First-time setup state
  const [ownerEmail, setOwnerEmail] = useState('asadullaisomiddinov54@gmail.com');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerName, setOwnerName] = useState('IAS Owner & Super Admin');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !password) {
      setErrorMsg('Administrator ID va parol kiritilishi shart.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await loginAdmin(adminId.trim(), password);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.message || 'Kirishda xatolik yuz berdi');
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerEmail || !ownerPassword) {
      setErrorMsg('Barcha maydonlarni to‘ldiring.');
      return;
    }

    if (ownerPassword !== confirmPassword) {
      setErrorMsg('Parollar mos kelmadi.');
      return;
    }

    if (ownerPassword.length < 8) {
      setErrorMsg('Parol uzunligi kamida 8 ta belgidan iborat bo‘lishi lozim.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await setupSuperAdmin(ownerEmail.trim(), ownerPassword, ownerName.trim());
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.message || 'Super Admin sozlashda xatolik yuz berdi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-heading font-black text-white">
                {t.admin.portalTitle}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {isSetupMode ? 'Boshqaruvchi hisobini faollashtirish' : t.admin.portalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {authSession ? (
            <div className="text-center py-4 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-xs uppercase font-bold text-amber-400 block mb-1">
                  Faol Sessiya
                </span>
                <div className="text-lg font-heading font-black text-white">
                  {authSession.name}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  ID: <span className="text-amber-300 font-mono font-bold">{authSession.adminId}</span> | Rol:{' '}
                  <span className="font-bold">{authSession.role}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onSuccess}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  Boshqaruv Paneliga O‘tish
                </button>
                <button
                  onClick={logoutAdmin}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                >
                  {t.nav.logout}
                </button>
              </div>
            </div>
          ) : isSetupMode ? (
            /* First-time Super Admin Setup */
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                <span className="font-bold block mb-1">
                  Bosh Administrator (Super Admin) - IAS-ADMIN-001
                </span>
                Tizim egasi ushbu yagona Super Admin hisobi orqali barcha administratorlarni boshqaradi. Iltimos, o‘zingizning maxfiy elektron pochta va kuchli parolingizni belgilang.
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin ID (Tizim tomonidan belgilangan)</span>
                </label>
                <input
                  type="text"
                  disabled
                  value="IAS-ADMIN-001"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.admin.ownerEmail} *</span>
                </label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="asadullaisomiddinov54@gmail.com"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.admin.ownerPassword} *</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="Kamida 8 ta belgi"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.admin.confirmPassword} *</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Parolni qayta tering"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Faollashtirilmoqda...' : t.admin.setupBtn}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSetupMode(false)}
                  className="text-xs text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  Menda hisob mavjud (Tizimga kirish)
                </button>
              </div>
            </form>
          ) : (
            /* Regular Admin Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.admin.adminId} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value.toUpperCase())}
                  placeholder={t.admin.adminIdPlaceholder}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-amber-400 placeholder-zinc-600 focus:outline-none focus:border-amber-500 uppercase"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Bosh Administrator ID: IAS-ADMIN-001
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.admin.password} *</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.admin.passwordPlaceholder}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Kirilmoqda...' : t.admin.loginBtn}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSetupMode(true)}
                  className="text-xs text-amber-400/90 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
                >
                  Super Admin birinchi marta sozlash (IAS-ADMIN-001)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
