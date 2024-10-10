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
    color: ['Rouge', 'Blanc', 'Rosé'],
    region: ['Bordeaux', 'Côtes du Rhône', 'Provence', 'Loire'],
    vintage: ['2018', '2019', '2020', '2021', '2022'],
    certification: ['Bio', 'Demeter'],
  };

  return (
    <div className="bg-orange-400 p-12 rounded-lg shadow-lg">
      {Object.entries(filterOptions).map(([filterType, options]) => (
        <div key={filterType} className="mb-4">
          <h3 className="text-white font-bold text-lg mb-2">{filterType === 'color' ? 'Couleur' : filterType === 'region' ? 'Région' : filterType === 'vintage' ? 'Millésime' : 'Certification'}</h3>
          {options.map((option) => (
            <label key={option} className="flex items-center text-gray-800 mb-1 sloganhero">
              <input
                type="checkbox"
                id={`${filterType}-${option}`}
                checked={selectedFilters[filterType as keyof typeof selectedFilters].includes(option)}
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
