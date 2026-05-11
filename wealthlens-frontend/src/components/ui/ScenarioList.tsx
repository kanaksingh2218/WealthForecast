import React from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  scenarios: any[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ScenarioList: React.FC<Props> = ({ scenarios, selectedIds, onSelect, onDelete }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Saved Scenarios</h3>
      <div className="grid grid-cols-1 gap-3">
        {scenarios.map((s) => (
          <div 
            key={s._id}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between
              ${selectedIds.includes(s._id) ? 'bg-blue-600/10 border-blue-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
            onClick={() => onSelect(s._id)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedIds.includes(s._id) ? 'text-blue-400' : 'text-gray-500'}`}>
                {selectedIds.includes(s._id) ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-700" />}
              </div>
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-xs text-gray-400">{s.inputs.horizonYears} years @ {s.inputs.annualReturnRate}%</div>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(s._id); }}
              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {scenarios.length === 0 && (
          <p className="text-sm text-gray-500 italic">No saved scenarios yet.</p>
        )}
      </div>
    </div>
  );
};
