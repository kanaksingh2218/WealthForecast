export const IMPORT_SOURCES = ['csv', 'ofx', 'qif', 'plaid', 'manual'] as const;
export type ImportSource = (typeof IMPORT_SOURCES)[number];
