import { CurrencyCode } from '../constants/currencyCodes';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  defaultCurrency: CurrencyCode;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
}
