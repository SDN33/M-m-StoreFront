'use client';

import React, { useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import HeroBanner from '@/components/HeroBanner';
import Slogan from '@/components/Slogan';
import WineCategories from '@/components/WineCategories';
import MobileProductFilter from './MobileProductFilter';
import Trust from '@/components/Trust';
import Livraison from './Livraison';
import MobileProductsIntro from './MobileProductIntro';
import LatestArticles from './LatestArticles';
import BackToTop from './BackToTop';

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
    categories: [],
    sans_sulfites_: [],
    petit_prix: [],
    haut_de_gamme: []
  });

  const handleFilterChange = (category: keyof typeof selectedFilters, filters: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: filters
    }));
  };


  return (
    <div className="flex flex-col bg-gray-50 overflow-y-auto">
      <br /><br /><br /><br />
      <div className="mt-8">
        <MobileProductsIntro />
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <section className="bg-white rounded-lg shadow">
            <ProductsCards selectedFilters={selectedFilters} onAddToCart={(product) => console.log('Add to cart:', product)} />
          </section>
        </div>
        <br /><br />
        <HeroBanner />
        <Livraison />
        <WineCategories />
        <Trust />
        <LatestArticles />
        <Slogan />
        <br /><br />
        <MobileProductFilter selectedFilters={selectedFilters} onFilterChange={handleFilterChange} resetFilters={() => {}} />
        <BackToTop />
      </div>
    </div>
  );
};

export default MobileHome;
