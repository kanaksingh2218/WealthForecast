import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  data: any[];
  isLoading?: boolean;
  month?: number;
  year?: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export const SpendingPieChart: React.FC<Props> = ({ data, isLoading, month, year }) => {
  if (isLoading) {
    return <div className="h-[400px] bg-gray-800/50 rounded-2xl border border-gray-700 animate-pulse flex items-center justify-center text-gray-600">Loading chart...</div>;
  }

  // First filter the data
  const filteredData = data.filter(item => {
    const isCorrectPeriod = (!month || item.month === month) && (!year || item.year === year);
    const isNotIncome = item.category.toLowerCase() !== 'income';
    return isCorrectPeriod && isNotIncome;
  });

  // Group by category to prevent duplicate slices and clean the numbers
  const groupedData = filteredData.reduce((acc, item) => {
    const val = parseFloat(item.totalAmount) || 0;
    if (val > 0) { // Only include categories with actual spending
      acc[item.category] = (acc[item.category] || 0) + val;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData: { name: string; value: number }[] = Object.entries(groupedData)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value); // Sort biggest to smallest


  return (
    <div className="wl-card p-6" style={{ height: 440, display: 'flex', flexDirection: 'column' }}>
      <h3 className="font-display font-bold text-lg mb-6">Spending Breakdown</h3>

      {chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-3"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" /><path d="M16 16l4 4M20 16l-4 4" /></svg>
          <p className="text-sm font-medium">No spending data for this period</p>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
                  formatter={(value: any) => [`₹${parseFloat(value).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-auto max-h-[120px] custom-scrollbar">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {chartData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-400 truncate">{d.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">₹{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
