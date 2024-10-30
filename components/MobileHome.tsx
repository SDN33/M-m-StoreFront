'use client';

import React, { useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import HeroBanner from '@/components/HeroBanner';
import Slogan from '@/components/Slogan';
import Livraison from '@/components/Livraison';
import ProductsIntro from '@/components/ProductIntro';
import WineCategories from '@/components/WineCategories';
import Suggestion from '@/components/Suggestion';
import MobileProductFilter from './MobileProductFilter';
import Trust from '@/components/Trust';

const MobileHome: React.FC = () => {
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
    categories: []
  });

  const handleAddToCart = (productId: number, quantity: number, variationId: number) => {
    // Implement the logic to add the product to the cart
    console.log(`Product ${productId} with quantity ${quantity} and variation ${variationId} added to cart`);
  };

  const handleFilterChange = (category: keyof typeof selectedFilters, filters: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: filters
    }));
  };


  return (
    <div className="flex flex-col bg-gray-50 overflow-y-auto">
      <div className="space-y-8">
        <ProductsIntro />
        <Suggestion />
        <WineCategories />
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <section className="bg-white rounded-lg shadow">
            <ProductsCards selectedFilters={selectedFilters} onAddToCart={handleAddToCart} />
          </section>
        </div>
        <HeroBanner />
        <Livraison />
        <Slogan />
        <Trust />
        <MobileProductFilter selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
};

export default MobileHome;
