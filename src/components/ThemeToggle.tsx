import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
  showLabel = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer border ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border-slate-700/80 hover:border-slate-600'
          : 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200/80 shadow-xs'
      } ${className}`}
      title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      aria-label="Alternar tema claro e escuro"
    >
      {isDark ? (
        <Sun className="w-4 h-4 animate-spin-slow text-amber-300" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </span>
      )}
    </button>
  );
};
