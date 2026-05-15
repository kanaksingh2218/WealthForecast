import React from 'react';
import { CATEGORY_TAXONOMY, ForecastInput } from 'wealthlens-shared';
import { useSettingsStore } from '../../store/settings.store';


interface Props {
  initialValues?: Partial<ForecastInput>;
  onSubmit: (values: ForecastInput) => void;
}

export const ScenarioForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const currency = useSettingsStore((state) => state.currency);
  const symbol = currency === 'INR' ? '₹' : '$';

  const [values, setValues] = React.useState<any>({
    startingNetWorth: initialValues?.startingNetWorth || '0',
    monthlyIncome: initialValues?.monthlyIncome || '5000',
    monthlyExpenses: initialValues?.monthlyExpenses || 
      Object.keys(CATEGORY_TAXONOMY).reduce((acc, cat) => ({ ...acc, [cat]: '500' }), {}),
    annualReturnRate: initialValues?.annualReturnRate || 7,
    annualInflationRate: initialValues?.annualInflationRate || 3,
    annualIncomeGrowthRate: initialValues?.annualIncomeGrowthRate || 3,
    horizonYears: initialValues?.horizonYears || 10,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev: any) => ({ ...prev, [name]: name.includes('Rate') || name === 'horizonYears' ? parseFloat(value) : value }));
  };


  const handleExpenseChange = (category: string, value: string) => {
    setValues((prev: any) => ({
      ...prev,
      monthlyExpenses: { ...prev.monthlyExpenses, [category]: value },
    }));
  };

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(values); }}
      className="space-y-6 bg-gray-800 p-6 rounded-2xl border border-gray-700"
    >
      <h3 className="text-xl font-bold">Forecast Parameters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Starting Net Worth ({symbol})</label>
          <input
            type="number"
            name="startingNetWorth"
            value={values.startingNetWorth}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Monthly Net Income ({symbol})</label>
          <input
            type="number"
            name="monthlyIncome"
            value={values.monthlyIncome}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-300">Monthly Expenses by Category</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Object.keys(CATEGORY_TAXONOMY).map((cat) => (
            <div key={cat} className="p-3 bg-gray-900/40 rounded-xl border border-gray-700/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{cat}</span>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{symbol}</span>
                  <input
                    type="number"
                    min="0"
                    value={values.monthlyExpenses[cat]}
                    onChange={(e) => handleExpenseChange(cat, e.target.value)}
                    className="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-0.5 pl-4 text-xs text-white text-right focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={values.monthlyExpenses[cat]}
                onChange={(e) => handleExpenseChange(cat, e.target.value)}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Return Rate (%)</label>
          <input
            type="number"
            name="annualReturnRate"
            value={values.annualReturnRate}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Inflation Rate (%)</label>
          <input
            type="number"
            name="annualInflationRate"
            value={values.annualInflationRate}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Income Growth (%)</label>
          <input
            type="number"
            name="annualIncomeGrowthRate"
            value={values.annualIncomeGrowthRate}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Horizon (Years)</label>
          <input
            type="number"
            name="horizonYears"
            value={values.horizonYears}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>
      </div>


      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
      >
        Compute Projection
      </button>
    </form>
  );
};
