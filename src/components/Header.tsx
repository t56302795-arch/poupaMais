import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  MoreVertical, 
  FileSpreadsheet, 
  RotateCcw, 
  Trash2, 
  Coins,
  User,
  Crown
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile } from '../types';
import { CREATOR_SPECIAL_NAME } from '../utils/storage';

interface HeaderProps {
  onOpenAIQuickAdd: () => void;
  onOpenAIInsights: () => void;
  onOpenBudgetModal: () => void;
  onOpenLogin: () => void;
  onResetToSample: () => void;
  onClearAll: () => void;
  onExportCSV: () => void;
  budget: number;
  currentUser: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAIQuickAdd,
  onOpenAIInsights,
  onOpenBudgetModal,
  onOpenLogin,
  onResetToSample,
  onClearAll,
  onExportCSV,
  budget,
  currentUser,
  theme,
  onToggleTheme,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 px-3.5 py-2.5 sm:px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand identity & Creator credit */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-md shadow-emerald-500/20 text-white flex-shrink-0">
            <Coins className="w-5 h-5 text-amber-200" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Poupa<span className="text-emerald-500 dark:text-emerald-400">Mais</span>
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                PWA
              </span>
            </div>
            {/* Creator Attribution with special characters */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Criador:</span>
              <button 
                onClick={onOpenLogin}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer tracking-wide"
                title="Ver perfil do criador"
              >
                <span>{CREATOR_SPECIAL_NAME}</span>
                <Crown className="w-3 h-3 text-amber-500 fill-current inline" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Theme Toggle Button (Light / Dark Mode) */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* AI Insights Button */}
          <button
            onClick={onOpenAIInsights}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-500/15 dark:bg-purple-600/20 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow-xs"
            title="Análise com Inteligência Artificial"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="hidden xs:inline">Dicas IA</span>
          </button>

          {/* User Profile / Login Tab Button */}
          <button
            onClick={onOpenLogin}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
              currentUser.isLoggedIn
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Aba de Login e Perfil"
          >
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline max-w-[90px] truncate">
              {currentUser.isLoggedIn ? currentUser.name : 'Entrar'}
            </span>
          </button>

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Mais opções"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Menu & Configurações</span>
                    <span className="text-emerald-500 font-semibold">{theme === 'dark' ? 'Escuro' : 'Claro'}</span>
                  </div>

                  {/* Toggle Theme in Menu */}
                  <button
                    onClick={() => {
                      onToggleTheme();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-amber-500">
                        <ThemeToggle theme={theme} onToggle={() => {}} className="p-0 border-0 bg-transparent hover:bg-transparent" />
                      </span>
                      <span>{theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>Aba de Login / Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenBudgetModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Target className="w-4 h-4 text-emerald-500" />
                    <span>Ajustar Meta Mensal</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onExportCSV();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-sky-500" />
                    <span>Exportar Dados (CSV)</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onResetToSample();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    <span>Restaurar Gastos de Exemplo</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  {/* Explicit Excluir Histórico button */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onClearAll();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span>Excluir Histórico de Gastos</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
