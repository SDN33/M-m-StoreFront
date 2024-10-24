'use client';
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
    color: <>COULEUR <br /><Wine className="inline-block ml-1" /></>,
    region: <>RÉGIONS <br /><Locate className="inline-block ml-1" /></>,
    vintage: <>MILLÉSIME <br /><Calendar className="inline-block ml-1" /></>,
    certification: <>CERTIFICATION <br /><Medal className="inline-block ml-1" /></>,
    style: <>STYLE <br /><Grape className="inline-block ml-1" /></>,
    volume: <>VOLUME <br /><Ruler className="inline-block ml-1" /></>,
    accord_mets: <>ACCORD METS <br /><Utensils className="inline-block ml-1" /></>,
  };
  return titles[filterType] || <>{filterType}</>;
};

const filterOptions = {
  color: ['Rouge', 'Blanc', 'Rosé', 'Pétillant', 'Liquoreux', 'Autres'],
  region: [
    'Alsace', 'Beaujolais', 'Bourgogne', 'Bordeaux', 'Champagne', 'Jura',
    'Languedoc', 'Loire', 'PACA', 'Roussillon', 'Savoie', 'Sud Ouest',
    'Vallée du Rhône', 'Italie', 'Espagne', 'Portugal', 'Allemagne',
  ],
  certification: [
    'Bio',
    'Biodynamie',
    'En conversion'
  ],
  style: ['Charpenté', 'Fruité', 'Moelleux', 'Corsé', 'Sec'],
  volume: ['75 cl', '1 Litre', 'Autres'],
  accord_mets: ['Viandes rouges 🥩', 'Viandes blanches 🍗', 'Poissons 🐟', 'Fruits de mer 🦪', 'Fromages 🧀', 'Desserts / Sucré 🍰', 'Plats végétariens 🥗'],
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

  const handleCheckboxChange = (filterType: keyof ProductFilterProps['selectedFilters'], option: string) => {
    const currentOptions = selectedFilters[filterType] ?? [];
    const updatedOptions = currentOptions.includes(option)
      ? currentOptions.filter((item) => item !== option)
      : [...currentOptions, option];
    onFilterChange(filterType, updatedOptions);
  };

  return (
    <div className="hidden sm:block bg-transparent h-full w-52 ml-10 overflow-y-auto mt-56 bg-white">
      {Object.entries(filterOptions).map(([filterType, options]) => {
        if (hideColorFilter && filterType === 'color') return null;
        return (
          <div key={filterType} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full p-4 text-left text-lg font-semibold flex items-center justify-between hover:bg-gray-50"
            >
              <span className="text-primary">{getFilterTitle(filterType)}</span>
              {expandedSections.includes(filterType) ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.includes(filterType) && (
              <div className="p-4 space-y-2 bg-white">
                {options.map((option, index) => (
                  <label key={option} className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']].includes(option)}
                        onChange={() => handleCheckboxChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                        className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">
                        {option === 'Bio' ? (
                          <span className="flex items-center">
                            {option} <Image src="/images/logobio.webp" alt="Bio" width={16} height={16} className="ml-1" />
                          </span>
                        ) : (
                          option
                        )}
                      </span>
                    </div>
                  </label>
                ))}
                <br /><br />
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
