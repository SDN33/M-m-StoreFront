'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import MobileProductFilter from '@/components/MobileProductFilter';
import Slogan from '@/components/Slogan';
import HeroBanner from '@/components/HeroBanner';
import WineCategories from '@/components/WineCategories';
import BackToTop from '@/components/BackToTop';

export default function SweetWinePage() {
  const [isMobile, setIsMobile] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    color: ['Liquoreux'],
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
          <h1 className="text-center text-4xl text-white font-black bg-amber-600 p-8 rounded-t-xl">
            Nos Vins Liquoreux
          </h1>
          <div className="border-b-4 border-white w-full max-w-[50rem] -mt-1 mx-auto"></div>

          <h2 className="text-center text-lg text-black mt-4 font-bold">
            Découvrez notre sélection de vins liquoreux
          </h2>
          <h3 className='text-center text-sm text-black-500 mt-4 mx-10'>
            Les vins liquoreux, riches et sucrés, sont parfaits pour accompagner les desserts ou les fromages. Ils se distinguent par leur douceur intense et leurs arômes complexes de fruits mûrs et de miel.
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
