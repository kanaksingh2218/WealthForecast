import React from 'react';
import { TransactionFilters } from '../components/forms/TransactionFilters';
import { TransactionTable } from '../components/ui/TransactionTable';
import { useTransactions } from '../hooks/useTransactions';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export const Transactions: React.FC = () => {
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 50,
    search: '',
    dateFrom: '',
    dateTo: '',
    isTransfer: 'false',
  });

  const { data, isLoading, refetch } = useTransactions(filters);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Transactions</h2>
        <div className="text-sm text-gray-500">
          Showing {data?.data?.length || 0} of {data?.meta?.total || 0} transactions
        </div>
      </div>

      <TransactionFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      ) : (
        <>
          <TransactionTable transactions={data?.data || []} onUpdate={refetch} />
          
          <div className="flex items-center justify-center gap-4 py-4">
            <button
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
              className="p-2 border border-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-800"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium">
              Page {filters.page} of {data?.meta?.totalPages || 1}
            </span>
            <button
              disabled={filters.page >= (data?.meta?.totalPages || 1)}
              onClick={() => handlePageChange(filters.page + 1)}
              className="p-2 border border-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-800"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
