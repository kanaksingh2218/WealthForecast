import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  trend?: number;
  currency?: string;
  isLoading?: boolean;
  isCurrency?: boolean;
}

export const KPICard: React.FC<Props> = ({ label, value, trend, currency = 'USD', isLoading, isCurrency = true }) => {
  const numericValue = typeof value === 'string' ? (parseFloat(value) || 0) : (value || 0);
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' });
  const displayValue = isCurrency ? formatter.format(numericValue) : value;

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 animate-pulse">
        <div className="h-4 w-24 bg-gray-700 rounded mb-4"></div>
        <div className="h-8 w-32 bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all group">
      <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {displayValue}
        </h3>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};