'use client';

import React, { useState } from 'react';
import ProductsCards from '@/components/ProductsCards';
import Slogan from '@/components/Slogan';
import WineCategories from '@/components/WineCategories';
import MobileProductFilter from '@/components/MobileProductFilter';
import Trust from '@/components/Trust';
import Livraison from './Livraison';
import MobileProductsIntro from './MobileProductIntro';
import BackToTop from './BackToTop';
import PromotionSection from './PromotionSection';
import BioWineDescription from './BioWineDescription';
import Image from 'next/image';
import MobileSlider from './MobileSlider';

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
    haut_de_gamme: [],
  });

  const handleFilterChange = (filterType: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: values
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      color: [], region: [], vintage: [], millesime: [],
      certification: [], style: [], volume: [],
      accord_mets: [], region__pays: [], categories: [],
      sans_sulfites_: [], petit_prix: [], haut_de_gamme: []
    });
  };



  return (
    <div className="flex flex-col bg-gray-100 overflow-y-auto overflow-x-hidden">
      <br /><br /><br /><br />
      <div className="mt-8">
        <PromotionSection />
        <div className="mx-auto bg-yellow-50">
          <Image
            src="/images/post_partage.webp"
            alt="Mémé Georgette"
            width={600}
            height={600}
            className='object-cover flex justify-center mx-auto'
            priority
          />
          <MobileProductsIntro />
          <div className="w-screen">
        </div>
        <MobileSlider />
        <div className="max-w-7xl mx-auto px-4 space-y-6 mt-2 ">
        <div className=" bg-white w-full justify-center items-center">
          <div className="flex justify-center items-center space-x-6 w-fit h-auto mx-auto mb-8 bg-white rounded-lg p-4 border border-gray-100">
            <Image
              src="/images/paiement.png"
              alt="Paiement sécurisé"
              height={130}
              width={130}
              sizes="130"
            />
          </div>
        </div>

        <section className="bg-white rounded-lg shadow">
          <ProductsCards selectedFilters={selectedFilters} onAddToCart={(product) => console.log('Add to cart:', product)} />
        </section>
          </div>
          <br /><br />
          <Livraison />
          <br />
          <WineCategories />
          <Trust />
          <br />
          <Slogan />
          <BioWineDescription />
          <br /><br />
          <BackToTop />
          <MobileProductFilter
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
