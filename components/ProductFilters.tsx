import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
        return <span className="text-2xl">🍷</span>;
      case 'region':
        return <span className="text-2xl">📍</span>;
      case 'vintage':
        return <span className="text-2xl">🗓️ </span>;
      case 'certification':
        return <span className="text-2xl">🌿</span>;
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
    <div className="relative max-w-sm w-80 rounded-lg shadow-lg overflow-hidden hidden md:block">
      {/* Fond orange avec motifs légers */}
      <div className="absolute inset-0 bg-orange-500"
           style={{
             backgroundImage: `
               radial-gradient(circle at 20px 20px, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 2px, transparent 2px),
               radial-gradient(circle at 40px 70px, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.02) 4px, transparent 4px)
             `,
             backgroundSize: '100px 100px'
           }}>
      </div>

      {/* Contenu */}
      <div className="relative">
        <p className='mt-4 px-4 text-sm font-medium text-white'>Trier nos vins: </p>
        <br />
        {Object.entries(filterOptions).map(([filterType, options]) => (
          <div key={filterType} className="border-b border-white/10 last:border-b-0">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                {getFilterIcon(filterType)}
                <span className="font-semibold text-white">{getFilterTitle(filterType)}</span>
              </div>
              {openSections.includes(filterType) ? (
                <ChevronUp className="w-4 h-4 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white" />
              )}
            </button>

            {openSections.includes(filterType) && (
              <div className="px-4 py-2 max-h-48 overflow-y-auto bg-white/10">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-white/5 px-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']] as string[])?.includes(option) ?? false}
                      onChange={() => onFilterChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                      className="w-4 h-4 rounded border-white/20 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-white">{option}</span>
                  </label>
                ))}

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
