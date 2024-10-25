import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wine, Locate, Calendar, Grape, Medal, Ruler, Utensils } from 'lucide-react';
import Image from 'next/image';

interface ProductFilterProps {
  selectedFilters: {
    categories: string[];
    millesime: string[];
    certification: string[];
    style: string[];
    volume: string[];
    accord_mets: string[];
    region__pays: string[];
  };
  onFilterChange: (filterType: keyof ProductFilterProps['selectedFilters'], value: string[]) => void;
  hideColorFilter?: boolean;
}

const getFilterTitle = (filterType: string) => {
  const titles: { [key: string]: JSX.Element } = {
    color: <>COULEUR <br /><Wine className="inline-block ml-1 text-teal-500" /></>,
    region: <>RÉGIONS <br /><Locate className="inline-block ml-1 text-teal-500" /></>,
    vintage: <>MILLÉSIME <br /><Calendar className="inline-block ml-1 text-teal-500" /></>,
    certification: <>CERTIFICATION <br /><Medal className="inline-block ml-1 text-teal-500" /></>,
    style: <>STYLE <br /><Grape className="inline-block ml-1 text-teal-500" /></>,
    volume: <>VOLUME <br /><Ruler className="inline-block ml-1 text-teal-500" /></>,
    accord_mets: <>ACCORD METS <br /><Utensils className="inline-block ml-1 text-teal-500" /></>,
  };
  return titles[filterType] || <>{filterType}</>;
};

const filterOptions = {
  color: [
    { label: 'Rouge 🔴', value: 'Rouge' },
    { label: 'Blanc 🟡', value: 'Blanc' },
    { label: 'Rosé ⭕', value: 'Rosé' },
    { label: 'Pétillant 🫧', value: 'Pétillant' },
    { label: 'Liquoreux 🟠', value: 'Liquoreux' },
    { label: 'Autres', value: 'Autres' },
  ],
  region: [
    { label: 'Alsace', value: 'Alsace' },
    { label: 'Beaujolais', value: 'Beaujolais' },
    { label: 'Bourgogne', value: 'Bourgogne' },
    { label: 'Bordeaux', value: 'Bordeaux' },
    { label: 'Champagne', value: 'Champagne' },
    { label: 'Jura', value: 'Jura' },
    { label: 'Languedoc', value: 'Languedoc' },
    { label: 'Loire', value: 'Loire' },
    { label: 'PACA', value: 'PACA' },
    { label: 'Roussillon', value: 'Roussillon' },
    { label: 'Savoie', value: 'Savoie' },
    { label: 'Sud Ouest', value: 'Sud Ouest' },
    { label: 'Vallée du Rhône', value: 'Vallée du Rhône' },
    { label: 'Italie', value: 'Italie' },
    { label: 'Espagne', value: 'Espagne' },
    { label: 'Portugal', value: 'Portugal' },
    { label: 'Allemagne', value: 'Allemagne' },
  ],
  certification: [
    { label: 'Bio', value: 'Bio' },
    { label: 'Biodynamie', value: 'Biodynamie' },
    { label: 'En conversion 🔄', value: 'En conversion' },
  ],
  style: [
    { label: 'Charpenté', value: 'Charpenté' },
    { label: 'Fruité', value: 'Fruité' },
    { label: 'Moelleux', value: 'Moelleux' },
    { label: 'Corsé', value: 'Corsé' },
    { label: 'Sec', value: 'Sec' },
  ],
  volume: [
    { label: '75 cl', value: '75 cl' },
    { label: '1 Litre', value: '1 Litre' },
    { label: 'Autres', value: 'Autres' },
  ],
  accord_mets: [
    { label: 'Viandes rouges 🥩', value: 'Viandes rouges' },
    { label: 'Viandes blanches 🍗', value: 'Viandes blanches' },
    { label: 'Poissons 🐟', value: 'Poissons' },
    { label: 'Fruits de mer 🦪', value: 'Fruits de mer' },
    { label: 'Fromages 🧀', value: 'Fromages' },
    { label: 'Desserts / Sucré 🍰', value: 'Desserts / Sucré' },
    { label: 'Plats végétariens 🥗', value: 'Plats végétariens' },
  ],
};

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedFilters,
  onFilterChange,
  hideColorFilter = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(Object.keys(filterOptions));

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleCheckboxChange = (filterType: keyof ProductFilterProps['selectedFilters'], option: { label: string, value: string }) => {
    const currentOptions = selectedFilters[filterType] ?? [];
    const updatedOptions = currentOptions.includes(option.value)
      ? currentOptions.filter((item) => item !== option.value)
      : [...currentOptions, option.value];
    onFilterChange(filterType, updatedOptions);
  };

  return (
    <div className="hidden sm:block bg-transparent h-full w-56 ml-10 overflow-y-auto mt-56 bg-white
     bg-opacity-30">
      {Object.entries(filterOptions).map(([filterType, options]) => {
        if (hideColorFilter && filterType === 'color') return null;
        return (
          <div key={filterType} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full p-4 text-left text-lg font-semibold flex items-center justify-between"
            >
              <span>{getFilterTitle(filterType)}</span>
              {expandedSections.includes(filterType) ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.includes(filterType) && (
              <div className="p-4 space-y-2 bg-white">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center justify-between cursor-pointer hover:bg-white p-2 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']].includes(option.value)}
                        onChange={() => handleCheckboxChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                        className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">
                        {option.label === 'Bio' ? (
                          <span className="flex items-center">
                            {option.label} <Image src="/images/logobio.webp" alt="Bio" width={16} height={16} className="ml-1" />
                          </span>
                        ) : option.label === 'Biodynamie' ? (
                          <span className="flex items-center">
                            {option.label} <Image src="/images/biodemeter.png" alt="Biodynamie" width={50} height={16} className="ml-1" />
                          </span>
                        ) : (
                          option.label
                        )}
                      </span>
                    </div>
                  </label>
                ))}
                <br /><br />
              </div>
            )}
          </div>
        );
      })}

      <div className="p-4">
        <button onClick={() => {
          onFilterChange('categories', []);
          onFilterChange('region__pays', []);
          onFilterChange('millesime', []);
          onFilterChange('certification', []);
          onFilterChange('style', []);
          onFilterChange('volume', []);
          onFilterChange('accord_mets', []);
        }} className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
