import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Crown
} from 'lucide-react';
import { UserProfile } from '../types';
import { CREATOR_PROFILE, CREATOR_SPECIAL_NAME } from '../utils/storage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginAsCreator = () => {
    onUpdateUser({
      ...CREATOR_PROFILE,
      name: CREATOR_SPECIAL_NAME,
      isLoggedIn: true,
    });
    onClose();
  };

  const handleLogout = () => {
    onUpdateUser({
      id: 'guest',
      name: 'Convidado',
      email: '',
      isLoggedIn: false,
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (password.length < 4) {
      setError('A senha deve conter no mínimo 4 caracteres.');
      return;
    }

    if (tab === 'register' && (!name.trim() || name.trim().length < 2)) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    const userName = tab === 'register' ? name.trim() : email.split('@')[0];
    const isCreatorAccount = email.toLowerCase().includes('pedro') || userName.toLowerCase().includes('pedro');

    const updated: UserProfile = {
      id: `user-${Date.now()}`,
      name: isCreatorAccount ? CREATOR_SPECIAL_NAME : userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email.trim().toLowerCase(),
      isLoggedIn: true,
      memberSince: isCreatorAccount ? 'Criador do Aplicativo' : 'Usuário PoupaMais',
    };

    onUpdateUser(updated);
    onClose();
  };

  const isCreator = currentUser.name.toLowerCase().includes('pedro') || currentUser.name.includes('𝑷𝒆𝒅𝒓𝒐');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {currentUser.isLoggedIn ? 'Perfil do Usuário' : 'Acessar PoupaMais'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.isLoggedIn ? 'Sua conta e preferências' : 'Faça login para gerenciar seus gastos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is currently logged in, show Profile Card & Switch/Logout */}
        {currentUser.isLoggedIn ? (
          <div className="py-5 space-y-4">
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/20">
                {currentUser.name.replace(/[^a-zA-Z]/g, '').charAt(0) || 'P'}
                {isCreator && (
                  <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </h4>
                  {isCreator && (
                    <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                      Criador
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {currentUser.email || 'Conta local conectada'}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sessão ativa e sincronizada</span>
                </div>
              </div>
            </div>

            {/* Creator Information Badge */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Aplicativo desenvolvido por <strong className="text-emerald-700 dark:text-emerald-300">{CREATOR_SPECIAL_NAME}</strong></span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">v1.3</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition cursor-pointer shadow-xs"
              >
                Continuar Navegando
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 hover:text-rose-700 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar / Entrar como outro usuário</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login & Register Tabs Form */
          <div className="pt-4 space-y-4">
            {/* Quick Login as Creator Button */}
            <button
              onClick={handleLoginAsCreator}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/60 dark:to-slate-800/80 border border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-400 dark:hover:border-emerald-400/80 transition cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-300">
                  <Crown className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                    Entrar com 1 clique como {CREATOR_SPECIAL_NAME}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Acesso de Criador do Aplicativo</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">ou use e-mail</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Tabs: Entrar vs Cadastrar */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  tab === 'login'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  tab === 'register'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-2 text-rose-600 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ex: Pedro Marques"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 my-auto text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-98 cursor-pointer"
              >
                {tab === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Entrar no Aplicativo</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Cadastrar Conta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
