import { z } from 'zod';
import { CURRENCY_CODES } from '../constants/currencyCodes';
import { IMPORT_SOURCES } from '../constants/importSources';
import { CATEGORY_TAXONOMY } from '../constants/categoryTaxonomy';

export const TransactionSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  date: z.coerce.date(),
  amount: z.string().regex(/^-?\d+(\.\d+)?$/),
  currency: z.enum(CURRENCY_CODES),
  description: z.string().min(1).max(500),
  merchantName: z.string().max(100).optional(),
  category: z.enum(Object.keys(CATEGORY_TAXONOMY) as [string, ...string[]]),
  subcategory: z.string().optional(),
  source: z.enum(IMPORT_SOURCES),
  hash: z.string(),
  isTransfer: z.boolean().default(false),
  importBatchId: z.string().optional(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
