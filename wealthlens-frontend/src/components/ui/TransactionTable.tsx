import React from 'react';
import { format } from 'date-fns';
import { CategoryCode } from 'wealthlens-shared';
import { CategorySelect } from './CategorySelect';
import { updateTransaction } from '../../api/transactions.api';
import { useSettingsStore } from '../../store/settings.store';

import { Trash2 } from 'lucide-react';
import { deleteTransaction } from '../../api/transactions.api';

interface Props {
  transactions: any[];
  onUpdate: () => void;
}

export const TransactionTable: React.FC<Props> = ({ transactions, onUpdate }) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const currency = useSettingsStore((state) => state.currency);

  const handleCategoryUpdate = async (id: string, category: CategoryCode, subcategory?: string) => {
    await updateTransaction(id, { category, subcategory });
    setEditingId(null);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        onUpdate();
      } catch (err: any) {
        alert(err.response?.data?.error?.message || 'Failed to delete transaction');
      }
    }
  };


  const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
  });

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700">
      <table className="min-w-full text-left">
        <thead className="bg-gray-900/50 border-b border-gray-700">
          <tr>
            <th className="px-6 py-4 font-semibold text-gray-400">Date</th>
            <th className="px-6 py-4 font-semibold text-gray-400">Description</th>
            <th className="px-6 py-4 font-semibold text-gray-400">Category</th>
            <th className="px-6 py-4 font-semibold text-gray-400 text-right">Amount</th>
            <th className="px-6 py-4 font-semibold text-gray-400 text-center w-20">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-700/30 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-300">
                {format(new Date(t.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium">{t.merchantName || t.description}</div>
                <div className="text-xs text-gray-500 truncate max-w-[200px]">{t.description}</div>
              </td>
              <td className="px-6 py-4">
                {editingId === t.id ? (
                  <CategorySelect
                    value={t.subcategory ? `${t.category} > ${t.subcategory}` : t.category}
                    onSelect={(cat, sub) => handleCategoryUpdate(t.id, cat, sub)}
                    className="w-48"
                  />
                ) : (
                  <button
                    onClick={() => setEditingId(t.id)}
                    className={`text-sm px-3 py-1 rounded-full border border-gray-600 hover:border-blue-500 transition-colors
                      ${t.category === 'Uncategorized' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}
                  >
                    {t.subcategory ? `${t.category} > ${t.subcategory}` : t.category}
                  </button>
                )}
              </td>
              <td className={`px-6 py-4 text-right font-mono font-bold ${parseFloat(t.amount) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {formatter.format(parseFloat(t.amount))}
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2"
                  title="Delete Transaction"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


