import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchScenarios, saveScenario, deleteScenario, computeForecast } from '../api/forecast.api';

export const useForecast = () => {
  const queryClient = useQueryClient();

  const scenariosQuery = useQuery({
    queryKey: ['scenarios'],
    queryFn: fetchScenarios,
  });

  const saveMutation = useMutation({
    mutationFn: saveScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });

  const computeMutation = useMutation({
    mutationFn: computeForecast,
  });

  return {
    scenarios: scenariosQuery,
    saveScenario: saveMutation,
    deleteScenario: deleteMutation,
    computeForecast: computeMutation,
  };
};
