'use client';

import HeroBanner from '@/components/HeroBanner';
import Products from '@/components/Products';
import Slogan from '@/components/Slogan';
import Newletter from '@/components/Newletter';
import PromotionSection from '@/components/PromotionSection';
import Livraison from '@/components/Livraison';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <PromotionSection />
        <HeroBanner />
        <Products />
        <Livraison />
        <Slogan />
        <br /><br />
        <Newletter />
        <br />



      </div>
    </div>
  );
}
