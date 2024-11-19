import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Wine, Locate, Calendar, Grape, Medal, Ruler, Utensils, RefreshCw } from 'lucide-react';
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
  resetFilters: () => void;
  hideColorFilter?: boolean;
}

const AnimatedResetButton: React.FC<{ onClick: () => void; isScrolled: boolean }> = ({ onClick, isScrolled }) => {
  return (
    <button
      onClick={onClick}
      className={`
        absolute
        left-1/2
        transform
        -translate-x-1/2
        transition-all
        duration-500
        ease-in-out
        flex
        items-center
        justify-center
        bg-gradient-to-r
        from-gray-900
        via-gray-800
        to-black
        text-white
        hover:scale-110
        ${isScrolled
          ? 'w-10 h-10 rounded-full text-xs top-2 opacity-100'
          : 'w-full py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider'}
      `}
    >
      {isScrolled ? <RefreshCw /> : 'Réinitialiser les filtres'}
    </button>
  );
};

const getFilterTitle = (filterType: string) => {
  const titles: { [key: string]: JSX.Element } = {
    color: (
      <>
        <Wine className="inline-block ml-1 text-teal-800" />
        <br /><>COULEUR </>
      </>
    ),
    region: (
      <>
        <Locate className="inline-block ml-1 text-teal-800" />
        <br /><>RÉGIONS</>
      </>
    ),
    vintage: (
      <>
        <Calendar className="inline-block ml-1 text-teal-800" />
        <>MILLÉSIME <br /></>
      </>
    ),
    certification: (
      <>
        <Medal className="inline-block ml-1 text-teal-800" />
        <br /><>CERTIFICATION</>
      </>
    ),
    style: (
      <>
        <Grape className="inline-block ml-1 text-teal-800" />
        <br /><>STYLE</>
      </>
    ),
    volume: (
      <>
        <Ruler className="inline-block ml-1 text-teal-800" />
        <br /><>VOLUME</>
      </>
    ),
    accord_mets: (
      <>
        <Utensils className="inline-block ml-1 text-teal-800" />
        <br /><>ACCORD METS </>
      </>
    ),
  };
  return titles[filterType] || <>{filterType}</>;
};

const filterOptions = {
  color: [
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
    { label: 'Viandes rouges', value: 'Viandes rouges' },
    { label: 'Viandes blanches', value: 'Viandes blanches' },
    { label: 'Poissons', value: 'Poissons' },
    { label: 'Fruits de mer', value: 'Fruits de mer' },
    { label: 'Fromages', value: 'Fromages' },
    { label: 'Desserts / Sucré', value: 'Desserts / Sucré' },
    { label: 'Plats végétariens', value: 'Plats végétariens' },
  ],
};

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedFilters,
  onFilterChange,
  hideColorFilter = false,
  resetFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(Object.keys(filterOptions));
  const [isScrolled, setIsScrolled] = useState(false);

  const filterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (filterContainerRef.current) {
        const scrollPosition = filterContainerRef.current.scrollTop;
        setIsScrolled(scrollPosition > 50);
      }
    };

    const container = filterContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div ref={filterContainerRef} className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl overflow-y-auto h-screen w-full transition-all duration-300 ease-in-out mt-52">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm rounded-t-xl">
        <AnimatedResetButton onClick={resetFilters} isScrolled={isScrolled} />
      </div>
      {Object.entries(filterOptions).map(([filterType, options]) => {
        if (hideColorFilter && filterType === 'color') return null;
        return (
          <div key={filterType} className="border-b border-gray-300 bg-slate-100 mt-20">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full p-4 text-left text-lg font-semibold flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-800 text-base">{getFilterTitle(filterType)}</span>
              {expandedSections.includes(filterType) ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.includes(filterType) && (
              <div className="p-4 space-y-2 bg-white shadow-sm rounded-md ">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters[filterType as keyof ProductFilterProps['selectedFilters']].includes(option.value)}
                        onChange={() => handleCheckboxChange(filterType as keyof ProductFilterProps['selectedFilters'], option)}
                        className="form-checkbox h-4 w-4 text-teal-500 focus:ring-teal-500 rounded border-gray-300 transition duration-200 ease-in-out"
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
                <br /><br />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductFilter;
