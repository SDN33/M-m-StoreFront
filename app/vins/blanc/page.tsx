'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import MobileProductFilter from '@/components/MobileProductFilter';
import Slogan from '@/components/Slogan';
import HeroBanner from '@/components/HeroBanner';
import WineCategories from '@/components/WineCategories';
import BackToTop from '@/components/BackToTop';

export default function BlancWinePage() {
  const [isMobile, setIsMobile] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    color: ['Blanc'],
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
          <h1 className="text-center text-4xl text-white font-black bg-yellow-600 p-8 rounded-t-xl">
            Nos Vins Blancs
          </h1>
          <h2 className="text-center text-lg text-black mt-4 font-bold">
            Découvrez notre sélection de vins blancs
          </h2>
          <h3 className='text-center text-sm text-black-500 mt-4 mx-10'>
            Les vins blancs sont souvent obtenus à partir de raisins à pulpe blanche et à peau claire. Ils peuvent varier du jaune pâle au doré en fonction de l&apos;âge et du cépage, offrant une large palette de saveurs allant de frais et fruité à riche et complexe.
          </h3>

          <ProductsCards
            selectedFilters={selectedFilters}
            onAddToCart={(product) => console.log('Add to cart:', product)}
          />
        </div>
        <br />
        <HeroBanner />
        <br />
        <WineCategories />
        <Slogan />
        <BackToTop />
      </main>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0">
          <MobileProductFilter
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}
    </div>
  );
}
