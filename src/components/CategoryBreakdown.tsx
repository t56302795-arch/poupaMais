import React, { useState } from 'react';
import { Expense, CategoryType } from '../types';
import { CATEGORIES_CONFIG, formatCurrency } from '../utils/formatters';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface CategoryBreakdownProps {
  expenses: Expense[];
  totalSpent: number;
  hideValues: boolean;
  onSelectCategory: (category: CategoryType) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  expenses,
  totalSpent,
  hideValues,
  onSelectCategory,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (expenses.length === 0 || totalSpent <= 0) {
    return null;
  }

  // Aggregate by category
  const breakdown: Record<CategoryType, { total: number; count: number }> = {
    Alimentação: { total: 0, count: 0 },
    Transporte: { total: 0, count: 0 },
    Lazer: { total: 0, count: 0 },
    Moradia: { total: 0, count: 0 },
    Saúde: { total: 0, count: 0 },
    Compras: { total: 0, count: 0 },
    Outros: { total: 0, count: 0 },
  };

  expenses.forEach((e) => {
    if (breakdown[e.category]) {
      breakdown[e.category].total += e.amount;
      breakdown[e.category].count += 1;
    }
  });

  const activeCategories = (Object.keys(breakdown) as CategoryType[])
    .filter((cat) => breakdown[cat].total > 0)
    .sort((a, b) => breakdown[b].total - breakdown[a].total);

  if (activeCategories.length === 0) return null;

  const displayList = isExpanded ? activeCategories : activeCategories.slice(0, 3);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 p-4 sm:p-5 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gastos por Categoria</h3>
        </div>

        {activeCategories.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition font-medium cursor-pointer"
          >
            <span>{isExpanded ? 'Ver menos' : `Ver todas (${activeCategories.length})`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayList.map((catKey) => {
          const cfg = CATEGORIES_CONFIG[catKey];
          const item = breakdown[catKey];
          const pct = Math.round((item.total / totalSpent) * 100);
          const Icon = cfg.icon;

          return (
            <div
              key={catKey}
              onClick={() => onSelectCategory(catKey)}
              className="group cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/40 p-1.5 -mx-1.5 rounded-xl transition"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-lg ${cfg.bgLight} ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cfg.name}</span>
                  <span className="text-[11px] text-slate-500">
                    ({item.count} {item.count === 1 ? 'item' : 'itens'})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {hideValues ? '••••' : formatCurrency(item.total)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 min-w-[28px] text-right">
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cfg.bgLight.replace('/15', '')} bg-emerald-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
