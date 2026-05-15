import crypto from 'crypto';

export const generateTransactionHash = (date: Date, amount: string, description: string): string => {
  let normalizedDate: string;
  try {
    normalizedDate = new Date(date).toISOString().split('T')[0];
  } catch (e) {
    normalizedDate = new Date().toISOString().split('T')[0]; // Fallback to avoid crash
  }
  const normalizedAmount = parseFloat(amount).toFixed(2);

  const normalizedDescription = description.trim().toLowerCase();

  const data = `${normalizedDate}|${normalizedAmount}|${normalizedDescription}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};
