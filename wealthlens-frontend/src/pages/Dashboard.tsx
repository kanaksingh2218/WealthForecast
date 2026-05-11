import React from 'react';
import { KPICard } from '../components/ui/KPICard';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart';
import { SavingsGauge } from '../components/charts/SavingsGauge';
import { useAnalytics } from '../hooks/useAnalytics';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { summary, categories, isLoading } = useAnalytics();

  const latestMonth = summary.data?.data?.[summary.data.data.length - 1];
  const previousMonth = summary.data?.data?.[summary.data.data.length - 2];

  const calculateTrend = (current: string, previous: string) => {
    const curr = parseFloat(current || '0');
    const prev = parseFloat(previous || '0');
    if (prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Financial Overview</h2>
        <p className="text-gray-400">Track your income, expenses, and savings at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Income" 
          value={latestMonth?.totalIncome || '0'} 
          trend={latestMonth && previousMonth ? calculateTrend(latestMonth.totalIncome, previousMonth.totalIncome) : undefined}
          isLoading={isLoading} 
        />
        <KPICard 
          label="Total Expenses" 
          value={latestMonth?.totalExpenses || '0'} 
          trend={latestMonth && previousMonth ? calculateTrend(latestMonth.totalExpenses, previousMonth.totalExpenses) : undefined}
          isLoading={isLoading} 
        />
        <KPICard 
          label="Net Savings" 
          value={latestMonth?.netSavings || '0'} 
          isLoading={isLoading} 
        />
        <KPICard 
          label="Savings Rate" 
          value={`${latestMonth?.savingsRate?.toFixed(1) || '0'}%`} 
          currency="" // Not a currency
          isLoading={isLoading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IncomeExpenseBarChart data={summary.data?.data || []} isLoading={isLoading} />
        <SpendingPieChart data={categories.data?.data || []} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SavingsGauge savingsRate={latestMonth?.savingsRate || 0} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Wealth Forecast Preview</h3>
            <p className="text-gray-400 text-sm mb-6">Complete your onboarding to see your 10-year wealth projection.</p>
            <Link to="/forecast" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition-colors">
              Set Forecast Inputs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
