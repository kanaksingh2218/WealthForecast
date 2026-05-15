import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: any[];
  isLoading?: boolean;
}

export const IncomeExpenseBarChart: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-[400px] bg-gray-800/50 rounded-2xl border border-gray-700 animate-pulse flex items-center justify-center text-gray-600">Loading chart...</div>;
  }


  const chartData = data.map((item) => ({
    name: `${item.year}-${item.month.toString().padStart(2, '0')}`,
    income: parseFloat(item.totalIncome),
    expense: parseFloat(item.totalExpenses),
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-[400px]">
      <h3 className="text-lg font-bold mb-4">Income vs Expense</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
