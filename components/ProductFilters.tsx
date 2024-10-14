import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductFilterProps {
  selectedFilters?: {
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    price: string[]; // Gestion des prix
    volume: string[];
  };
  onFilterChange?: (filterType: keyof ProductFilterProps['selectedFilters'], value: string[]) => void;
}

const getFilterTitle = (filterType: string) => {
  const titles: { [key: string]: string } = {
    color: 'Couleur',
    region: 'Région',
    vintage: 'Millésime',
    certification: 'Certification',
    style: 'Style',
    price: 'Prix', // Titre pour le filtre de prix
    volume: 'Volume',
  };
  return titles[filterType] || filterType;
};

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedFilters = {
    color: [],
    region: [],
    vintage: [],
    certification: [],
    style: [],
    price: [], // Initialisation du filtre de prix
    volume: [],
  },
  onFilterChange = () => {},
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['color']);

  const filterOptions = {
    color: ['Rouge', 'Blanc', 'Rosé', 'Pétillant', 'Liquoreux', 'Autres'],
    region: [
      'Alsace', 'Beaujolais', 'Bourgogne', 'Bordeaux',
      'Champagne', 'Jura', 'Languedoc', 'Loire',
      'Provence Alpes Côte d’Azur', 'Roussillon',
      'Savoie', 'Sud Ouest', 'Vallée du Rhône',
      'France', 'Italie', 'Espagne', 'Portugal', 'Allemagne',
    ],
    vintage: ['2018', '2019', '2020', '2021', '2022'],
    certification: ['Bio', 'Biodynamie', 'En conversion'],
    style: ['Charpenté', 'Fruité', 'Moelleux', 'Corsé', 'Sec'],
    price: ['0-10 €', '10-20 €', '20-30 €', '30-40 €', '40-50 €', '50-60 €', '60-70 €', '70-80 €', '80-90 €', '90 et +'], // Options pour le filtre de prix
    volume: ['75cl', '1L', 'Autres'],
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleCheckboxChange = (filterType: keyof ProductFilterProps['selectedFilters'], option: string) => {
    const currentOptions: string[] = selectedFilters[filterType] || [];
    const updatedOptions = currentOptions.includes(option)
      ? currentOptions.filter((item) => item !== option)
      : [...currentOptions, option];

    onFilterChange(filterType, updatedOptions);
  };

  return (
    <div className="relative max-w-sm w-60 rounded-lg shadow-lg overflow-hidden hidden md:block">
      <div className="absolute inset-0 bg-orange-600"></div>

      <div className="relative">
        <p className="mt-4 px-4 text-white h-[1.5rem]">
          Trier nos vins:
        </p>
        <br />
        {Object.entries(filterOptions).map(([filterType, options]) => (
          <div key={filterType} className="border-b border-white/10 last:border-b-0">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors"
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
              <div className="px-4 py-2 max-h-48 overflow-y-auto bg-white/10">
                {options.map((option) => (
                  <label
                    key={option}
                    className=" text-white flex items-center space-x-2 py-2 cursor-pointer hover:bg-white/5 px-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(
                        (selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']] as string[] || []).includes(option)
                      )}
                      onChange={() => handleCheckboxChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                      className="w-4 h-4 rounded border-white/20 text-orange-600 focus:ring-orange-600"
                    />
                    <span className="text-sm">{option}</span>
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
