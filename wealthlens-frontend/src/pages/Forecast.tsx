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
  const [chartScenarios, setChartScenarios] = React.useState<any[]>([]);

  const handleCompute = async (inputs: any) => {
    setLastInputs(inputs);
    const result = await computeForecast.mutateAsync(inputs);
    setCurrentComputeResult(result.data);
  };

  const handleSave = async () => {
    if (!scenarioName || !lastInputs) return;
    await saveScenario.mutateAsync({ name: scenarioName, inputs: lastInputs, isBaseline: scenarios.data?.data?.length === 0 });
    setScenarioName('');
  };

  const toggleScenario = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-3));

  React.useEffect(() => {
    const fetchSelected = async () => {
      if (selectedIds.length === 0) {
        if (currentComputeResult) setChartScenarios([{ name: 'Draft', points: currentComputeResult.points, fiDate: currentComputeResult.fiDate, inputs: lastInputs }]);
        else setChartScenarios([]);
        return;
      }
      const results = await Promise.all(selectedIds.map(async (id) => {
        const s = scenarios.data?.data?.find((x: any) => x._id === id);
        if (!s) return null;
        const r = await computeForecast.mutateAsync(s.inputs);
        return { name: s.name, points: r.data.points, fiDate: r.data.fiDate, inputs: s.inputs };
      }));
      setChartScenarios(results.filter(Boolean));
    };
    fetchSelected();
  }, [selectedIds, scenarios.data, currentComputeResult]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fadeUp">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Wealth Forecast</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Model your financial future across multiple scenarios.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="wl-card" style={{ padding: 20 }}>
            <WealthForecastChart scenarios={chartScenarios} isLoading={computeForecast.isPending} />
          </div>
          {chartScenarios.length > 0 && (
            <div className="wl-card" style={{ padding: 20 }}>
              <ScenarioComparison scenarios={chartScenarios} />
            </div>
          )}
          <div className="wl-card" style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Configure Scenario</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Adjust inputs to model different financial outcomes.</p>
            </div>
            <ScenarioForm onSubmit={handleCompute} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {currentComputeResult && (
            <div className="wl-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Save Scenario</h3>
              <input type="text" placeholder="e.g. Early Retirement" className="wl-input" style={{ marginBottom: 10 }} value={scenarioName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScenarioName(e.target.value)} />
              <button onClick={handleSave} disabled={!scenarioName || saveScenario.isPending} className="wl-btn-primary" style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13 }}>
                <Save size={14} /> Save Scenario
              </button>
            </div>
          )}
          <div className="wl-card" style={{ padding: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Saved Scenarios</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Select up to 3 to compare</p>
            </div>
            <ScenarioList scenarios={scenarios.data?.data || []} selectedIds={selectedIds} onSelect={toggleScenario} onDelete={(id) => deleteScenario.mutate(id)} />
          </div>
        </div>
      </div>
    </div>
  );
};