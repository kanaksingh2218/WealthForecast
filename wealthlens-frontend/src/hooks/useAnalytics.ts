import { useQuery } from '@tanstack/react-query';
import { fetchSummary, fetchCategories } from '../api/analytics.api';

export const useAnalytics = (params: any = {}) => {
  const summaryQuery = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: fetchSummary,
    refetchOnWindowFocus: false,
  });

  const categoriesQuery = useQuery({
    queryKey: ['analytics', 'categories', params],
    queryFn: () => fetchCategories(params),
    refetchOnWindowFocus: false,
  });


  return {
    summary: summaryQuery,
    categories: categoriesQuery,
    isLoading: summaryQuery.isLoading || categoriesQuery.isLoading,
    isError: summaryQuery.isError || categoriesQuery.isError,
  };
};
