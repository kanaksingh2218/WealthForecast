import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  onFilterChange: (filters: any) => void;
}

export const TransactionFilters: React.FC<Props> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    isTransfer: 'false',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          name="search"
          placeholder="Search transactions..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          name="dateFrom"
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          value={filters.dateFrom}
          onChange={handleChange}
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          name="dateTo"
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          value={filters.dateTo}
          onChange={handleChange}
        />
      </div>

      <select
        name="isTransfer"
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        value={filters.isTransfer}
        onChange={handleChange}
      >
        <option value="false">Hide Transfers</option>
        <option value="true">Only Transfers</option>
        <option value="both">All Transactions</option>
      </select>
    </div>
  );
};
