'use client';

import React, { useEffect, useState, useRef } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import MobileProductFilter from '@/components/MobileProductFilter';
import Slogan from '@/components/Slogan';
import HeroBanner from '@/components/HeroBanner';
import WineCategories from '@/components/WineCategories';
import BackToTop from '@/components/BackToTop';

export default function RedWinePage() {
  const [isMobile, setIsMobile] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);

  // Initialiser les filtres avec "Vin Rouge" déjà sélectionné
  const [selectedFilters, setSelectedFilters] = useState({
    color: ['Rouge'], // Valeur verrouillée pour "Vin Rouge"
    region: [],
    vintage: [],
    millesime: [],
    certification: [],
    style: [],
    volume: [],
    accord_mets: [],
    region__pays: [],
    categories: []
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const checkMobile = () => setIsMobile(mediaQuery.matches);

    checkMobile();
    mediaQuery.addEventListener('change', checkMobile);
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, []);

  const handleFilterChange = (category: keyof typeof selectedFilters, filters: string[]) => {
    // Autoriser le changement pour toutes les catégories sauf "color"
    if (category !== 'color') {
      setSelectedFilters((prev) => ({
        ...prev,
        [category]: filters
      }));
    }
  };

  return (
    <div className="flex flex-1">
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-hidden -mt-11">
        <div
          ref={filterContentRef}
          className="p-4 h-full overflow-y-hidden "
          style={{ maxHeight: '100vh' }}
        >
          {isMobile ? (
            <MobileProductFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          ) : (
            <ProductFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              resetFilters={() => {}} // Désactiver la réinitialisation de la couleur
            />
          )}
        </div>
      </aside>

      <main
        ref={mainContentRef}
        className="flex-1 bg-white overflow-y-auto"
        style={{ height: '100vh' }}
      >
        <div className="max-w-7xl mx-auto mt-48 ">
          <h1 className='text-center text-4xl text-white font-black bg-red-800 p-8 rounded-t-xl'>Nos Vins Rouges</h1>
          <h2 className='text-center text-lg text-black mt-4 font-bold'>Découvrez notre sélection de vins rouges</h2>
          <h3 className='text-center text-sm text-black-500 mt-4 mx-10'> Les vins rouges sont des vins obtenus par la fermentation de raisins noirs ou de raisins blancs à peau rouge. Ils se caractérisent par leur couleur rouge, qui peut varier du rouge violacé jeune au rouge brique pour les vins plus âgés. Ils se distinguent des vins blancs et des vins rosés par leur couleur, mais aussi par leur mode de vinification et leur goût.</h3>
          <ProductsCards
            selectedFilters={selectedFilters}
            onAddToCart={(product) => console.log('Add to cart:', product)}
          />
        </div>
        <br />
        <HeroBanner />
        <WineCategories />
        <Slogan />
        <BackToTop />
      </main>
    </div>
  );
}
