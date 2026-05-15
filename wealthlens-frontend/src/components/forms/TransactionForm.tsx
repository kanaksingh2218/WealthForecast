import React from 'react';
import { CategoryCode } from 'wealthlens-shared';
import { CategorySelect } from '../ui/CategorySelect';

interface Props {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
}

export const TransactionForm: React.FC<Props> = ({ onSubmit, onCancel, isPending, error }) => {
  const [values, setValues] = React.useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Uncategorized' as CategoryCode,
    subcategory: '',
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(values); }} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}
      <div>

        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Date</label>
        <input 
          type="date" 
          required 
          value={values.date} 
          onChange={(e) => setValues({ ...values, date: e.target.value })}
          className="wl-input" 
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Description</label>
        <input 
          type="text" 
          required 
          placeholder="e.g. Starbucks Coffee" 
          value={values.description} 
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          className="wl-input" 
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Amount</label>
        <input 
          type="number" 
          step="0.01" 
          required 
          placeholder="0.00" 
          value={values.amount} 
          onChange={(e) => setValues({ ...values, amount: e.target.value })}
          className="wl-input" 
        />
        <p className="text-[10px] text-gray-500 mt-1">Use negative for expenses, positive for income.</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Category</label>
        <CategorySelect 
          value={values.subcategory ? `${values.category} > ${values.subcategory}` : values.category}
          onSelect={(cat, sub) => setValues({ ...values, category: cat, subcategory: sub || '' })}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
        <button type="submit" disabled={isPending} className="flex-2 wl-btn-primary px-8 py-2 text-sm">
          {isPending ? 'Adding...' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
};
