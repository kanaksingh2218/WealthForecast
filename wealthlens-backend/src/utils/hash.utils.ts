import crypto from 'crypto';

export const generateTransactionHash = (date: Date, amount: string, description: string): string => {
  // Normalize values to ensure consistent hashing
  const normalizedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
  const normalizedAmount = parseFloat(amount).toFixed(2); // Use 2 decimals
  const normalizedDescription = description.trim().toLowerCase();

  const data = `${normalizedDate}|${normalizedAmount}|${normalizedDescription}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};
