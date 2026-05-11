export const CURRENCY_CODES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];
