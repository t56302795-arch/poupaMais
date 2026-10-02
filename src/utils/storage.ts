import { Expense, UserProfile } from '../types';

const STORAGE_KEY = 'poupamais_expenses_v1';
const BUDGET_KEY = 'poupamais_budget_v1';
const USER_KEY = 'poupamais_user_v1';
const THEME_KEY = 'poupamais_theme_v1';

export const CREATOR_NAME = 'Pedro Marques';
export const CREATOR_SPECIAL_NAME = '✦ 𝑷𝒆𝒅𝒓𝒐 𝑴𝒂𝒓𝒒𝒖𝒆𝒔 ✦';

export const CREATOR_PROFILE: UserProfile = {
  id: 'user-creator',
  name: '✦ 𝑷𝒆𝒅𝒓𝒐 𝑴𝒂𝒓𝒒𝒖𝒆𝒔 ✦',
  email: 'pedro.marques@poupamais.app',
  isLoggedIn: true,
  memberSince: 'Criador do Aplicativo',
};

export function loadTheme(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  } catch (e) {
    return 'dark';
  }
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}


export function loadUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      saveUser(CREATOR_PROFILE);
      return CREATOR_PROFILE;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string') {
      return parsed;
    }
    return CREATOR_PROFILE;
  } catch (e) {
    return CREATOR_PROFILE;
  }
}

export function saveUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user:', e);
  }
}


export const INITIAL_SAMPLE_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    description: 'Café expresso e pão de queijo',
    amount: 9.50,
    category: 'Alimentação',
    paymentMethod: 'PIX',
    date: new Date().toISOString().split('T')[0],
    notes: 'Padaria da esquina',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'exp-2',
    description: 'Passagem de ônibus',
    amount: 5.00,
    category: 'Transporte',
    paymentMethod: 'Dinheiro',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'exp-3',
    description: 'Almoço PF no centro',
    amount: 28.00,
    category: 'Alimentação',
    paymentMethod: 'Cartão de Débito',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
  {
    id: 'exp-4',
    description: 'Remédio para dor de cabeça',
    amount: 14.90,
    category: 'Saúde',
    paymentMethod: 'PIX',
    date: getPastDateString(1),
    notes: 'Farmácia Popular',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'exp-5',
    description: 'Corrida de aplicativo (Uber)',
    amount: 19.80,
    category: 'Transporte',
    paymentMethod: 'Cartão de Crédito',
    date: getPastDateString(2),
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
  },
  {
    id: 'exp-6',
    description: 'Sorvete no parque',
    amount: 12.00,
    category: 'Lazer',
    paymentMethod: 'PIX',
    date: getPastDateString(3),
    createdAt: Date.now() - 1000 * 60 * 60 * 75,
  },
];

function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveExpenses(INITIAL_SAMPLE_EXPENSES);
      return INITIAL_SAMPLE_EXPENSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_EXPENSES;
  } catch (e) {
    console.error('Failed to load expenses from localStorage:', e);
    return INITIAL_SAMPLE_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses to localStorage:', e);
  }
}

export function loadBudget(): number {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (raw) {
      const val = parseFloat(raw);
      if (!isNaN(val) && val > 0) return val;
    }
    return 800; // Default monthly small expense budget (R$ 800)
  } catch (e) {
    return 800;
  }
}

export function saveBudget(budget: number): void {
  try {
    localStorage.setItem(BUDGET_KEY, budget.toString());
  } catch (e) {
    console.error('Failed to save budget:', e);
  }
}
