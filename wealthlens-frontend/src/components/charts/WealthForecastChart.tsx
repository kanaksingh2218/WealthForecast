import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSettingsStore } from '../../store/settings.store';


interface Props {
  scenarios: any[];
  isLoading?: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export const WealthForecastChart: React.FC<Props> = ({ scenarios, isLoading }) => {
  const currency = useSettingsStore((state) => state.currency);

  if (isLoading) {
    return <div className="h-96 bg-gray-800 rounded-2xl animate-pulse"></div>;
  }

  if (scenarios.length === 0) {
    return (
      <div className="h-96 bg-gray-800 rounded-2xl border border-gray-700 flex items-center justify-center text-gray-500 italic">
        Enter parameters to see your wealth projection
      </div>
    );
  }

  const chartData: any[] = [];
  const maxPoints = Math.max(...scenarios.map((s) => s.points.length));

  for (let i = 0; i < maxPoints; i++) {
    const pointData = scenarios[0].points[i];
    const point: any = {
      name: pointData ? `${pointData.year}-${(pointData.month || 0).toString().padStart(2, '0')}` : '',
    };

    scenarios.forEach((s) => {
      point[s.name] = parseFloat(s.points[i]?.nominalWealth || '0');
    });
    chartData.push(point);
  }

  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  const formatter = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      notation: 'compact',
    }).format(value);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-[500px]">
      <h3 className="text-xl font-bold mb-6">Wealth Forecast</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => value.split('-')[0]}
            interval="preserveStartEnd"
            minTickGap={40}
          />

          <YAxis
            stroke="#9CA3AF"
            tickFormatter={formatter}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px' }}
            formatter={(value: number) => [new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(value)]}
          />

          <Legend />
          {scenarios.map((s, index) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
