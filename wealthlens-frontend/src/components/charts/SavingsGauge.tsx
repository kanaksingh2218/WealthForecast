import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, PolarAngleAxis } from 'recharts';

interface Props {
  savingsRate: number;
  isLoading?: boolean;
}

export const SavingsGauge: React.FC<Props> = ({ savingsRate, isLoading }) => {
  if (isLoading) return <div className="h-[200px] flex items-center justify-center text-gray-500">Loading...</div>;

  const data = [
    { value: Math.min(Math.max(savingsRate, 0), 100) },
  ];

  return (
    <div className="wl-card p-6 h-[250px] relative">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Savings Rate</h3>
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
            blendStroke
          >
            <Cell fill="var(--accent-blue)" />
            { }
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
          { }
          {savingsRate > 0 && (
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
        <span className="text-3xl font-bold text-white">{savingsRate.toFixed(1)}%</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Monthly Average</span>
      </div>
    </div>
  );
};