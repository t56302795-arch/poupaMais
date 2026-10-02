import React, { useState } from 'react';
import { Expense } from '../types';
import { CATEGORIES_CONFIG, PAYMENT_METHODS_CONFIG, formatCurrency, formatDateBr } from '../utils/formatters';
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Receipt, 
  Calendar, 
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  hideValues: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onClearAllExpenses: () => void;
  onOpenAddModal: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  hideValues,
  onEditExpense,
  onDeleteExpense,
  onClearAllExpenses,
  onOpenAddModal,
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 p-8 text-center my-4 shadow-xs transition-colors duration-200">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
          <Receipt className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum gasto encontrado</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Não há gastos registrados para os filtros selecionados. Comece cadastrando um pequeno gasto!
        </p>
        <button
          onClick={onOpenAddModal}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Primeiro Gasto</span>
        </button>
      </div>
    );
  }

  // Group expenses by date (sorted descending)
  const groupedByDate: Record<string, Expense[]> = {};
  expenses.forEach((expense) => {
    const key = expense.date;
    if (!groupedByDate[key]) groupedByDate[key] = [];
    groupedByDate[key].push(expense);
  });

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {/* Header bar with Excluir Histórico button */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">
            Histórico de Gastos ({expenses.length})
          </h3>
          <span className="text-[11px] text-slate-500">Ordenado por data recente</span>
        </div>

        {/* Botão de Excluir Histórico */}
        <button
          onClick={() => setShowClearHistoryConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-xs"
          title="Excluir todo o histórico de gastos"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Excluir Histórico</span>
        </button>
      </div>

      <div className="space-y-4">
        {sortedDates.map((dateKey) => {
          const dayExpenses = groupedByDate[dateKey];
          const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

          return (
            <div key={dateKey} className="space-y-2">
              {/* Date Group Header */}
              <div className="flex items-center justify-between px-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{formatDateBr(dateKey)}</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {hideValues ? '••••' : formatCurrency(dayTotal)}
                </span>
              </div>

              {/* Day Expense Items */}
              <div className="space-y-2">
                {dayExpenses.map((expense) => {
                  const catCfg = CATEGORIES_CONFIG[expense.category] || CATEGORIES_CONFIG['Outros'];
                  const payCfg = PAYMENT_METHODS_CONFIG[expense.paymentMethod] || PAYMENT_METHODS_CONFIG['Outro'];
                  const CatIcon = catCfg.icon;
                  const PayIcon = payCfg.icon;

                  return (
                    <div
                      key={expense.id}
                      className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-slate-700/80 transition-all shadow-xs"
                    >
                      {/* Left: Icon & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${catCfg.bgLight} ${catCfg.color} flex items-center justify-center border ${catCfg.border}`}>
                          <CatIcon className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                            {expense.description}
                          </h4>
                          
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {expense.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <PayIcon className="w-3 h-3" />
                              {expense.paymentMethod}
                            </span>
                          </div>

                          {expense.notes && (
                            <p className="text-[11px] text-slate-500 italic truncate mt-0.5">
                              "{expense.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          {hideValues ? '••••' : formatCurrency(expense.amount)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditExpense(expense)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Editar gasto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setExpenseToDelete(expense)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                            title="Excluir gasto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Single Item Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Excluir este gasto?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Esta ação não poderá ser desfeita.</p>
              </div>
            </div>

            <div className="my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
              <div className="font-semibold text-slate-900 dark:text-white text-sm">{expenseToDelete.description}</div>
              <div className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-0.5">
                {formatCurrency(expenseToDelete.amount)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpenseToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                Cancelar
              </button>
              
              <button
                onClick={() => {
                  onDeleteExpense(expenseToDelete.id);
                  setExpenseToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-md shadow-rose-950/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete ALL History Confirmation Modal */}
      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/40 p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Excluir todo o histórico?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Atenção: todos os gastos serão apagados.</p>
              </div>
            </div>

            <div className="my-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
              Você está prestes a apagar <strong>{expenses.length} gastos registrados</strong>. O valor total acumulado voltará para R$ 0,00. Esta ação é irreversível.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowClearHistoryConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                Manter Gastos
              </button>

              <button
                onClick={() => {
                  setShowClearHistoryConfirm(false);
                  onClearAllExpenses();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-lg shadow-rose-950/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir Tudo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
