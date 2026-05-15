import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, PolarAngleAxis } from 'recharts';

interface Props {
  savingsRate: number;
  isLoading?: boolean;
}

export const SavingsGauge: React.FC<Props> = ({ savingsRate, isLoading }) => {
  if (isLoading) {
    return (
      <div className="wl-card p-6 h-[250px] flex flex-col items-center justify-center bg-gray-800/50 animate-pulse">
        <div className="w-32 h-32 rounded-full border-8 border-gray-700"></div>
      </div>
    );
  }

  const data = [
    { value: Math.min(Math.max(savingsRate, 0), 100) },
    { value: 100 - Math.min(Math.max(savingsRate, 0), 100) }
  ];

  return (
    <div className="wl-card p-6 h-[250px] relative overflow-hidden">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Savings Rate</h3>
      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              stroke="none"
            >
              <Cell fill="var(--accent-blue)" />
              <Cell fill="rgba(255,255,255,0.05)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-12 pointer-events-none">
        <span className="text-3xl font-bold text-white">{savingsRate.toFixed(1)}%</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Monthly Average</span>
      </div>
    </div>
  );
};