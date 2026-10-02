import React, { useState } from 'react';
import { X, Target, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onSaveBudget: (budget: number) => void;
}

const PRESET_BUDGETS = [400, 600, 800, 1200, 2000];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSaveBudget,
}) => {
  const [budgetStr, setBudgetStr] = useState(currentBudget.toString());
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetStr.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setError('Por favor, informe um valor de meta válido maior que zero.');
      return;
    }

    onSaveBudget(val);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Meta Mensal de Gastos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Defina um teto para pequenos gastos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Valor da Meta (R$)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                R$
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={budgetStr}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^0-9.,]/g, '');
                  setBudgetStr(sanitized);
                  if (error) setError(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-lg font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">Sugestões rápidas:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BUDGETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBudgetStr(amt.toString())}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Meta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
