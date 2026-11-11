import React from 'react';
import { useSalon } from '../../context/SalonContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useSalon();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border ${
          toast.type === 'success'
            ? 'bg-zinc-900/90 border-emerald-500/40 text-emerald-200'
            : toast.type === 'error'
            ? 'bg-zinc-900/90 border-red-500/40 text-red-200'
            : 'bg-zinc-900/90 border-amber-500/40 text-amber-200'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400" />}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
      </div>
    </div>
  );
};
