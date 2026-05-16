import { CategoryCode } from '../constants/categoryTaxonomy';
import { CurrencyCode } from '../constants/currencyCodes';

export interface CategorySummary {
  category: CategoryCode;
  totalAmount: string;
  currency: CurrencyCode;
  transactionCount: number;
  percentOfIncome: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalIncome: string;
  totalExpenses: string;
  netSavings: string;
  savingsRate: number;
}
