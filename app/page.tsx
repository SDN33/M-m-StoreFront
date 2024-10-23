'use client';

import React, { useEffect, useState } from 'react';
import Products from '@/components/Products';
import Slogan from '@/components/Slogan';
import Newletter from '@/components/Newletter';
import Livraison from '@/components/Livraison';
import VendorList from '@/components/VendorsList';
import ProductFilter from '@/components/ProductFilters';
import Header from '@/components/Header';
import { Product } from '@/utils/types';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
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

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredProducts = selectedFilters.length > 0
    ? products.filter((product) =>
        product.categories.some(categories =>
          selectedFilters.includes(categories.name)
        )
      )
    : products;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

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
        <aside className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto h-screen">
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
              <Products products={filteredProducts} />
            </section>

            <VendorList />

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
