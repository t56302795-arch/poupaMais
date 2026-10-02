import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { ToastType, ToastMessage } from '../types';

export { type ToastType, type ToastMessage };


interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-slate-900 border-emerald-500/40 text-slate-100',
    warning: 'bg-slate-900 border-amber-500/40 text-slate-100',
    info: 'bg-slate-900 border-sky-500/40 text-slate-100',
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-1 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
