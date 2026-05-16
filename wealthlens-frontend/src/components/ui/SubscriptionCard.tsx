import React from 'react';
import { format } from 'date-fns';

interface Subscription {
  description: string;
  amount: string;
  frequency: 'monthly' | 'yearly';
  lastDate: Date | string;
  nextOccurrence: Date | string;
  confidence: number;
}

interface Props {
  subscriptions: Subscription[];
  isLoading?: boolean;
}

export const SubscriptionCard: React.FC<Props> = ({ subscriptions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="wl-card p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wl-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg">Subscription Detective</h3>
        <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20">
          {subscriptions.length} Detected
        </span>
      </div>

      {subscriptions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4 italic">No recurring bills detected yet.</p>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold truncate max-w-[140px]">{sub.description}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Next: {format(new Date(sub.nextOccurrence), 'MMM dd')}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-white">₹{parseFloat(sub.amount).toLocaleString()}</div>
                <div className="text-[10px] text-gray-400 capitalize">{sub.frequency}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
