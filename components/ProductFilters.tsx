'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  hideColorFilter?: boolean; // Nouvelle prop pour masquer le filtre de couleur
}

const getFilterTitle = (filterType: string) => {
  const titles: { [key: string]: string } = {
    color: 'Couleur',
    region: 'Région',
    vintage: 'Millésime',
    certification: 'Certification',
    style: 'Style',
    volume: 'Volume',
    accord_mets: 'Accord Mets',
  };
  return titles[filterType] || filterType;
};

const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '');

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedFilters,
  onFilterChange,
  hideColorFilter = false, // Valeur par défaut à false
}) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

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

  const toggleSection = (section: keyof typeof filterOptions) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
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
    <div className="relative max-w-sm w-full md:w-52 lg:w-60 rounded-lg shadow-lg overflow-hidden hidden md:block">
      <div className="absolute inset-0 bg-orange-600"></div>

      <div className="relative">
        <h2 className="text-xl font-bold text-white">
          Trier nos vins:
        </h2>
        <br />
        {Object.entries(filterOptions).map(([filterType, options]) => {
          // Ne pas afficher le filtre de couleur si hideColorFilter est vrai
          if (hideColorFilter && filterType === 'color') return null;

          return (
            <div key={filterType} className="border-b border-white/10 last:border-b-0">
              <button
                onClick={() => toggleSection(filterType as keyof typeof filterOptions)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors"
                aria-expanded={openSections.includes(filterType)}
                aria-controls={filterType}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{getFilterTitle(filterType)}</span>
                </div>
                {openSections.includes(filterType) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {openSections.includes(filterType) && (
                <div className="px-4 py-2 max-h-48 overflow-y-auto bg-white/10" id={filterType}>
                  {options.map((option) => (
                    <label
                      key={option}
                      className="text-white flex items-center space-x-2 py-2 cursor-pointer hover:bg-white/5 px-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']]
                          .map(opt => normalizeString(opt))
                          .includes(normalizeString(option))}
                        onChange={() => handleCheckboxChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                        className="w-4 h-4 rounded border-white/20 text-orange-600 focus:ring-orange-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFilter;
