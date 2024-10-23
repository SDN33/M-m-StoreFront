'use client'; // Doit être au tout début

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';

interface Product {
  id: number;
  name: string;
  categories: { name: string }[];
  price: number;
  date_added: string;
  images: { src: string }[];
  millesime?: string;
  certification?: string;
  region__pays?: string;
  volume: string;
  style?: string;
  accord_mets?: string[];
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    volume: string[];
    accord_mets: string[];
    region__pays: string[];
  }>({
    color: [],
    region: [],
    vintage: [],
    certification: [],
    style: [],
    volume: [],
    accord_mets: [],
    region__pays: []
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

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

  const filteredProducts = products.filter((product) => {
    return Object.entries(selectedFilters).every(([category, filters]) => {
      if (filters.length === 0) return true;
      return product.categories.some((cat: { name: string }) => filters.includes(cat.name));
    });
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Bouton pour filtres sur mobile */}
      {isMobile && (
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="fixed bottom-4 right-4 z-50 bg-primary text-white rounded-full p-4 shadow-lg"
        >
          Filtres
        </button>
      )}

      <div className="flex flex-1">
        {/* Sidebar avec filtres */}
        <aside className={`w-1/4 bg-white border-r border-gray-200 overflow-y-auto h-screen ${isMobile && isFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="p-4">
            <ProductFilter
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 bg-gray-50 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
            {/* Section des produits */}
            <section className="bg-white rounded-lg shadow">
              <ProductsCards selectedFilters={selectedFilters} />
            </section>
          </div>
        </main>
      </div>

      {/* Overlay pour mobile quand les filtres sont ouverts */}
      {isMobile && isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}
