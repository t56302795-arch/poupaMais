import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Calendar, 
  FileText, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Expense, CategoryType, PaymentMethod } from '../types';
import { CATEGORIES_CONFIG, PAYMENT_METHODS_CONFIG } from '../utils/formatters';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>, editingId?: string) => void;
  editingExpense?: Expense | null;
  onSwitchToAI?: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  onSwitchToAI,
}) => {
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<CategoryType>('Alimentação');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
    date?: string;
  }>({});

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmountStr(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setPaymentMethod(editingExpense.paymentMethod);
      setDate(editingExpense.date);
      setNotes(editingExpense.notes || '');
    } else {
      resetForm();
    }
    setErrors({});
  }, [editingExpense, isOpen]);

  const resetForm = () => {
    setDescription('');
    setAmountStr('');
    setCategory('Alimentação');
    setPaymentMethod('PIX');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setErrors({});
  };

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { description?: string; amount?: string; date?: string } = {};

    if (!description.trim()) {
      newErrors.description = 'Por favor, informe a descrição do gasto.';
    } else if (description.trim().length < 2) {
      newErrors.description = 'A descrição deve ter pelo menos 2 caracteres.';
    }

    const parsedAmount = parseFloat(amountStr.replace(',', '.'));
    if (!amountStr.trim() || isNaN(parsedAmount)) {
      newErrors.amount = 'Informe um valor numérico válido.';
    } else if (parsedAmount <= 0) {
      newErrors.amount = 'O valor deve ser maior que zero (R$ 0,01).';
    } else if (parsedAmount > 1000000) {
      newErrors.amount = 'O valor informado parece excessivo para um pequeno gasto.';
    }

    if (!date) {
      newErrors.date = 'Selecione uma data.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amountStr.replace(',', '.'));

    onSave(
      {
        description: description.trim(),
        amount: Math.round(parsedAmount * 100) / 100,
        category,
        paymentMethod,
        date,
        notes: notes.trim() || undefined,
      },
      editingExpense ? editingExpense.id : undefined
    );

    onClose();
  };

  const handleQuickAddValue = (increment: number) => {
    const current = parseFloat(amountStr.replace(',', '.')) || 0;
    const nextVal = (current + increment).toFixed(2);
    setAmountStr(nextVal);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const setDateToday = () => {
    setDate(new Date().toISOString().split('T')[0]);
  };

  const setDateYesterday = () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    setDate(y.toISOString().split('T')[0]);
  };

  const categories = Object.keys(CATEGORIES_CONFIG) as CategoryType[];
  const paymentMethods = Object.keys(PAYMENT_METHODS_CONFIG) as PaymentMethod[];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 bg-slate-50 dark:bg-slate-900/90">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {editingExpense ? 'Editar Gasto' : 'Novo Pequeno Gasto'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {editingExpense ? 'Modifique os dados do gasto' : 'Cadastre um gasto do seu dia a dia'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!editingExpense && onSwitchToAI && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToAI();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-500/25 transition cursor-pointer"
                title="Cadastrar digitando uma frase"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden xs:inline">Usar IA</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Valor Input with Quick Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Valor (R$) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                R$
              </div>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amountStr}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^0-9.,]/g, '');
                  setAmountStr(sanitized);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 text-2xl font-extrabold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border ${
                  errors.amount ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500'
                } focus:outline-none transition`}
                autoFocus={!editingExpense}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.amount}
              </p>
            )}

            {/* Quick value increment pills */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 flex-shrink-0">Atalhos:</span>
              {[2, 5, 10, 20, 50].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAddValue(val)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/80 transition cursor-pointer"
                >
                  +{val}
                </button>
              ))}
              {amountStr && (
                <button
                  type="button"
                  onClick={() => setAmountStr('')}
                  className="flex-shrink-0 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 hover:text-rose-500 transition cursor-pointer"
                >
                  zerar
                </button>
              )}
            </div>
          </div>

          {/* Descrição Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Descrição do Gasto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Cafezinho com pão de queijo, Uber, Mercado..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500'
              } focus:outline-none transition`}
            />
            {errors.description && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Categoria Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((catKey) => {
                const cfg = CATEGORIES_CONFIG[catKey];
                const Icon = cfg.icon;
                const isSelected = category === catKey;

                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-medium text-left transition cursor-pointer ${
                      isSelected
                        ? `${cfg.bgLight} ${cfg.color} ${cfg.border} ring-1 ring-current font-bold`
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{cfg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Forma de Pagamento
            </label>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethods.map((methodKey) => {
                const cfg = PAYMENT_METHODS_CONFIG[methodKey];
                const Icon = cfg.icon;
                const isSelected = paymentMethod === methodKey;

                return (
                  <button
                    type="button"
                    key={methodKey}
                    onClick={() => setPaymentMethod(methodKey)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{methodKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Data do Gasto
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={setDateToday}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={setDateYesterday}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Ontem
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Observação / Notas Opcionais */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Observação <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Local, com quem estava, detalhes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/90 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition active:scale-98 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingExpense ? 'Atualizar Gasto' : 'Salvar Gasto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
