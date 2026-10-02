import { CategoryType, PaymentMethod } from '../types';
import { 
  Utensils, 
  Car, 
  Sparkles, 
  Home, 
  HeartPulse, 
  ShoppingBag, 
  MoreHorizontal,
  CreditCard,
  Banknote,
  QrCode,
  Wallet
} from 'lucide-react';
import React from 'react';

export const CATEGORIES_CONFIG: Record<CategoryType, {
  name: CategoryType;
  color: string;
  bgLight: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  Alimentação: {
    name: 'Alimentação',
    color: 'text-amber-400',
    bgLight: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    icon: Utensils,
  },
  Transporte: {
    name: 'Transporte',
    color: 'text-sky-400',
    bgLight: 'bg-sky-500/15',
    border: 'border-sky-500/30',
    icon: Car,
  },
  Lazer: {
    name: 'Lazer',
    color: 'text-purple-400',
    bgLight: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    icon: Sparkles,
  },
  Moradia: {
    name: 'Moradia',
    color: 'text-emerald-400',
    bgLight: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    icon: Home,
  },
  Saúde: {
    name: 'Saúde',
    color: 'text-rose-400',
    bgLight: 'bg-rose-500/15',
    border: 'border-rose-500/30',
    icon: HeartPulse,
  },
  Compras: {
    name: 'Compras',
    color: 'text-indigo-400',
    bgLight: 'bg-indigo-500/15',
    border: 'border-indigo-500/30',
    icon: ShoppingBag,
  },
  Outros: {
    name: 'Outros',
    color: 'text-slate-300',
    bgLight: 'bg-slate-500/15',
    border: 'border-slate-500/30',
    icon: MoreHorizontal,
  },
};

export const PAYMENT_METHODS_CONFIG: Record<PaymentMethod, {
  name: PaymentMethod;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  'PIX': {
    name: 'PIX',
    icon: QrCode,
  },
  'Cartão de Débito': {
    name: 'Cartão de Débito',
    icon: CreditCard,
  },
  'Cartão de Crédito': {
    name: 'Cartão de Crédito',
    icon: CreditCard,
  },
  'Dinheiro': {
    name: 'Dinheiro',
    icon: Banknote,
  },
  'Outro': {
    name: 'Outro',
    icon: Wallet,
  },
};

export function formatCurrency(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateBr(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Hoje';
  }

  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return 'Ontem';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function formatDateFull(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
