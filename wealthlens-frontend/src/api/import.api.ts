import { apiClient } from './client';

export const uploadFile = async (file: File, mapping?: any) => {
  const formData = new FormData();
  formData.append('file', file);
  if (mapping) {
    formData.append('mapping', JSON.stringify(mapping));
  }

  const { data } = await apiClient.post('/import/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const confirmTransactions = async (transactions: any[]) => {
  const { data } = await apiClient.post('/import/confirm', { transactions });
  return data;
};
