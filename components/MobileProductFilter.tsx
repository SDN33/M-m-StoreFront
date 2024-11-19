import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';

interface MobileProductFilterProps {
  selectedFilters: {
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    volume: string[];
    accord_mets: string[];
  };
  onFilterChange: (filterType: keyof MobileProductFilterProps['selectedFilters'], value: string[]) => void;
  hideColorFilter?: boolean;
}

const getFilterTitle = (filterType: string) => {
  const titles: { [key: string]: string } = {
    color: '🍇 Couleur',
    region: '📍 Région',
    vintage: '📅 Millésime',
    certification: '🌱 Certification',
    style: '🎨 Style',
    volume: '🍾 Volume',
    accord_mets: '🍽 Accord Mets',
  };
  return titles[filterType] || filterType;
};

const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '');

const MobileProductFilter: React.FC<MobileProductFilterProps> = ({
  selectedFilters,
  onFilterChange,
  hideColorFilter = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSection = (section: keyof typeof filterOptions) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleCheckboxChange = (filterType: keyof MobileProductFilterProps['selectedFilters'], option: string) => {
    const currentOptions = selectedFilters[filterType] ?? [];
    const updatedOptions = currentOptions.includes(option)
      ? currentOptions.filter((item) => item !== option)
      : [...currentOptions, option];

    onFilterChange(filterType, updatedOptions);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-primary opacity-50 text-white p-3 rounded-r-md shadow-lg md:hidden z-50"
        aria-label="Ouvrir les filtres"
      >
        <Filter className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-300 opacity-95 text-black overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0 rounded-xl">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h2 className="text-xl font-bold">Filtres</h2>
              <button onClick={toggleSidebar} className="text-white" aria-label="Fermer les filtres">
                <X className="w-6 h-6" />
              </button>
            </div>

            {Object.entries(filterOptions).map(([filterType, options]) => {
              if (hideColorFilter && filterType === 'color') return null;

              return (
                <div key={filterType} className="border-b border-white/10 last:border-b-0">
                  <button
                    onClick={() => toggleSection(filterType as keyof typeof filterOptions)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors"
                    aria-expanded={openSections.includes(filterType)}
                    aria-controls={`mobile-${filterType}`}
                  >
                    <span className="font-semibold">{getFilterTitle(filterType)}</span>
                    {openSections.includes(filterType) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {openSections.includes(filterType) && (
                    <div className="px-4 py-2 bg-white/10" id={`mobile-${filterType}`}>
                      {options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-white/5 px-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters[filterType as keyof MobileProductFilterProps['selectedFilters']]
                              .map(opt => normalizeString(opt))
                              .includes(normalizeString(option))}
                            onChange={() => handleCheckboxChange(filterType as keyof MobileProductFilterProps['selectedFilters'], option)}
                            className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="md:hidden lg:hidden sm:flex justify-center items-center mt-4">
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileProductFilter;
