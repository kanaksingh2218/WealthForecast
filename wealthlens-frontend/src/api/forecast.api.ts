import { apiClient } from './client';

export const computeForecast = async (input: any) => {
  const { data } = await apiClient.post('/forecast/compute', input);
  return data;
};

export const fetchScenarios = async () => {
  const { data } = await apiClient.get('/forecast/scenarios');
  return data;
};

export const saveScenario = async (scenario: any) => {
  const { data } = await apiClient.post('/forecast/scenarios', scenario);
  return data;
};

export const deleteScenario = async (id: string) => {
  const { data } = await apiClient.delete(`/forecast/scenarios/${id}`);
  return data;
};
