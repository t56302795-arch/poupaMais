export type CategoryType = 
  | 'Alimentação'
  | 'Transporte'
  | 'Lazer'
  | 'Moradia'
  | 'Saúde'
  | 'Compras'
  | 'Outros';

export type PaymentMethod = 
  | 'PIX'
  | 'Cartão de Débito'
  | 'Cartão de Crédito'
  | 'Dinheiro'
  | 'Outro';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: CategoryType;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: number;
}

export type PeriodFilter = 'today' | 'week' | 'month' | 'all';

export interface AIInsightData {
  headline: string;
  score: string;
  totalAnalyzed?: number;
  topCategoryComment?: string;
  tips: string[];
  microSavingsIdea?: string;
  praise?: string;
  source?: string;
}

export interface ParsedExpenseAI {
  description: string;
  amount: number;
  category: CategoryType;
  paymentMethod: PaymentMethod;
  date: string;
  confidence: 'high' | 'medium' | 'low';
  summary?: string;
}

export type ToastType = 'success' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
  memberSince?: string;
}


