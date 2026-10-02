import React from 'react';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Receipt, 
  PieChart, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardsProps {
  totalSpent: number;
  allTimeTotal: number;
  count: number;
  budget: number;
  periodLabel: string;
  hideValues: boolean;
  onToggleHideValues: () => void;
  onOpenManualAdd: () => void;
  onOpenAIQuickAdd: () => void;
  onOpenBudgetModal: () => void;
  maxExpense: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSpent,
  count,
  budget,
  periodLabel,
  hideValues,
  onToggleHideValues,
  onOpenManualAdd,
  onOpenAIQuickAdd,
  onOpenBudgetModal,
  maxExpense,
}) => {
  const averageSpent = count > 0 ? totalSpent / count : 0;
  const rawBudgetPercent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;
  const isOverBudget = budget > 0 && totalSpent > budget;
  const isNearBudget = budget > 0 && totalSpent > budget * 0.75 && !isOverBudget;
  const budgetBalance = budget - totalSpent;

  return (
    <div className="space-y-3">
      {/* Main Total Spend Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 p-5 sm:p-6 shadow-xl shadow-slate-950/60">
        {/* Glow ambient background effect */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Gasto ({periodLabel})
              </span>
              <button
                onClick={onToggleHideValues}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                title={hideValues ? 'Mostrar valores' : 'Ocultar valores por privacidade'}
              >
                {hideValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {hideValues ? '••••••' : formatCurrency(totalSpent)}
              </span>
              <span className="text-xs font-medium text-slate-400">
                em {count} {count === 1 ? 'gasto' : 'gastos'}
              </span>
            </div>
          </div>

          {/* Quick Add CTA Buttons inside Main Card */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAIQuickAdd}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow-md shadow-purple-950"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Gasto com IA</span>
            </button>
            
            <button
              onClick={onOpenManualAdd}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Gasto</span>
            </button>
          </div>
        </div>

        {/* Monthly Budget Progress Section */}
        {budget > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-400">Meta mensal:</span>
                <span className="font-semibold text-white">
                  {hideValues ? '••••••' : formatCurrency(budget)}
                </span>
                <button
                  onClick={onOpenBudgetModal}
                  className="text-[11px] text-emerald-400 hover:underline ml-1 cursor-pointer"
                >
                  ajustar
                </button>
              </div>

              <div className="flex items-center gap-1">
                {isOverBudget ? (
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Estourou ({rawBudgetPercent}%)
                  </span>
                ) : isNearBudget ? (
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Alerta ({rawBudgetPercent}%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    No controle ({rawBudgetPercent}%)
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget
                    ? 'bg-rose-500'
                    : isNearBudget
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(rawBudgetPercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Secondary Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Média por gasto */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Média por gasto</span>
            <Receipt className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {hideValues ? '••••' : formatCurrency(averageSpent)}
          </div>
        </div>

        {/* Maior gasto */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Maior gasto</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {hideValues ? '••••' : formatCurrency(maxExpense)}
          </div>
        </div>

        {/* Saldo restante da meta */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>{budgetBalance < 0 ? 'Excedente da meta' : 'Saldo da meta'}</span>
            <PieChart className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          <div className={`mt-1 text-base sm:text-lg font-bold ${
            budgetBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {hideValues ? '••••' : formatCurrency(budgetBalance)}
          </div>
        </div>
      </div>
    </div>
  );
};
