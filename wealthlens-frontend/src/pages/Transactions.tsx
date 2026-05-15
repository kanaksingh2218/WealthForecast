import React from 'react';
import { TransactionFilters } from '../components/forms/TransactionFilters';
import { TransactionTable } from '../components/ui/TransactionTable';
import { useTransactions } from '../hooks/useTransactions';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Transactions: React.FC = () => {
  const [filters, setFilters] = React.useState({ page: 1, limit: 50, search: '', dateFrom: '', dateTo: '', isTransfer: 'false' });
  const { data, isLoading, refetch } = useTransactions(filters);
  const handleFilterChange = (f: any) => setFilters(prev => ({ ...prev, ...f, page: 1 }));
  const handlePageChange = (p: number) => setFilters(prev => ({ ...prev, page: p }));

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Transactions</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All your financial activity in one place.</p>
        </div>
        <div style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {data?.data?.length || 0} of {data?.meta?.total || 0} transactions
        </div>
      </div>

      <div className="wl-card" style={{ padding: 16, marginBottom: 16 }}>
        <TransactionFilters onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-blue)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading transactions...</p>
        </div>
      ) : (
        <>
          <div className="wl-card" style={{ overflow: 'hidden' }}>
            <TransactionTable transactions={data?.data || []} onUpdate={refetch} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '20px 0' }}>
            <button disabled={filters.page === 1} onClick={() => handlePageChange(filters.page - 1)} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', opacity: filters.page === 1 ? 0.3 : 1, display: 'flex', alignItems: 'center' }}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Page <strong style={{ color: 'var(--text-primary)' }}>{filters.page}</strong> of {data?.meta?.totalPages || 1}</span>
            <button disabled={filters.page >= (data?.meta?.totalPages || 1)} onClick={() => handlePageChange(filters.page + 1)} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', opacity: filters.page >= (data?.meta?.totalPages || 1) ? 0.3 : 1, display: 'flex', alignItems: 'center' }}><ChevronRight size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
};