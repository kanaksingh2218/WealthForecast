import React from 'react';

interface Props {
  headers: string[];
  onMap: (mapping: Record<string, string>) => void;
}

export const CSVColumnMapper: React.FC<Props> = ({ headers, onMap }) => {
  const [mapping, setMapping] = React.useState<Record<string, string>>({
    date: '',
    amount: '',
    description: '',
    merchantName: '',
  });

  const handleChange = (field: string, value: string) => {
    const newMapping = { ...mapping, [field]: value };
    setMapping(newMapping);
    if (newMapping.date && newMapping.amount && newMapping.description) {
      onMap(newMapping);
    }
  };

  return (
    <div className="csv-mapper bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Map CSV Columns</h3>
      <div className="space-y-4">
        {['date', 'amount', 'description', 'merchantName'].map((field) => (
          <div key={field} className="flex items-center justify-between">
            <label className="capitalize text-gray-300">{field}:</label>
            <select
              className="bg-gray-700 text-white rounded p-2 w-48"
              value={mapping[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            >
              <option value="">Select Column</option>
              {headers.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
