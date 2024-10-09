import React from 'react';

interface ProductFilterProps {
  selectedFilters: {
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
  };
  onFilterChange: (filterType: keyof ProductFilterProps['selectedFilters'], value: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ selectedFilters, onFilterChange }) => {
  const filterOptions = {
    couleur: ['Rouge', 'Blanc', 'Rosé'],
    région: ['Bordeaux', 'Côtes du Rhône', 'Provence'],
    millésime: ['2020', '2021', '2022'],
    certification: ['Bio', 'Demeter'],
  };

  return (
    <div className="bg-orange-500 p-12 rounded-lg shadow-lg">
      {Object.entries(filterOptions).map(([filterType, options]) => (
        <div key={filterType} className="mb-4">
          <h3 className="text-white font-bold text-lg mb-2">{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</h3>
          {options.map((option) => (
            <label key={option} className="flex items-center text-gray-800 mb-1 sloganhero">
              <input
                type="checkbox"
                id={`${filterType}-${option}`}
                checked={selectedFilters[filterType as keyof typeof selectedFilters]?.includes(option) || false}
                onChange={() => onFilterChange(filterType as keyof typeof selectedFilters, option)}
                className="mr-2"
              />
              <span className="font-medium">{option}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductFilter;
