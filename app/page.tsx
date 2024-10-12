'use client';

import HeroBanner from '@/components/HeroBanner';
import Products from '@/components/Products';
import Slogan from '@/components/Slogan';
import Newletter from '@/components/Newletter';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <HeroBanner />
        <Products />
        <br />
        <Slogan />
        <br /><br />
        <Newletter />
        <br />



      </div>
    </div>
  );
}
