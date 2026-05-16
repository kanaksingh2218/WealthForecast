import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/subscriptions');
      return data.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};
