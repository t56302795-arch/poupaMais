import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Loader2, 
  TrendingDown, 
  Coffee, 
  Calculator, 
  ShieldCheck, 
  Lightbulb, 
  PiggyBank,
  RefreshCw
} from 'lucide-react';
import { Expense, AIInsightData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  budget: number;
}

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  isOpen,
  onClose,
  expenses,
  budget,
}) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<AIInsightData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Efeito Cafezinho Simulator State
  const [dailyHabitAmount, setDailyHabitAmount] = useState<number>(8.00);

  useEffect(() => {
    if (isOpen && !insight) {
      fetchInsights();
    }
  }, [isOpen]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze-finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenses,
          monthlyBudget: budget,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar análise financeira.');
      }

      const data = await response.json();
      setInsight(data);
    } catch (err: any) {
      console.error('Error fetching AI insights:', err);
      // Fallback local insight
      setInsight({
        headline: 'Conscientização dos Pequenos Gastos',
        score: 'Bons hábitos em construção',
        tips: [
          'Pequenos gastos com lanches e cafés somados costumam representar até 25% do orçamento mensal.',
          'Estabeleça uma cota diária ou semanal para mimos e lazer para não perder o controle.',
          'Priorize pagamentos via PIX ou débito para sentir a saída imediata do dinheiro.',
        ],
        microSavingsIdea: 'Preparar o café em casa ou levar uma garrafa d\'água pode economizar mais de R$ 120 por mês.',
        praise: 'Você está no caminho certo ao manter seus registros em dia!',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Simulator math
  const monthlyHabit = dailyHabitAmount * 30;
  const yearlyHabit = dailyHabitAmount * 365;
  const r = 0.10 / 12;
  const n = 60;
  const fiveYearInvested = dailyHabitAmount > 0 
    ? monthlyHabit * ((Math.pow(1 + r, n) - 1) / r)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 shadow-2xl max-h-[92vh] flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Inteligência PoupaMais
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Diagnóstico inteligente e simulador de economia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Recalcular análise"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Loading indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Analisando padrões dos seus pequenos gastos com IA...
              </p>
            </div>
          )}

          {!loading && insight && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Headline & Score Card */}
              <div className="p-4 rounded-3xl bg-purple-50/80 dark:bg-gradient-to-br dark:from-purple-950/60 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Diagnóstico Financeiro
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                    {insight.score}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  "{insight.headline}"
                </h4>

                {insight.praise && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ {insight.praise}
                  </p>
                )}
              </div>

              {/* Actionable Tips */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Dicas Práticas para Seus Gastos</span>
                </div>

                <div className="space-y-2">
                  {insight.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed shadow-xs"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro-Savings Idea */}
              {insight.microSavingsIdea && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3 shadow-xs">
                  <div className="p-2 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Ideia de Micro-Economia
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {insight.microSavingsIdea}
                    </p>
                  </div>
                </div>
              )}

              {/* Efeito Cafezinho Simulator */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Simulador do "Efeito Cafezinho"
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Veja quanto um pequeno gasto diário custa no longo prazo
                      </p>
                    </div>
                  </div>
                  <Calculator className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>

                {/* Input daily amount */}
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Gasto diário repetido:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.50"
                      min="1"
                      value={dailyHabitAmount}
                      onChange={(e) => setDailyHabitAmount(Math.max(parseFloat(e.target.value) || 0, 0))}
                      className="w-20 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white text-right focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* Grid Results */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Em 1 Mês</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                      {formatCurrency(monthlyHabit)}
                    </span>
                  </div>
                  
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Em 1 Ano</span>
                    <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mt-1 block">
                      {formatCurrency(yearlyHabit)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 shadow-xs">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block uppercase font-bold">5 Anos Investido</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-300 mt-1 block">
                      {formatCurrency(fiveYearInvested)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
