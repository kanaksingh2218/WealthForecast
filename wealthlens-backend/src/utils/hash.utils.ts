import crypto from 'crypto';

export const generateTransactionHash = (date: Date, amount: string, description: string): string => {
  const normalizedDate = new Date(date).toISOString().split('T')[0];
  const normalizedAmount = parseFloat(amount).toFixed(2);
  const normalizedDescription = description.trim().toLowerCase();

  const data = `${normalizedDate}|${normalizedAmount}|${normalizedDescription}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};
