import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wine, Grape } from 'lucide-react';

interface ProductFilterProps {
  selectedFilters?: {
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
  };
  onFilterChange?: (filterType: keyof ProductFilterProps['selectedFilters'], value: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedFilters = {
    color: [],
    region: [],
    vintage: [],
    certification: []
  },
  onFilterChange = () => {}
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['color']);

  const filterOptions = {
    color: ['Rouge', 'Blanc', 'Rosé'],
    region: ['Bordeaux', 'Côtes du Rhône', 'Provence', 'Loire'],
    vintage: ['2018', '2019', '2020', '2021', '2022'],
    certification: ['Bio', 'Demeter'],
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'color':
        return <Wine className="w-4 h-4 mr-2" />;
      case 'region':
        return <Grape className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const getFilterTitle = (filterType: string) => {
    switch (filterType) {
      case 'color':
        return 'Couleur';
      case 'region':
        return 'Région';
      case 'vintage':
        return 'Millésime';
      case 'certification':
        return 'Certification';
      default:
        return filterType;
    }
  };

  return (
    <div className="max-w-sm bg-orange-400 w-80 rounded-lg shadow-lg text-gray-800">
      <p className='mt-4 text-sm text-white'>Filtres et tris</p>
      <br />
      {Object.entries(filterOptions).map(([filterType, options]) => (
        <div key={filterType} className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleSection(filterType)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              {getFilterIcon(filterType)}
              <span className="font-semibold text-gray-800">{getFilterTitle(filterType)}</span>
            </div>
            {openSections.includes(filterType) ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {openSections.includes(filterType) && (
            <div className="px-4 py-2 max-h-48 overflow-y-auto">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={(selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']] as string[])?.includes(option) ?? false}
                    onChange={() => onFilterChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductFilter;
