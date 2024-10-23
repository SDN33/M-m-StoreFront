'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  const titles: { [key: string]: string } = {
    color: 'COULEUR',
    region: 'RÉGION',
    vintage: 'MILLÉSIME',
    certification: 'CERTIFICATION',
    style: 'STYLE',
    volume: 'VOLUME',
    accord_mets: 'ACCORD METS',
  };
  return titles[filterType] || filterType;
};

const filterOptions = {
  color: ['Rouge', 'Blanc', 'Rosé', 'Pétillant', 'Liquoreux', 'Autres'],
  region: [
    'Alsace', 'Beaujolais', 'Bourgogne', 'Bordeaux',
    'Champagne', 'Jura', 'Languedoc', 'Loire',
    'PACA', 'Roussillon', 'Savoie', 'Sud Ouest', 'Vallée du Rhône',
    'Italie', 'Espagne', 'Portugal', 'Allemagne',
  ],
  vintage: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  certification: ['Bio', 'Biodynamie', 'En conversion'],
  style: ['Charpenté', 'Fruité', 'Moelleux', 'Corsé', 'Sec'],
  volume: ['75 cl', '1 Litre', 'Autres'],
  accord_mets: ['Viandes rouges', 'Viandes blanches', 'Poissons', 'Fruits de mer', 'Fromages', 'Desserts / Sucré', 'Plats végétariens'],
};

const normalizeString = (str: unknown) => {
  if (typeof str === 'string') {
    return str.toLowerCase().replace(/\s+/g, '');
  }
  return ''; // ou gérer autrement les cas où str n'est pas une chaîne
};


const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedFilters,
  onFilterChange,
  hideColorFilter = false,
}) => {
  const [priceRange, setPriceRange] = useState({ min: 25, max: 5000 });
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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

  const resetFilters = () => {
    onFilterChange('color', []);
    onFilterChange('region', []);
    onFilterChange('vintage', []);
    onFilterChange('certification', []);
    onFilterChange('style', []);
    onFilterChange('accord_mets', []);
    onFilterChange('region__pays', []);
    onFilterChange('volume', []);
  };

  return (
    <div className="w-64 bg-trnasparent mt-44">
      {/* Prix Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          € PRIX
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-24 p-2 border rounded"
            />
            <span className="text-gray-500">€</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-24 p-2 border rounded"
            />
            <span className="text-gray-500">€</span>
          </div>
          <input
            type="range"
            min="25"
            max="5000"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Filter Sections */}
      {Object.entries(filterOptions).map(([filterType, options]) => {
        if (hideColorFilter && filterType === 'color') return null;

        return (
          <div key={filterType} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full p-4 text-left text-lg font-semibold flex items-center justify-between hover:bg-gray-50"
            >
              <span>{getFilterTitle(filterType)}</span>
              {expandedSections.includes(filterType) ?
                <ChevronUp className="w-5 h-5 text-gray-500" /> :
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </button>
            {expandedSections.includes(filterType) && (
              <div className="p-4 space-y-2 bg-gray-50">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']]
                          .map(opt => normalizeString(opt))
                          .includes(normalizeString(option))}
                        onChange={() => handleCheckboxChange(
                          filterType as keyof ProductFilterProps['selectedFilters'],
                          option
                        )}
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
        <button className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors">
          + DE FILTRES
        </button>
      </div>
      <div className="pt-4 ml-14">
      <WineSelector />
      </div>
    </div>
  );
};

export default ProductFilter;
