import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../api/transactions.api';

export const useTransactions = (params: any) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchTransactions(params),
    placeholderData: (previousData) => previousData,
  });
};
