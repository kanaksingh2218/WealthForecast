import { apiClient } from './client';

export const fetchSummary = async () => {
  const { data } = await apiClient.get('/analytics/summary');
  return data;
};

export const fetchCategories = async (params: any = {}) => {
  const { data } = await apiClient.get('/analytics/categories', { params });
  return data;
};

export const fetchTrend = async (category?: string) => {
  const { data } = await apiClient.get('/analytics/trend', { params: { category } });
  return data;
};
