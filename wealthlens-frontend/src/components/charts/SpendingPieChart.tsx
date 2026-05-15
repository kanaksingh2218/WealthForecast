import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  data: any[];
  isLoading?: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export const SpendingPieChart: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-[400px] bg-gray-800/50 rounded-2xl border border-gray-700 animate-pulse flex items-center justify-center text-gray-600">Loading chart...</div>;
  }


  const chartData = data.map((item) => ({
    name: item.category,
    value: parseFloat(item.totalAmount),
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-[400px]">
      <h3 className="text-lg font-bold mb-4">Spending Breakdown</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
      <table className="sr-only">
        <caption>Spending breakdown by category</caption>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((d) => (
            <tr key={d.name}>
              <td>{d.name}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
