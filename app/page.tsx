'use client';

import HeroBanner from '@/components/HeroBanner';
import Products from '@/components/Products';
import Slogan from '@/components/Slogan';
import Newletter from '@/components/Newletter';
import Livraison from '@/components/Livraison';
import { useEffect, useState } from 'react';
import VendorList from '@/components/VendorsList';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false); // État pour vérifier si l'appareil est mobile

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

  return (
    <div className={`flex flex-col min-h-screen ${isMobile ? 'max-w-screen-sm mx-auto' : 'max-w-screen-lg mx-auto'}`}>
      <div className="flex-grow">
        <HeroBanner />
        <Products />
        <Livraison />
        <video
          src="/videos/minibanner.mp4"
          title="Banner vignes"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full"
        ></video>
        <VendorList />
        <video
          src="/videos/minibanner.mp4"
          title="Banner vignes"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full"
        ></video>
        <Slogan />
        <br /><br />
        <Newletter />
        <br />
      </div>
    </div>
  );
}
