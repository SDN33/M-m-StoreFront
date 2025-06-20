'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import MobileProductFilter from '@/components/MobileProductFilter';
import Slogan from '@/components/Slogan';
import HeroBanner from '@/components/HeroBanner';
import CatSlider from '@/components/CatSlider';

export default function SparklingWinePage() {
  const [isMobile, setIsMobile] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    color: ['Pétillant'],
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
    prestige: [],
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const checkMobile = () => setIsMobile(mediaQuery.matches);
    checkMobile();
    mediaQuery.addEventListener('change', checkMobile);
    return () => mediaQuery.removeEventListener('change', checkMobile);
  }, []);

  const handleFilterChange = (category: string, filters: string[]) => {
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
          <div className="bg-teal-800 text-white">
            <div className="text-center text-xs mx-auto p-2"><a href="/">Accueil</a> / <strong>Vins Pétillants</strong></div>
            <h1 className="text-center text-4xl font-gray-950 p-8 rounded-t-xl">Nos Vins Pétillants</h1>
            <div className="border-b-4 border-white w-full max-w-[50rem] -mt-1 mx-auto"></div>
          </div>

          <div className="border-b-4 border-white w-full max-w-[50rem] -mt-1 mx-auto"></div>
          <h2 className="text-center text-lg text-gray-950 mt-4 font-bold">
            Découvrez notre sélection de vins pétillants bio
          </h2>
          <h3 className='text-center text-sm text-gray-950-500 mt-4 mx-10'>
            Les vins pétillants, tels que le champagne et les crémants, sont appréciés pour leurs bulles fines et leur fraîcheur. Idéaux pour les célébrations, ils apportent une touche festive à toutes les occasions. Mais saviez-vous que les vins pétillants bio sont également très appréciés pour leur qualité et leur respect de l&apos;environnement ? <br />Découvrez notre sélection de vins pétillants bio et laissez-vous tenter par leur saveur unique !
          </h3>

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

      </main>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0">
          <MobileProductFilter
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            resetFilters={() => {}}
          />
        </div>
      )}
    </div>
  );
}
