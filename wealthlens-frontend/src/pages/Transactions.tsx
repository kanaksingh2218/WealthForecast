import React from 'react';
import { TransactionFilters } from '../components/forms/TransactionFilters';
import { TransactionTable } from '../components/ui/TransactionTable';
import { useTransactions } from '../hooks/useTransactions';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionForm } from '../components/forms/TransactionForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';


export const Transactions: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = React.useState({ page: 1, limit: 50, search: '', dateFrom: '', dateTo: '', isTransfer: 'false' });
  const [showAddModal, setShowAddModal] = React.useState(false);
  const { data, isLoading, refetch } = useTransactions(filters);

  const addMutation = useMutation({
    mutationFn: (values: any) => apiClient.post('/transactions', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setShowAddModal(false);
    }
  });

  const handleFilterChange = (f: any) => setFilters(prev => ({ ...prev, ...f, page: 1 }));

  const handlePageChange = (p: number) => setFilters(prev => ({ ...prev, page: p }));

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Transactions</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All your financial activity in one place.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {data?.data?.length || 0} of {data?.meta?.total || 0} transactions
          </div>
          <button 
            className="wl-btn-primary" 
            style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setShowAddModal(true)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            New Transaction
          </button>
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="wl-card w-full max-w-md p-8 shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-6">Add Transaction</h2>
            <TransactionForm 
              onSubmit={(v) => addMutation.mutate(v)} 
              onCancel={() => setShowAddModal(false)} 
              isPending={addMutation.isPending}
              error={(addMutation.error as any)?.response?.data?.error?.message || (addMutation.error as any)?.message}
            />
          </div>
        </div>
      )}

    </div>

  );
};