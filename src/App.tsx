import React, { useState, useEffect, useMemo } from 'react';
import { Expense, CategoryType, PeriodFilter, ToastMessage, UserProfile } from './types';
import { 
  loadExpenses, 
  saveExpenses, 
  loadBudget, 
  saveBudget, 
  loadUser,
  saveUser,
  loadTheme,
  saveTheme,
  CREATOR_SPECIAL_NAME,
  INITIAL_SAMPLE_EXPENSES 
} from './utils/storage';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { PeriodFilterBar } from './components/PeriodFilterBar';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { AIQuickAddModal } from './components/AIQuickAddModal';
import { AIInsightsModal } from './components/AIInsightsModal';
import { BudgetModal } from './components/BudgetModal';
import { LoginModal } from './components/LoginModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Toast } from './components/Toast';
import { 
  Plus, 
  Sparkles, 
  LayoutDashboard, 
  BrainCircuit, 
  User, 
  Crown,
  Heart
} from 'lucide-react';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [budget, setBudget] = useState<number>(() => loadBudget());
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => loadUser());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadTheme());
  const [hideValues, setHideValues] = useState<boolean>(false);

  // Filters
  const [currentPeriod, setCurrentPeriod] = useState<PeriodFilter>('month');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAIQuickAddOpen, setIsAIQuickAddOpen] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  // Sync theme
  useEffect(() => {
    saveTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync to local storage
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveBudget(budget);
  }, [budget]);

  useEffect(() => {
    saveUser(currentUser);
  }, [currentUser]);

  // Date filtering logic
  const filteredExpenses = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Start of week (Sunday) to end of week (Saturday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    // Current year-month (YYYY-MM)
    const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    return expenses.filter((e) => {
      // Period filter
      if (currentPeriod === 'today') {
        if (e.date !== todayStr) return false;
      } else if (currentPeriod === 'week') {
        if (e.date < startOfWeekStr || e.date > endOfWeekStr) return false;
      } else if (currentPeriod === 'month') {
        if (!e.date.startsWith(currentYearMonth)) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && e.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inDesc = e.description.toLowerCase().includes(q);
        const inCat = e.category.toLowerCase().includes(q);
        const inNotes = e.notes ? e.notes.toLowerCase().includes(q) : false;
        if (!inDesc && !inCat && !inNotes) return false;
      }

      return true;
    });
  }, [expenses, currentPeriod, selectedCategory, searchQuery]);

  // Derived statistics (with rounding to avoid IEEE 754 precision artifacts)
  const totalSpent = useMemo(() => {
    const sum = filteredExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    return Math.round(sum * 100) / 100;
  }, [filteredExpenses]);

  const allTimeTotal = useMemo(() => {
    const sum = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    return Math.round(sum * 100) / 100;
  }, [expenses]);

  const maxExpense = useMemo(() => {
    if (filteredExpenses.length === 0) return 0;
    return Math.max(...filteredExpenses.map((e) => e.amount));
  }, [filteredExpenses]);

  const periodLabel = useMemo(() => {
    switch (currentPeriod) {
      case 'today':
        return 'Hoje';
      case 'week':
        return 'Esta Semana';
      case 'month':
        return 'Este Mês';
      case 'all':
        return 'Geral';
    }
  }, [currentPeriod]);

  // Handlers
  const handleSaveExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      // Update
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...expenseData }
            : item
        )
      );
      showToast('Gasto atualizado com sucesso!', 'success');
    } else {
      // Create
      const newExpense: Expense = {
        ...expenseData,
        id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: Date.now(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
      showToast(`Gasto cadastrado: R$ ${expenseData.amount.toFixed(2)}`, 'success');
    }
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Gasto removido.', 'info');
  };

  const handleClearHistory = () => {
    setExpenses([]);
    showToast('Histórico de gastos excluído com sucesso!', 'warning');
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsManualModalOpen(true);
  };

  const handleResetToSample = () => {
    setExpenses(INITIAL_SAMPLE_EXPENSES);
    showToast('Exemplos de gastos restaurados!', 'info');
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showToast('Nenhum gasto para exportar.', 'warning');
      return;
    }

    const headers = ['ID', 'Data', 'Descrição', 'Valor (R$)', 'Categoria', 'Forma de Pagamento', 'Notas'];
    const rows = expenses.map((e) => [
      e.id,
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      e.amount.toFixed(2).replace('.', ','),
      e.category,
      e.paymentMethod,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `poupamais_gastos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha CSV baixada!', 'success');
  };

  const hasActiveFilters = selectedCategory !== 'ALL' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-24 sm:pb-10 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Top Header */}
      <Header
        onOpenAIQuickAdd={() => setIsAIQuickAddOpen(true)}
        onOpenAIInsights={() => setIsAIInsightsOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onResetToSample={handleResetToSample}
        onClearAll={handleClearHistory}
        onExportCSV={handleExportCSV}
        budget={budget}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-4 space-y-4 flex-1">
        {/* Creator Announcement Banner with special characters */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-emerald-50/80 dark:bg-gradient-to-r dark:from-emerald-950/60 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/90 dark:border-emerald-500/30 text-xs shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-current" />
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              Criado por <strong className="text-emerald-700 dark:text-emerald-400 font-bold tracking-wide">{CREATOR_SPECIAL_NAME}</strong>
            </span>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-semibold underline text-[11px] cursor-pointer"
          >
            Aba de Login / Perfil →
          </button>
        </div>

        {/* Summary & Metrics Card */}
        <SummaryCards
          totalSpent={totalSpent}
          allTimeTotal={allTimeTotal}
          count={filteredExpenses.length}
          budget={budget}
          periodLabel={periodLabel}
          hideValues={hideValues}
          onToggleHideValues={() => setHideValues(!hideValues)}
          onOpenManualAdd={() => {
            setEditingExpense(null);
            setIsManualModalOpen(true);
          }}
          onOpenAIQuickAdd={() => setIsAIQuickAddOpen(true)}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          maxExpense={maxExpense}
        />

        {/* Filters Bar */}
        <PeriodFilterBar
          currentPeriod={currentPeriod}
          onPeriodChange={setCurrentPeriod}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Category Breakdown (Bar Charts) */}
        <CategoryBreakdown
          expenses={filteredExpenses}
          totalSpent={totalSpent}
          hideValues={hideValues}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Expenses List with dedicated Excluir Histórico button */}
        <ExpenseList
          expenses={filteredExpenses}
          hideValues={hideValues}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onClearAllExpenses={handleClearHistory}
          onOpenAddModal={() => {
            setEditingExpense(null);
            setIsManualModalOpen(true);
          }}
        />

        {/* Creator Footer Credit with special characters */}
        <footer className="pt-6 pb-2 text-center text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-900 mt-6 transition-colors duration-200">
          <p className="flex items-center justify-center gap-1.5 flex-wrap">
            <span>PoupaMais • Criado com</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>por</span>
            <strong className="text-slate-800 dark:text-slate-300 font-bold">{CREATOR_SPECIAL_NAME}</strong>
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">
            PWA Mobile-First • Controle de Gastos & Inteligência Artificial
          </p>
        </footer>
      </main>

      {/* Mobile Floating Bottom Bar for Touch Comfort with Login Tab */}
      <nav className="fixed bottom-0 inset-x-0 sm:hidden z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 px-3 py-2 flex items-center justify-around shadow-2xl transition-colors duration-200">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-emerald-500 py-1 transition cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] font-medium">Início</span>
        </button>

        {/* Quick AI Button */}
        <button
          onClick={() => setIsAIQuickAddOpen(true)}
          className="flex flex-col items-center gap-0.5 text-purple-600 dark:text-purple-400 hover:text-purple-500 py-1 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Gasto IA</span>
        </button>

        {/* Prominent Center Add Button */}
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsManualModalOpen(true);
          }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/40 -mt-5 border-4 border-white dark:border-slate-950 active:scale-95 transition cursor-pointer"
          title="Novo Gasto"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* AI Insights Button */}
        <button
          onClick={() => setIsAIInsightsOpen(true)}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-purple-500 py-1 transition cursor-pointer"
        >
          <BrainCircuit className="w-4 h-4" />
          <span className="text-[10px] font-medium">Dicas</span>
        </button>

        {/* Aba de Login / Perfil */}
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 transition cursor-pointer ${
            currentUser.isLoggedIn ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Aba de Login / Perfil"
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-medium truncate max-w-[50px]">
            {currentUser.isLoggedIn ? 'Perfil' : 'Login'}
          </span>
        </button>
      </nav>

      {/* Modals */}
      <ExpenseFormModal
        isOpen={isManualModalOpen}
        onClose={() => {
          setIsManualModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        onSwitchToAI={() => setIsAIQuickAddOpen(true)}
      />

      <AIQuickAddModal
        isOpen={isAIQuickAddOpen}
        onClose={() => setIsAIQuickAddOpen(false)}
        onSaveExpense={handleSaveExpense}
      />

      <AIInsightsModal
        isOpen={isAIInsightsOpen}
        onClose={() => setIsAIInsightsOpen(false)}
        expenses={expenses}
        budget={budget}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={budget}
        onSaveBudget={(newBudget) => {
          setBudget(newBudget);
          showToast(`Meta mensal definida: R$ ${newBudget.toFixed(2)}`, 'success');
        }}
      />

      {/* Aba de Login & Perfil Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updatedUser) => {
          setCurrentUser(updatedUser);
          showToast(
            updatedUser.isLoggedIn
              ? `Bem-vindo, ${updatedUser.name}!`
              : 'Desconectado com sucesso.',
            'info'
          );
        }}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
