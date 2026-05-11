import React from 'react';
import { format } from 'date-fns';

interface Props {
  transactions: any[];
}

export const ImportPreviewTable: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg">
      <table className="min-w-full text-left">
        <thead className="border-b border-gray-700">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className={`border-b border-gray-700 ${t.isDuplicate ? 'bg-amber-900/30' : ''}`}>
              <td className="px-4 py-2">{format(new Date(t.date), 'MMM dd, yyyy')}</td>
              <td className="px-4 py-2">{t.description}</td>
              <td className="px-4 py-2 font-mono">{t.amount}</td>
              <td className="px-4 py-2">
                {t.isDuplicate ? (
                  <span className="text-amber-400 text-sm">Duplicate</span>
                ) : (
                  <span className="text-green-400 text-sm">Ready</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
