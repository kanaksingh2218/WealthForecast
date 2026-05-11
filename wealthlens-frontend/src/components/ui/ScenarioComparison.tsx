import React from 'react';
import { TrendingUp, Award } from 'lucide-react';

interface Props {
  scenarios: any[];
}

export const ScenarioComparison: React.FC<Props> = ({ scenarios }) => {
  if (scenarios.length < 2) return null;

  const baseline = scenarios[0];
  const others = scenarios.slice(1);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {others.map((s) => {
        const baselineFinal = parseFloat(baseline.points[baseline.points.length - 1].nominalWealth);
        const scenarioFinal = parseFloat(s.points[s.points.length - 1].nominalWealth);
        const delta = scenarioFinal - baselineFinal;

        return (
          <div key={s.name} className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-1">vs. {baseline.name}</h4>
                <p className="text-xl font-bold mb-4">{s.name}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl text-white">
                <TrendingUp size={24} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-3xl font-black text-white">
                {delta >= 0 ? '+' : ''}{formatter.format(delta)}
              </p>
              <p className="text-sm text-gray-400">
                Difference in {s.inputs.horizonYears}-year wealth
              </p>
            </div>

            {s.fiDate && (
              <div className="mt-6 flex items-center gap-2 text-green-400 font-bold text-sm">
                <Award size={18} />
                FI Date: {s.fiDate.month}/{s.fiDate.year}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
