'use client';

import HeroBanner from '@/components/HeroBanner';
import Newsletter from '@/components/Newletter';
import Products from '@/components/Products';
import Slogan from '@/components/Slogan';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <HeroBanner />
        <Products />
        <br />
        <Slogan />
        <br /><br />
        <Newsletter />



      </div>
    </div>
  );
}
