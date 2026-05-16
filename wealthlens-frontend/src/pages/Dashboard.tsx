import React from 'react';
import { KPICard } from '../components/ui/KPICard';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart';
import { SavingsGauge } from '../components/charts/SavingsGauge';
import { useAnalytics } from '../hooks/useAnalytics';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { SubscriptionCard } from '../components/ui/SubscriptionCard';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { summary, categories, isLoading } = useAnalytics();
  const { data: subscriptions, isLoading: isSubsLoading } = useSubscriptions();

  const [selectedMonthIdx, setSelectedMonthIdx] = React.useState<number | null>(null);

  const months = summary.data?.data || [];
  
  // Default to the latest month when data loads
  React.useEffect(() => {
    if (months.length > 0 && selectedMonthIdx === null) {
      // Find latest month with income > 0, or just the last month
      const lastWithData = [...months].reverse().findIndex(m => parseFloat(m.totalIncome) > 0);
      const idx = lastWithData !== -1 ? months.length - 1 - lastWithData : months.length - 1;
      setSelectedMonthIdx(idx);
    }
  }, [months, selectedMonthIdx]);

  const latestMonth = selectedMonthIdx !== null ? months[selectedMonthIdx] : null;
  const previousMonth = selectedMonthIdx !== null && selectedMonthIdx > 0 ? months[selectedMonthIdx - 1] : null;

  const calculateTrend = (current: string, previous: string) => {
    const curr = parseFloat(current || '0');
    const prev = parseFloat(previous || '0');
    if (prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const monthName = latestMonth ? new Date(latestMonth.year, latestMonth.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }) : '';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fadeUp">
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{greeting}.</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Snapshot for </p>
            {months.length > 0 && (
              <select 
                value={selectedMonthIdx || 0} 
                onChange={(e) => setSelectedMonthIdx(parseInt(e.target.value))}
                className="bg-transparent text-[var(--accent-blue)] font-bold border-none p-0 cursor-pointer focus:ring-0 text-sm"
              >
                {months.map((m: any, i: number) => (
                  <option key={i} value={i} className="bg-gray-900 text-white">
                    {new Date(m.year, m.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/import" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v8M4 7l3 3 3-3M2 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Import
          </Link>
          <Link to="/transactions" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}>
            Transactions
          </Link>
        </div>
      </div>

      <div className="wl-grid-4 mb-5">
        <KPICard label="Total Income" value={latestMonth?.totalIncome || '0'} trend={latestMonth && previousMonth ? calculateTrend(latestMonth.totalIncome, previousMonth.totalIncome) : undefined} isLoading={isLoading} />
        <KPICard label="Total Expenses" value={latestMonth?.totalExpenses || '0'} trend={latestMonth && previousMonth ? calculateTrend(latestMonth.totalExpenses, previousMonth.totalExpenses) : undefined} isLoading={isLoading} />
        <KPICard label="Net Savings" value={latestMonth?.netSavings || '0'} isLoading={isLoading} />
        <KPICard label="Savings Rate" value={(latestMonth?.savingsRate?.toFixed(1) || '0') + '%'} isCurrency={false} isLoading={isLoading} />
      </div>

      <div className="wl-grid-2 mb-5">
        <IncomeExpenseBarChart data={summary.data?.data || []} isLoading={isLoading} />
        <SpendingPieChart 
          data={categories.data?.data || []} 
          isLoading={isLoading} 
          month={latestMonth?.month}
          year={latestMonth?.year}
        />
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <SavingsGauge savingsRate={latestMonth?.savingsRate || 0} isLoading={isLoading} />
        
        <SubscriptionCard subscriptions={subscriptions || []} isLoading={isSubsLoading} />

        <div className="wl-card" style={{ padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} viewBox="0 0 400 120" preserveAspectRatio="none">
            <path d="M0 80 L50 70 L100 75 L150 55 L200 45 L250 30 L300 20 L350 10 L400 5" stroke="#3B82F6" strokeWidth="2" fill="none"/>
            <path d="M0 80 L50 70 L100 75 L150 55 L200 45 L250 30 L300 20 L350 10 L400 5 L400 120 L0 120Z" fill="#3B82F6"/>
          </svg>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 14L7 10L10 13L14 8L17 5" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>10-Year Wealth Forecast</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, maxWidth: 280 }}>See where your wealth will be with compound growth projections.</p>
            <Link to="/forecast" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}>Run Forecast</Link>
          </div>
        </div>
      </div>
    </div>
  );
};