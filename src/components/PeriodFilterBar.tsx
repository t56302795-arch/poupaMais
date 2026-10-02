import React from 'react';
import { Search, X } from 'lucide-react';
import { CategoryType, PeriodFilter } from '../types';
import { CATEGORIES_CONFIG } from '../utils/formatters';

interface PeriodFilterBarProps {
  currentPeriod: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
  selectedCategory: CategoryType | 'ALL';
  onCategoryChange: (category: CategoryType | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const PeriodFilterBar: React.FC<PeriodFilterBarProps> = ({
  currentPeriod,
  onPeriodChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  hasActiveFilters,
  onResetFilters,
}) => {
  const periods: { id: PeriodFilter; label: string }[] = [
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: 'Esta Semana' },
    { id: 'month', label: 'Este Mês' },
    { id: 'all', label: 'Todos' },
  ];

  const categories = Object.keys(CATEGORIES_CONFIG) as CategoryType[];

  return (
    <div className="space-y-3 pt-2">
      {/* Period Segmented Control + Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Period tabs */}
        <div className="flex bg-slate-200/80 dark:bg-slate-900/90 p-1 rounded-2xl border border-slate-300/80 dark:border-slate-800/80 overflow-x-auto no-scrollbar shadow-xs transition-colors duration-200">
          {periods.map((p) => {
            const isActive = currentPeriod === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPeriodChange(p.id)}
                className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar por descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips (horizontal scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onCategoryChange('ALL')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer shadow-xs ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-950 dark:border-white font-bold'
              : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          Todas Categorias
        </button>

        {categories.map((catKey) => {
          const cfg = CATEGORIES_CONFIG[catKey];
          const Icon = cfg.icon;
          const isSelected = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              onClick={() => onCategoryChange(catKey)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer shadow-xs ${
                isSelected
                  ? `${cfg.bgLight} ${cfg.color} ${cfg.border} ring-1 ring-current font-bold`
                  : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cfg.name}</span>
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer font-medium"
          >
            <X className="w-3 h-3" />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
