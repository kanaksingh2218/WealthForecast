import React from 'react';
import { WealthForecastChart } from '../components/charts/WealthForecastChart';
import { ScenarioForm } from '../components/forms/ScenarioForm';
import { ScenarioList } from '../components/ui/ScenarioList';
import { ScenarioComparison } from '../components/ui/ScenarioComparison';
import { useForecast } from '../hooks/useForecast';
import { Save } from 'lucide-react';

export const Forecast: React.FC = () => {
  const { scenarios, computeForecast, saveScenario, deleteScenario } = useForecast();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentComputeResult, setCurrentComputeResult] = React.useState<any>(null);
  const [scenarioName, setScenarioName] = React.useState('');
  const [lastInputs, setLastInputs] = React.useState<any>(null);

  const handleCompute = async (inputs: any) => {
    setLastInputs(inputs);
    const result = await computeForecast.mutateAsync(inputs);
    setCurrentComputeResult(result.data);
  };

  const handleSave = async () => {
    if (!scenarioName || !lastInputs) return;
    await saveScenario.mutateAsync({
      name: scenarioName,
      inputs: lastInputs,
      isBaseline: scenarios.data?.data?.length === 0,
    });
    setScenarioName('');
  };

  const toggleScenario = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-3)
    );
  };

  // Prepare chart data: merge current result and selected scenarios
  const selectedScenarios = scenarios.data?.data
    ?.filter((s: any) => selectedIds.includes(s._id))
    .map((s: any) => ({
      ...s,
      points: computeForecast.mutateAsync(s.inputs).then(r => r.data.points) // This is tricky with mutation
    }));

  // Actually we should pre-compute or use a different hook for chart data
  // For simplicity now, let's just use the scenarios that we manually compute
  const [chartScenarios, setChartScenarios] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchSelected = async () => {
      if (selectedIds.length === 0) {
        if (currentComputeResult) setChartScenarios([{ name: 'Draft', points: currentComputeResult.points, fiDate: currentComputeResult.fiDate, inputs: lastInputs }]);
        else setChartScenarios([]);
        return;
      }

      const results = await Promise.all(selectedIds.map(async (id) => {
        const s = scenarios.data.data.find((x: any) => x._id === id);
        const r = await computeForecast.mutateAsync(s.inputs);
        return { name: s.name, points: r.data.points, fiDate: r.data.fiDate, inputs: s.inputs };
      }));
      setChartScenarios(results);
    };
    fetchSelected();
  }, [selectedIds, scenarios.data, currentComputeResult]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Wealth Forecast</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <WealthForecastChart 
            scenarios={chartScenarios} 
            isLoading={computeForecast.isPending} 
          />
          
          <ScenarioComparison scenarios={chartScenarios} />

          <ScenarioForm onSubmit={handleCompute} />
        </div>

        <div className="space-y-6">
          {currentComputeResult && (
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-4">
              <h3 className="text-lg font-bold">Save this scenario</h3>
              <input 
                type="text"
                placeholder="Scenario name (e.g. Early Retirement)"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                value={scenarioName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScenarioName(e.target.value)}
              />
              <button 
                onClick={handleSave}
                disabled={!scenarioName || saveScenario.isPending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-2 rounded-lg font-bold transition-all"
              >
                <Save size={18} />
                Save Scenario
              </button>
            </div>
          )}

          <ScenarioList 
            scenarios={scenarios.data?.data || []}
            selectedIds={selectedIds}
            onSelect={toggleScenario}
            onDelete={(id) => deleteScenario.mutate(id)}
          />
        </div>
      </div>
    </div>
  );
};
