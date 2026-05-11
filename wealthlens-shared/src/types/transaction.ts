import { CategoryCode } from '../constants/categoryTaxonomy';
import { CurrencyCode } from '../constants/currencyCodes';
import { ImportSource } from '../constants/importSources';

export interface Transaction {
  id: string;
  userId: string;
  date: Date;
  amount: string; // Decimal string
  currency: CurrencyCode;
  description: string;
  merchantName?: string;
  category: CategoryCode;
  subcategory?: string;
  source: ImportSource;
  hash: string;
  isTransfer: boolean;
  importBatchId?: string;
}
