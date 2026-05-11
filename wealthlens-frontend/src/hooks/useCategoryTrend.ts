import { useQuery } from '@tanstack/react-query';
import { fetchTrend } from '../api/analytics.api';

export const useCategoryTrend = (category?: string) => {
  return useQuery({
    queryKey: ['analytics', 'trend', category],
    queryFn: () => fetchTrend(category),
    enabled: !!category,
  });
};
