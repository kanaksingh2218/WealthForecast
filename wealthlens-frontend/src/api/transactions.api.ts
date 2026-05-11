import { apiClient } from './client';

export const fetchTransactions = async (params: any) => {
  const { data } = await apiClient.get('/transactions', { params });
  return data;
};

export const updateTransaction = async (id: string, updates: any) => {
  const { data } = await apiClient.patch(`/transactions/${id}`, updates);
  return data;
};
