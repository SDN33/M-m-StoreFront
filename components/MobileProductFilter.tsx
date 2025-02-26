'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Wine,
  Locate,
  Calendar,
  Grape,
  Medal,
  Ruler,
  Utensils,
  RefreshCw,
  FlaskConicalOff,
  Gift
} from 'lucide-react';

// Define a type for filter options with an additional display label
interface FilterOption {
  label: string;
  value: string;
}

interface FilterOptionsWithDisplay {
  [key: string]: {
    options: FilterOption[];
    displayName?: string; // New property for custom display name
  };
}

const filterOptions: FilterOptionsWithDisplay = {
  color: {
    displayName: 'Couleur du Vin',
    options: [
      { label: 'Rouge', value: 'Rouge' },
      { label: 'Blanc', value: 'Blanc' },
      { label: 'Rosé', value: 'Rosé' },
      { label: 'Pétillant', value: 'Pétillant' },
      { label: 'Liquoreux', value: 'Liquoreux' },
      { label: 'Autres', value: 'Autres' },
    ]
  },
  region: {
    displayName: 'Région / Pays',
    options: [
      { label: 'Alsace', value: 'Alsace' },
      { label: 'Auvergne-Rhône-Alpes', value: 'Auvergne-Rhône-Alpes' },
      { label: 'Beaujolais', value: 'Beaujolais' },
      { label: 'Bourgogne', value: 'Bourgogne' },
      { label: 'Bordeaux', value: 'Bordeaux' },
      { label: 'Champagne', value: 'Champagne' },
      { label: 'Jura', value: 'Jura' },
      { label: 'Languedoc', value: 'Languedoc' },
      { label: 'Pays de la Loire', value: 'Pays de la Loire' },
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
  },
  certification: {
    displayName: 'Certification',
    options: [
      { label: 'Bio', value: 'Bio' },
      { label: 'Biodynamie', value: 'Biodynamie' },
      { label: 'En conversion 🔄', value: 'En conversion' },
    ],
  },
  sans_sulfites_: {
    displayName: 'Sulfites',
    options: [
      { label: 'Sans sulfites ajoutés', value: 'Sans sulfites ajoutés' },
    ],
  },
  style: {
    displayName: 'Style',
    options: [
      { label: 'Charpenté', value: 'Charpenté' },
      { label: 'Fruité', value: 'Fruité' },
      { label: 'Moelleux', value: 'Moelleux' },
      { label: 'Corsé', value: 'Corsé' },
      { label: 'Sec', value: 'Sec' },
    ],
  },
  millesime: {
    displayName: 'Millésime',
    options: [
      { label: '2023', value: '2023' },
      { label: '2022', value: '2022' },
      { label: '2021', value: '2021' },
      { label: '2020', value: '2020' },
      { label: '2019', value: '2019' },
      { label: '2018', value: '2018' },
      { label: '2017', value: '2017' },
      { label: '2016 et avant', value: '2016_et_avant' },
    ],
  },
  volume: {
    displayName: 'Volume',
    options: [
      { label: '75 cl', value: '75 cl' },
      { label: '1 Litre', value: '1 Litre' },
      { label: 'Autres', value: 'Autres' },
    ],
  },
  accord_mets: {
    displayName: 'Accord Mets',
    options: [
      { label: 'Viandes rouges', value: 'Viandes rouges' },
      { label: 'Viandes blanches', value: 'Viandes blanches' },
      { label: 'Poissons', value: 'Poissons' },
      { label: 'Fruits de mer', value: 'Fruits de mer' },
      { label: 'Fromages', value: 'Fromages' },
      { label: 'Desserts / Sucré', value: 'Desserts / Sucré' },
      { label: 'Plats végétariens', value: 'Plats végétariens' },
    ],
  },
};

interface MobileProductFilterProps {
  selectedFilters: {
    [key: string]: string[];
  };
  onFilterChange: (filterType: string, value: string[]) => void;
  resetFilters: () => void;
}

const getFilterIcon = (filterType: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    color: <Wine className="text-teal-800 w-4 h-auto mr-2" />,
    region: <Locate className="text-teal-800 w-4 h-auto mr-2" />,
    certification: <Medal className="text-teal-800 w-4 h-auto mr-2" />,
    style: <Grape className="text-teal-800 w-4 h-auto mr-2" />,
    millesime: <Calendar className="text-teal-800 w-4 h-auto mr-2" />,
    volume: <Ruler className="text-teal-800 w-4 h-auto mr-2" />,
    accord_mets: <Utensils className="text-teal-800 w-4 h-auto mr-2" />,
    sans_sulfites_: <FlaskConicalOff className="text-teal-800 w-4 h-auto mr-2" />,
  };

  return icons[filterType] || null;
};

