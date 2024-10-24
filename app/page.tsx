'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import HeroBanner from '@/components/HeroBanner';

interface ProductFilter {
  color: string[];
  region: string[];
  vintage: string[];
  certification: string[];
  style: string[];
  volume: string[];
  accord_mets: string[];
  region__pays: string[];
}

export default function Home() {
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<{
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    volume: string[];
    accord_mets: string[];
    region__pays: string[];
    categories: string[];
  }>({
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

  // Handle initial mounting
  useEffect(() => {
    setIsMounted(true);
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    setIsLoading(false);

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

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile filter button */}
      {isMobile && (
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="fixed bottom-4 right-4 z-50 bg-primary text-white rounded-full p-4 shadow-lg"
        >
          Filtres
        </button>
      )}

      <div className="flex flex-1">
        {/* Sidebar filters - hidden by default on mobile */}
        <aside
          className={`
            w-64 bg-white border-r border-gray-200
            ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'}
            ${(isMobile && !isFilterOpen) ? '-translate-x-full' : 'translate-x-0'}
            ${!isMobile ? 'block' : ''}
          `}
        >
          <div className="p-4 h-full overflow-y-auto">
            <ProductFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className={`flex-1 bg-gray-50 ${isMobile ? 'w-full' : 'ml-0'}`}>
          <HeroBanner />
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
            <section className="bg-white rounded-lg shadow">
              <ProductsCards selectedFilters={selectedFilters} />
            </section>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobile && isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}
