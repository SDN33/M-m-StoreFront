'use client';

import React, { useEffect, useState } from 'react';
import DesktopHome from '@/components/DesktopHome';
import MobileHome from '@/components/MobileHome';
import Head from 'next/head';

export default function Home() {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Head>
        <meta name="title" content="AccCHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette" />
        <meta
          name="description"
          content="Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites"
        />
        <meta property="og:title" content="ACHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette" />
        <meta
          property="og:description"
          content="Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites"
        />
        <meta property="og:image" content="https://vinsmemegeorgette.com/images/post_partage.webp" />
        <meta property="og:url" content="https://vinsmemegeorgette.com" />
        <meta property='og:favicon' content='/images/favicon.ico' />
      </Head>
      {deviceType === 'mobile' ? (
        <MobileHome />
      ) : deviceType === 'tablet' ? (
        <DesktopHome className="tablet-view" />
      ) : (
        <DesktopHome />
      )}
    </>
  );
}
