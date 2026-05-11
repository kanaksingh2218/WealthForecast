import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface Props {
  savingsRate: number;
  isLoading?: boolean;
}

export const SavingsGauge: React.FC<Props> = ({ savingsRate, isLoading }) => {
  if (isLoading) {
    return <div className="h-64 bg-gray-800 rounded-xl animate-pulse"></div>;
  }

  const data = [{ value: savingsRate, fill: '#3B82F6' }];

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-[300px] flex flex-col items-center justify-center relative">
      <h3 className="text-lg font-bold absolute top-6 left-6">Savings Rate</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={90} 
          endAngle={90 - (savingsRate / 100) * 360}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={5} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold">{savingsRate.toFixed(1)}%</span>
        <span className="text-sm text-gray-400">Monthly Average</span>
      </div>
    </div>
  );
};
