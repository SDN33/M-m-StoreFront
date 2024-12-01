'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import MobileProductFilter from '@/components/MobileProductFilter';
import Slogan from '@/components/Slogan';
import HeroBanner from '@/components/HeroBanner';
import BackToTop from '@/components/BackToTop';
import CatSlider from '@/components/CatSlider';

export default function RedWinePage() {
  const [isMobile, setIsMobile] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    color: ['Rouge'],
    region: [],
    vintage: [],
    millesime: [],
    certification: [],
    style: [],
    volume: [],
    accord_mets: [],
    region__pays: [],
    categories: [],
    sans_sulfites_: [],
    petit_prix: [],
    haut_de_gamme: [],
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const checkMobile = () => setIsMobile(mediaQuery.matches);
    checkMobile();
    mediaQuery.addEventListener('change', checkMobile);
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, []);

  const handleFilterChange = (category: keyof typeof selectedFilters, filters: string[]) => {
    if (category !== 'color') {
      setSelectedFilters((prev) => ({
        ...prev,
        [category]: filters
      }));
    }
  };

  return (
    <div className="flex h-screen">
      {!isMobile && (
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-hidden h-full -mt-11">
          <div className="p-4 h-full">
            <ProductFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              resetFilters={() => {}}
            />
          </div>
        </aside>
      )}

      <main className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-8'}`}>
        <div className="max-w-7xl mx-auto mt-36">
          <div className="bg-red-800 text-white">
            <div className="text-center text-xs mx-auto p-2"><a href="/">Accueil</a> / <strong>Vins Rouges</strong></div>
            <h1 className="text-center text-4xl font-black p-8 rounded-t-xl">Nos Vins Rouges</h1>
            <div className="border-b-4 border-white w-full max-w-[50rem] -mt-1 mx-auto"></div>
          </div>
          <h2 className="text-center text-lg text-black mt-4 font-bold">Découvrez notre sélection de vins rouges</h2>
          <h3 className="text-center text-sm text-black-500 mt-4 mx-10">Les vins rouges sont des vins obtenus par la fermentation de raisins noirs ou de raisins blancs à peau rouge. Ils se caractérisent par leur couleur rouge, qui peut varier du rouge violacé jeune au rouge brique pour les vins plus âgés. Ils se distinguent des vins blancs et des vins rosés par leur couleur, mais aussi par leur mode de vinification et leur goût.</h3>

          <ProductsCards
            selectedFilters={selectedFilters}
            onAddToCart={(product) => console.log('Add to cart:', product)}
          />
        </div>
        <br />
        <HeroBanner />
        <br />
        <CatSlider />
        <br />
        <br />
        <Slogan />
        <BackToTop />
      </main>
      <div className='sm:flex md:flex lg:hidden'>
        <MobileProductFilter
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          resetFilters={() => {}}
        />
      </div>
    </div>
  );
}
