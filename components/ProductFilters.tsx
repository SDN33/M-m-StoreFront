import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Gift, ChevronUp, Wine, Locate, Calendar, Grape, Medal, Ruler, Utensils, RefreshCw, FlaskConicalOff } from 'lucide-react';
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
    petit_prix: string[];
    haut_de_gamme: string[];
    prestige: string[];
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
        from-gray-950
        via-gray-800
        to-gray-950
        text-white
        hover:scale-110
        ${isScrolled
          ? 'w-10 h-10 rounded-full text-xs top-2 opacity-100'
          : 'w-full py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider'}
      `}
    >
      {isScrolled ? <RefreshCw /> : <>Redémarrer la recherche</>}
    </button>
  );
};

const getFilterTitle = (filterType: string) => {
  const titles: { [key: string]: JSX.Element } = {
    color: (
      <>
        <div className="flex items-center">
          <Wine className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">COULEUR</span>
        </div>
      </>
    ),
    region: (
      <>
        <div className="flex items-center">
          <Locate className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">RÉGIONS / PAYS</span>
        </div>
      </>
    ),
    certification: (
      <>
        <div className="flex items-center">
          <Medal className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">CERTIFICATION</span>
        </div>
      </>
    ),
    style: (
      <>
        <div className="flex items-center">
          <Grape className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">STYLE</span>
        </div>
      </>
    ),
    millesime: (
      <>
        <div className="flex items-center">
          <Calendar className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">MILLÉSIME</span>
        </div>
      </>
    ),
    volume: (
      <>
        <div className="flex items-center">
          <Ruler className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">VOLUME</span>
        </div>
      </>
    ),
    accord_mets: (
      <>
        <div className="flex items-center">
          <Utensils className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">ACCORD METS</span>
        </div>
      </>
    ),
    sans_sulfites_: (
      <>
        <div className="flex items-center">
          <FlaskConicalOff className="text-teal-800 w-3 h-auto mr-2" />
          <span className="text-sm">SULFITES</span>
        </div>
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
    { label: '2016', value: '2016' },
    { label: '2015', value: '2015' },
    { label: '2014', value: '2014' },
    { label: '2013', value: '2013' },
    { label: '2012', value: '2012' },
    { label: '2011', value: '2011' },
    { label: '2010', value: '2010' },
    { label: '2009', value: '2009' },
    { label: '2008', value: '2008' },
    { label: '2007', value: '2007' },
    { label: '2006', value: '2006' },
    { label: '2005', value: '2005' },
    { label: '2004', value: '2004' },
    { label: '2003', value: '2003' },
    { label: '2002', value: '2002' },
    { label: '2001', value: '2001' },
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
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const filterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && filterContainerRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = filterContainerRef.current?.scrollTop ?? 0;
          setIsScrolled(scrollPosition > 50);
          ticking = false;
        });
        ticking = true;
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

  const isPetitPrixMatch = () => {
    resetFilters();
    handleCheckboxChange('petit_prix', { label: 'Petit prix', value: 'petit_prix' });
  };

  const isHGPrixMatch = () => {
    resetFilters();
    handleCheckboxChange('haut_de_gamme', { label: 'Haut de gamme', value: 'haut_de_gamme' });
  }

  const isPrestigePrixMatch = () => {
    resetFilters();
    handleCheckboxChange('prestige', { label: 'Prestige', value: 'prestige' });
  };

  return (
    <div ref={filterContainerRef} className=" custom-scrollbar -px-10 bg-gray-200 backdrop-blur-sm overflow-y-auto h-screen min-w-full transition-all duration-300 ease-in-out mt-48 md:mt-40 lg:mt-44 mr-14">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm rounded-t-xl mt-4">
        <AnimatedResetButton onClick={resetFilters} isScrolled={isScrolled} />
      </div>
      <button
        aria-label="Prestige"
        onClick={isPrestigePrixMatch}
        className="mt-20 mb-2 p-2 text-center rounded-lg border-gray-950 mx-auto bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-500 text-white hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-400 transition-all duration-300 text-sm w-full"
      >
        <div className="flex items-center justify-center text-center mx-auto space-x-4">
          <span className="text-center">
          •
            &nbsp; Haut de Gamme &nbsp;
        <span className="text-xs -mt-4">
          &nbsp;•
        </span>
          </span>
        </div>
      </button>
      <button
        aria-label="Vins Bio Pour Offrir"
        onClick={isHGPrixMatch}
        className=" mb-2 p-2 text-center rounded-lg border-gray-950 mx-auto bg-gradient-to-r from-gray-800 via-gray-800 to-gray-950 text-white hover:from-red-700 hover:via-red-800 hover:to-red-500 transition-all duration-300 text-sm w-full"
      >
        <div className="flex items-center justify-center text-center mx-auto space-x-4">
          <span className="text-center">
            <Gift className="w-3 h-auto inline-block ml-1" aria-hidden="true" />
            &nbsp; Pour Offrir
        <span className="text-xs -mt-4">
          &nbsp;<Gift className="w-3 h-auto inline-block ml-1" aria-hidden="true" />
        </span>
          </span>
        </div>
      </button>
      <button
        onClick={isPetitPrixMatch}
        className="p-2 text-center rounded-lg border-gray-950 mx-auto bg-gradient-to-r from-primary via-orange-800 to-red-900 text-white hover:from-orange-700 hover:via-primary hover:to-orange-500 transition-all duration-300 text-sm w-full"
        aria-label="Petit Budget"
      >
        <div className='flex items-center justify-center text-center mx-auto space-x-4'>
          <span className="text-center">• &nbsp;Petit Budget&nbsp;  •</span>
        </div>
      </button>
      <div className='pb-52 mt-4'>
        {Object.entries(filterOptions).map(([filterType, options]) => {
          if (hideColorFilter && filterType === 'color') return null;
          return (
            <div key={filterType} className="border-b border-gray-300 bg-slate-100">
              <button
                onClick={() => toggleSection(filterType)}
                className="w-full p-4 text-left text-base font-semibold flex items-center justify-between hover:bg-gray-100 transition-colors"
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
                          className="form-checkbox h-3 w-3 text-teal-800 focus:ring-teal-800 rounded border-gray-300 transition duration-200 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700 font-semibold">
                          {option.label === 'Bio' ? (
                            <span className="flex items-center">
                              {option.label} <Image src="/images/logobio1.webp" alt="Bio" width={16} height={16} className="ml-1" />
                            </span>
                          ) : option.label === 'Biodynamie' ? (
                            <span className="flex items-center">
                              {option.label} <Image src="/images/bioBiodynamie.png" alt="Biodynamie" width={50} height={16} className="ml-1" />
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
    </div>
  );
};

export default ProductFilter;
