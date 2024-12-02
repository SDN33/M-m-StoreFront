import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Gift, ChevronUp, RefreshCw, ChartCandlestick, X, Filter } from 'lucide-react';
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
    sans_sulfites_: string[];
    color: string[];
    petit_prix: string[];
    haut_de_gamme: string[];
  };
  onFilterChange: (filterType: keyof ProductFilterProps['selectedFilters'], value: string[]) => void;
  resetFilters: () => void;
  hideColorFilter?: boolean;
}

const filterOptions = {
  couleur: [
    { label: 'Rouge', value: 'Rouge' },
    { label: 'Blanc', value: 'Blanc' },
    { label: 'Rosé', value: 'Rosé' },
    { label: 'Pétillant', value: 'Pétillant' },
    { label: 'Liquoreux', value: 'Liquoreux' },
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
  sans_sulfites_: [
    { label: 'Sans sulfites ajoutés', value: 'Sans sulfites ajoutés' },
  ],
  style: [
    { label: 'Charpenté', value: 'Charpenté' },
    { label: 'Fruité', value: 'Fruité' },
    { label: 'Moelleux', value: 'Moelleux' },
    { label: 'Corsé', value: 'Corsé' },
    { label: 'Sec', value: 'Sec' },
  ],
  millesime: [
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
    { label: '2018', value: '2018' },
    { label: '2017', value: '2017' },
    { label: '2016 et avant', value: '2016_et_avant' },
  ],
  volume: [
    { label: '75 cl', value: '75 cl' },
    { label: '1 Litre', value: '1 Litre' },
    { label: 'Autres', value: 'Autres' },
  ],
  accord_mets: [
    { label: 'Viandes rouges', value: 'Viandes rouges' },
    { label: 'Viandes blanches', value: 'Viandes blanches' },
    { label: 'Poissons', value: 'Poissons' },
    { label: 'Fruits de mer', value: 'Fruits de mer' },
    { label: 'Fromages', value: 'Fromages' },
    { label: 'Desserts / Sucré', value: 'Desserts / Sucré' },
    { label: 'Plats végétariens', value: 'Plats végétariens' },
  ],
};


const getFilterTitle = (filterType: string) => {
  const titles: { [key: string]: string } = {
    millesime: 'Millesime',
    certification: 'Certification',
    style: 'Style',
    volume: 'Volume',
    accord_mets: 'Accord Mets',
    region__pays: 'Region/Pays',
    sans_sulfites_: 'Sans Sulfites',
    couleur: 'Couleur',
  };
  return titles[filterType] || filterType;
};

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedFilters,
  onFilterChange,
  hideColorFilter = false,
  resetFilters,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Outside click handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleCheckboxChange = (filterType: keyof ProductFilterProps['selectedFilters'], option: { label: string; value: string }) => {
    const currentOptions = selectedFilters[filterType] ?? [];
    const updatedOptions = currentOptions.includes(option.value)
      ? currentOptions.filter((item) => item !== option.value)
      : [...currentOptions, option.value];
    onFilterChange(filterType, updatedOptions);
  };

  const isPetitPrixMatch = () => {
    resetFilters();
    handleCheckboxChange('petit_prix', { label: 'Petit prix', value: 'petit_prix' });
  };

  const isHGPrixMatch = () => {
    resetFilters();
    handleCheckboxChange('haut_de_gamme', { label: 'Haut de gamme', value: 'haut_de_gamme' });
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="fixed left-1/2 bottom-4 transform -translate-x-1/2 bg-black/80 text-white p-3 w-24 rounded-t-xl shadow-lg md:hidden z-50"
        aria-label="Ouvrir les filtres"
      >
        <Filter className="w-6 h-6 justify-center flex mx-auto" />
      </button>

      {/* Mobile Filter Sidebar */}
      {isOpen && (
        <div className="w-full fixed inset-0 bg-gray-200 backdrop-blur-sm border border-gray-200/50 shadow-2xl z-[55] overflow-y-auto">
          <div
            ref={sidebarRef}
            className="w-full h-full"
          >
            {/* Sticky Header with Reset and Close Buttons */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm rounded-t-xl">
              <div className="flex justify-between items-center p-4">
                <button
                  onClick={toggleSidebar}
                  className="text-gray-800"
                  aria-label="Fermer les filtres"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Promo Buttons */}
            <div className="p-4 space-y-4">
              <button
                onClick={isHGPrixMatch}
                className="p-2 text-center rounded-lg border-gray-950 mx-auto bg-gradient-to-r from-gray-800 via-gray-800 to-gray-950 text-white hover:from-red-700 hover:via-red-800 hover:to-red-500 transition-all duration-300 text-sm w-full"
              >
                <div className='flex items-center justify-center text-center mx-auto space-x-4'>
                  <span className="text-center">• <Gift className='w-3 h-auto inline-block ml-1'/>&nbsp; Pour Offrir<span className='text-xs -mt-4'>&nbsp;<Gift className='w-3 h-auto inline-block ml-1'/></span> •</span>
                </div>
              </button>

              <button
                onClick={isPetitPrixMatch}
                className="p-2 text-center rounded-lg border-gray-950 mx-auto bg-gradient-to-r from-primary via-orange-800 to-red-900 text-white hover:from-orange-700 hover:via-primary hover:to-orange-500 transition-all duration-300 text-sm w-full"
              >
                <div className='flex items-center justify-center text-center mx-auto space-x-4'>
                  <ChartCandlestick className="w-5 h-auto text-left mr-2"/>
                  <span className="text-center">Petit Budget &lt; de 8€</span>
                </div>
              </button>
            </div>

            {/* Filter Sections */}
            <div>
              {Object.entries(filterOptions).map(([filterType, options]) => {
                if (hideColorFilter && filterType === 'color') return null;
                return (
                  <div key={filterType} className="border-b border-gray-300 bg-slate-100">
                    <button
                      onClick={() => toggleSection(filterType)}
                      className="w-full p-4 text-left text-base font-semibold flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-800 text-base flex items-center">
                        {getFilterTitle(filterType)}
                      </span>
                      {expandedSections.includes(filterType) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedSections.includes(filterType) && (
                      <div className="p-4 space-y-2 bg-white shadow-sm rounded-md">
                        {options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']].includes(option.value)}
                                onChange={() => handleCheckboxChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                                className="form-checkbox h-3 w-3 text-teal-800 focus:ring-teal-800 rounded border-gray-300 transition duration-200 ease-in-out"
                              />
                              <span className="ml-2 text-sm text-gray-700 font-semibold">
                                {option.label === 'Bio' ? (
                                  <span className="flex items-center">
                                    {option.label} <Image src="/images/logobio1.webp" alt="Bio" width={16} height={16} className="ml-1" />
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilter;
