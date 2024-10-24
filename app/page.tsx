'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import HeroBanner from '@/components/HeroBanner';
import Slogan from '@/components/Slogan';
import Livraison from '@/components/Livraison';
import Newletter from '@/components/Newletter';
import ProductsIntro from '@/components/ProductIntro';
import WineSelector from '@/components/WineSelector';
import Filtertop from '@/components/Filtertop';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    region: [],
    vintage: [],
    certification: [],
    style: [],
    volume: [],
    accord_mets: [],
    region__pays: [],
    categories: []
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const handleFilterChange = (category: keyof typeof selectedFilters, filters: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: filters
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile && (
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="fixed bottom-4 right-4 z-50 bg-primary text-white rounded-full p-4 shadow-lg"
        >
          Filtres
        </button>
      )}

      <div className="flex flex-1">
        <aside
          className={`w-64 bg-white border-r border-gray-200 ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'} ${isMobile && !isFilterOpen ? '-translate-x-full' : 'translate-x-0'}`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
          </div>
        </aside>

        <main className="flex-1 bg-gray-50">
          <br /><br /><br /><br />
          <br /><br /><br /><br />
          <HeroBanner />
          <ProductsIntro />
          <WineSelector />
          <Filtertop
            sortBy="default"
            handleSortChange={(event: React.ChangeEvent<HTMLSelectElement>) => console.log(event.target.value)}
            resetFilters={() => console.log('Filters reset')}
          />
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
            <section className="bg-white rounded-lg shadow">
              <ProductsCards selectedFilters={selectedFilters} />
            </section>
          </div>
          <Livraison />
          <Slogan />
          <Newletter />

        </main>
      </div>

      {isMobile && isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}
