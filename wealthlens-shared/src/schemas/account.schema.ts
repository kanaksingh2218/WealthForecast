import { z } from 'zod';
import { CURRENCY_CODES } from '../constants/currencyCodes';
import { ACCOUNT_TYPES } from '../types/account';

export const AccountBalanceSchema = z.object({
  accountId: z.string().optional(),
  userId: z.string(),
  institution: z.string().min(1).max(100),
  type: z.enum(ACCOUNT_TYPES),
  currency: z.enum(CURRENCY_CODES),
  balance: z.string().regex(/^-?\d+(\.\d+)?$/),
  balanceDate: z.coerce.date(),
  isManual: z.boolean().default(true),
});

export type AccountBalanceInput = z.infer<typeof AccountBalanceSchema>;