const MobileProductFilter: React.FC<MobileProductFilterProps> = ({
  selectedFilters,
  onFilterChange,
  resetFilters
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isFilterOpen]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleCheckboxChange = (filterType: string, option: { label: string; value: string }) => {
    const currentOptions = selectedFilters[filterType] ?? [];
    const updatedOptions = currentOptions.includes(option.value)
      ? currentOptions.filter((item) => item !== option.value)
      : [...currentOptions, option.value];
    onFilterChange(filterType, updatedOptions);
  };

  const isPetitPrixMatch = () => {
    resetFilters();
    onFilterChange('petit_prix', ['petit_prix']);
    setIsFilterOpen(false);
  };

  const isHGPrixMatch = () => {
    resetFilters();
    onFilterChange('haut_de_gamme', ['haut_de_gamme']);
    setIsFilterOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      {/* Filter Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="bg-gray-900 opacity-90 text-white p-3 rounded-t-xl shadow-lg flex items-center w-40 h-10 justify-center"
      >
        <Filter className="w-4 h-4 " aria-label='filtres' />
        &nbsp;Filtres
      </button>

      {/* Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center w-64">
          <div
            ref={filterRef}
            className="bg-white opacity-95 w-full max-w-full max-h-[70vh] rounded-t-3xl overflow-y-auto custom-scrollbar shadow-lg"
          >
            {/* Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Filtres</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Special Filters */}
            <div className="px-4 mt-4 space-y-2">
              <button
                onClick={isHGPrixMatch}
                className="w-full p-3 text-center rounded-lg bg-gradient-to-r from-gray-800 via-gray-800 to-gray-950 text-white hover:opacity-90 transition-all flex items-center justify-center"
              >
                <Gift className="w-5 h-5 mr-2 text-xs" /> Vins pour Offrir
              </button>
              <button
                onClick={isPetitPrixMatch}
                className="w-full p-3 text-center text-xs rounded-lg bg-gradient-to-r from-primary via-orange-800 to-red-900 text-white hover:opacity-90 transition-all"
              >
                Petit Budget
              </button>
            </div>

            {/* Filter Sections */}
            <div className="mt-4">
              {Object.entries(filterOptions).map(([filterType, filterData]) => (
                <div key={filterType} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection(filterType)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      {getFilterIcon(filterType)}
                      <span className="font-semibold text-gray-800">
                        {filterData.displayName || filterType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    {expandedSections.includes(filterType) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {expandedSections.includes(filterType) && (
                    <div className="p-4 bg-white space-y-2">
                      {filterData.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFilters[filterType]?.includes(option.value)}
                              onChange={() => handleCheckboxChange(filterType, option)}
                              className="form-checkbox h-4 w-4 text-teal-800 rounded"
                            />
                            <span className="ml-2 text-gray-700">
                              {option.label === 'Bio' ? (
                                <span className="flex items-center">
                                  {option.label} <img src="/images/logobio1.webp" alt="Bio" width={16} height={16} className="ml-1" />
                                </span>
                              ) : option.label === 'Biodynamie' ? (
                                <span className="flex items-center">
                                  {option.label} <img src="/images/biodemeter.png" alt="Biodynamie" width={50} height={16} className="ml-1" />
                                </span>
                              ) : (
                                option.label
                              )}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reset Button */}
            <div className="p-4 bg-white sticky bottom-0 shadow-2xl">
              <button
                onClick={() => {
                  resetFilters();
                  setIsFilterOpen(false);
                }}
                className="w-full bg-gray-900 text-white p-3 rounded-lg flex items-center justify-center hover:opacity-90"
              >
                <RefreshCw className="w-5 h-5 mr-2" /> Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProductFilter;
