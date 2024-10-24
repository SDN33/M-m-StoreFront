'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wine, Locate, Calendar, Grape, Medal, Ruler, Utensils } from 'lucide-react';
import WineSelector from './WineSelector';

interface ProductFilterProps {
  selectedFilters: {
    color: string[];
    region: string[];
    vintage: string[];
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
  vintage: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  certification: ['Bio', 'Biodynamie', 'En conversion'],
  style: ['Charpenté', 'Fruité', 'Moelleux', 'Corsé', 'Sec'],
  volume: ['75 cl', '1 Litre', 'Autres'],
  accord_mets: ['Viandes rouges', 'Viandes blanches', 'Poissons', 'Fruits de mer', 'Fromages', 'Desserts / Sucré', 'Plats végétariens'],
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
    <div className="bg-transparent h-full overflow-y-auto mt-40">
      {Object.entries(filterOptions).map(([filterType, options]) => {
        if (hideColorFilter && filterType === 'color') return null;
        return (
          <div key={filterType} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full p-4 text-left text-lg font-semibold flex items-center justify-between hover:bg-gray-50"
            >
              <span>{getFilterTitle(filterType)}</span>
              {expandedSections.includes(filterType) ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.includes(filterType) && (
              <div className="p-4 space-y-2 bg-gray-50">
                {options.map((option) => (
                  <label key={option} className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']].includes(option)}
                        onChange={() => handleCheckboxChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                        className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="p-4">
        <button onClick={() => onFilterChange('color', [])} className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors">
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
