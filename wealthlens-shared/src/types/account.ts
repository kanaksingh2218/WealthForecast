import { CurrencyCode } from '../constants/currencyCodes';

export const ACCOUNT_TYPES = ['checking', 'savings', 'credit', 'investment', 'loan', 'other'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export interface AccountBalance {
  accountId: string;
  userId: string;
  institution: string;
  type: AccountType;
  currency: CurrencyCode;
  balance: string; // Decimal string
  balanceDate: Date;
  isManual: boolean;
}
