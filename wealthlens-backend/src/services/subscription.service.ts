import { Transaction } from '../models/Transaction.model';
import Decimal from 'decimal.js';
import logger from '../config/logger';

export interface Subscription {
  description: string;
  amount: string;
  frequency: 'monthly' | 'yearly';
  lastDate: Date;
  nextOccurrence: Date;
  confidence: number;
}

export class SubscriptionService {

  static async detect(userId: string): Promise<Subscription[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: sixMonthsAgo },
    }).sort({ date: 1 });

    const groups: Record<string, any[]> = {};

    transactions.forEach(t => {
      const key = `${t.description.toLowerCase().trim()}|${t.amount}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    const detected: Subscription[] = [];

    for (const key in groups) {
      const group = groups[key];
      if (group.length < 2) continue;

      let totalDays = 0;
      for (let i = 1; i < group.length; i++) {
        const diff = group[i].date.getTime() - group[i - 1].date.getTime();
        totalDays += diff / (1000 * 60 * 60 * 24);
      }

      const avgInterval = totalDays / (group.length - 1);
      const lastOccurrence = group[group.length - 1];

      if (avgInterval >= 25 && avgInterval <= 35) {
        const nextDate = new Date(lastOccurrence.date);
        nextDate.setMonth(nextDate.getMonth() + 1);

        detected.push({
          description: lastOccurrence.description,
          amount: lastOccurrence.amount,
          frequency: 'monthly',
          lastDate: lastOccurrence.date,
          nextOccurrence: nextDate,
          confidence: group.length >= 3 ? 1.0 : 0.7,
        });
      }
      else if (avgInterval >= 350 && avgInterval <= 380) {
        const nextDate = new Date(lastOccurrence.date);
        nextDate.setFullYear(nextDate.getFullYear() + 1);

        detected.push({
          description: lastOccurrence.description,
          amount: lastOccurrence.amount,
          frequency: 'yearly',
          lastDate: lastOccurrence.date,
          nextOccurrence: nextDate,
          confidence: 0.9,
        });
      }
    }

    return detected;
  }
}
