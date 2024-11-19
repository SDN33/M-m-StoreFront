'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';

export default function PromosPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    region: [],
    vintage: [],
    millesime: [],
    certification: [],
    style: [],
    volume: [],
    accord_mets: [],
    region__pays: [],
    categories: [],
    sale_price: ['true']
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

  const resetAllFilters = () => {
    setSelectedFilters({
      color: [],
      region: [],
      vintage: [],
      millesime: [],
      certification: [],
      style: [],
      volume: [],
      accord_mets: [],
      region__pays: [],
      categories: [],
      sale_price: ['true']
    });
  };

  // Modify selectedFilters to include only products with sale_price
  const promoFilters = {
    ...selectedFilters,
    has_sale_price: ['true'] // Add a filter to ensure only sale priced products are shown
  };

  return (
    <>
      {isMobile ? (
        <div>
          {/* Mobile version - simplified */}
          <ProductFilter
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            resetFilters={resetAllFilters}
          />
          <ProductsCards
            selectedFilters={promoFilters}
            onAddToCart={(product) => console.log('Add to cart:', product)}
          />
        </div>
      ) : (
        <div className="flex flex-1">
          <aside
            className={`w-64 bg-white border-r border-gray-200 ${
              isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'
            } ${isMobile && !isFilterOpen ? '-translate-x-full' : 'translate-x-0'}`}
          >
            <div
              className="p-4 h-full overflow-y-auto scroll-container"
              style={{
                overscrollBehavior: 'auto',
                msOverflowStyle: 'auto',
                scrollbarWidth: 'auto',
                maxHeight: '100vh'
              }}
            >
              <ProductFilter
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                resetFilters={resetAllFilters}
              />
            </div>
          </aside>

          <main
            className="flex-1 bg-white overflow-y-auto"
            style={{
              overscrollBehavior: 'contain',
              height: '100vh'
            }}
          >
            <div className="max-w-7xl mx-auto px-4 mb-8 mt-44">
              <h1 className="text-3xl font-bold mb-6 mt-8 text-center text-white bg-gradient-to-br from-gray-800 to-black p-10 slide-in-right">Nos vins en promotions</h1>
              <section className="bg-white rounded-lg shadow">
                <ProductsCards
                  selectedFilters={promoFilters}
                  onAddToCart={(product) => console.log('Add to cart:', product)}
                />
              </section>
            </div>
          </main>
        </div>
      )}

      {isMobile && isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}
