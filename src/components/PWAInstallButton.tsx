import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  if (installSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 animate-pulse">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Instalado com sucesso!</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all cursor-pointer"
        title="Instalar PoupaMais no dispositivo para uso offline"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/50 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar no iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="flex-shrink-0 p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">1. Toque em Compartilhar</span>
                    <p className="text-xs text-slate-400 mt-0.5">Na barra inferior do Safari do iPhone.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="flex-shrink-0 p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">2. Adicionar à Tela de Início</span>
                    <p className="text-xs text-slate-400 mt-0.5">Role para baixo no menu e toque nesta opção.</p>
                  </div>
                </div>

                <p className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40 text-center">
                  Pronto! O PoupaMais funcionará como um aplicativo nativo e 100% offline.
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
