import { z } from 'zod';
import { CURRENCY_CODES } from '../constants/currencyCodes';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  displayName: z.string().max(100).optional(),
  defaultCurrency: z.enum(CURRENCY_CODES).default('USD'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
