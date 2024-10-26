'use client';

import React, { useEffect, useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import HeroBanner from '@/components/HeroBanner';
import Slogan from '@/components/Slogan';
import Livraison from '@/components/Livraison';
import Newletter from '@/components/Newletter';
import ProductsIntro from '@/components/ProductIntro';
import WineSelector from '@/components/WineSelector';
import Slider from '@/components/Slider';
import WineCategories from '@/components/WineCategories';
import Suggestion from '@/components/Suggestion';

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
      categories: []
    });
  };

  return (
    <div className="flex flex-col bg-gray-50 overflow-y-auto">
      <div className="space-y-8">
        <ProductsIntro />
        <Slider />
        <Suggestion />
        <WineCategories />
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <section className="bg-white rounded-lg shadow">
            <ProductsCards selectedFilters={selectedFilters} />
          </section>
        </div>
        <HeroBanner />
        <Livraison />
        <WineSelector />
        <Slogan />
        <Newletter />
      </div>
    </div>
  );
};

export default MobileHome;
