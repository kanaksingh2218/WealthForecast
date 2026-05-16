import crypto from 'crypto';

/**
 * Generates a unique hash for a transaction.
 * @param occurrence Index of this specific (date/amount/desc) combo in the current batch to handle repeat transactions
 */
export const generateTransactionHash = (date: Date, amount: string, description: string, occurrence: number = 0): string => {
  let normalizedDate: string;
  try {
    normalizedDate = new Date(date).toISOString().split('T')[0];
  } catch (e) {
    normalizedDate = new Date().toISOString().split('T')[0];
  }

  const normalizedAmount = parseFloat(amount).toFixed(2);
  const normalizedDescription = description.trim().toLowerCase();

  const data = `${normalizedDate}|${normalizedAmount}|${normalizedDescription}|${occurrence}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};
