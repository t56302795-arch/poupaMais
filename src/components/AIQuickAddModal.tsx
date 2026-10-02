import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Check, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { Expense, CategoryType, PaymentMethod, ParsedExpenseAI } from '../types';
import { CATEGORIES_CONFIG, PAYMENT_METHODS_CONFIG, formatCurrency } from '../utils/formatters';

interface AIQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const PRESET_EXAMPLES = [
  'Cafezinho e pão de queijo R$ 8,50 no pix',
  'Almoço no self-service 26,90 no débito',
  'Uber para o trabalho 19,40 no crédito',
  'Remédio na farmácia 34 reais no dinheiro',
  'Lanche na padaria 15,00',
];

export const AIQuickAddModal: React.FC<AIQuickAddModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedExpenseAI | null>(null);

  if (!isOpen) return null;

  const handleParse = async (textToParse?: string) => {
    const text = (textToParse || inputText).trim();
    if (!text) {
      setError('Por favor, digite uma frase descrevendo o gasto.');
      return;
    }

    setLoading(true);
    setError(null);
    setParsedResult(null);

    try {
      const response = await fetch('/api/ai/parse-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      if (!data.amount || data.amount <= 0) {
        setError('Não foi possível identificar o valor monetário na frase. Tente especificar o valor (ex: R$ 15,00).');
        setLoading(false);
        return;
      }

      setParsedResult({
        description: data.description || text,
        amount: Number(data.amount) || 0,
        category: (data.category as CategoryType) || 'Outros',
        paymentMethod: (data.paymentMethod as PaymentMethod) || 'PIX',
        date: data.date || new Date().toISOString().split('T')[0],
        confidence: data.confidence || 'medium',
        summary: data.summary,
      });
    } catch (err: any) {
      console.error('Error contacting AI parsing endpoint:', err);
      // Fallback local heuristic
      const matchNum = text.match(/(?:r\$\s*)?(\d+([.,]\d{1,2})?)/i);
      const amount = matchNum ? parseFloat(matchNum[1].replace(',', '.')) : 0;
      if (amount > 0) {
        setParsedResult({
          description: text.replace(/(?:r\$\s*)?\d+([.,]\d{1,2})?/gi, '').trim() || text,
          amount,
          category: 'Alimentação',
          paymentMethod: 'PIX',
          date: new Date().toISOString().split('T')[0],
          confidence: 'medium',
          summary: 'Identificado localmente.',
        });
      } else {
        setError('Não foi possível identificar os detalhes do gasto. Tente digitar o valor com R$ (ex: Cafezinho R$ 6,00).');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = () => {
    if (!parsedResult) return;

    onSaveExpense({
      description: parsedResult.description,
      amount: parsedResult.amount,
      category: parsedResult.category,
      paymentMethod: parsedResult.paymentMethod,
      date: parsedResult.date,
      notes: parsedResult.summary,
    });

    handleClose();
  };

  const handleClose = () => {
    setInputText('');
    setParsedResult(null);
    setError(null);
    onClose();
  };

  const catCfg = parsedResult ? (CATEGORIES_CONFIG[parsedResult.category] || CATEGORIES_CONFIG['Outros']) : null;
  const payCfg = parsedResult ? (PAYMENT_METHODS_CONFIG[parsedResult.paymentMethod] || PAYMENT_METHODS_CONFIG['Outro']) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 shadow-2xl max-h-[92vh] flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Cadastro Inteligente com IA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Digite livremente como você fala e a IA preenche tudo
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Natural Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              O que você gastou?
            </label>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="Ex: Coxinha com coca 14 reais no débito hoje de manhã..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleParse();
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition resize-none"
                autoFocus
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Pressione Enter ou clique em Analisar
              </span>
              <button
                type="button"
                onClick={() => handleParse()}
                disabled={loading || !inputText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analisar com IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Exemplos rápidos para testar com 1 toque:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_EXAMPLES.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(example);
                    handleParse(example);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/70 transition cursor-pointer"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-2 text-rose-600 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Result Card */}
          {parsedResult && catCfg && payCfg && (
            <div className="mt-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-300 dark:border-emerald-500/40 space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Identificado com Sucesso
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Confiança {parsedResult.confidence}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {parsedResult.description}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${catCfg.bgLight} ${catCfg.color} border ${catCfg.border}`}>
                      <catCfg.icon className="w-3 h-3" />
                      {parsedResult.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-700/60">
                      <payCfg.icon className="w-3 h-3" />
                      {parsedResult.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(parsedResult.amount)}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{parsedResult.date}</p>
                </div>
              </div>

              {parsedResult.summary && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  {parsedResult.summary}
                </p>
              )}

              {/* Confirm button */}
              <button
                type="button"
                onClick={handleConfirmSave}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-md transition active:scale-98 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar e Cadastrar Gasto</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
