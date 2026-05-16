import React from 'react';
import { CATEGORY_TAXONOMY, CategoryCode } from 'wealthlens-shared';

interface Props {
  value: string;
  onSelect: (category: CategoryCode, subcategory?: string) => void;
  className?: string;
}

export const CategorySelect: React.FC<Props> = ({ value, onSelect, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const options = Object.entries(CATEGORY_TAXONOMY).flatMap(([cat, subs]) => [
    { type: 'category', value: cat, label: cat },
    ...subs.map((sub) => ({ type: 'subcategory', value: sub, label: `${cat} > ${sub}`, parent: cat })),
  ]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors hover:bg-[rgba(255,255,255,0.05)]"
        type="button"
      >
        {value || 'Select Category'}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {Object.entries(CATEGORY_TAXONOMY).map(([cat, subs]) => (
            <div key={cat}>
              <button
                onClick={() => {
                  onSelect(cat as CategoryCode);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 font-bold hover:bg-white/10 text-[var(--accent-blue)] text-[11px] uppercase tracking-wider"
                type="button"
              >
                {cat}
              </button>
              {subs.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    onSelect(cat as CategoryCode, sub);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-5 py-1 text-xs hover:bg-white/5 text-gray-300"
                  type="button"
                >
                  {sub}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
