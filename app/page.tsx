'use client';

import React, { useEffect, useState, useRef } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import HeroBanner from '@/components/HeroBanner';
import Slogan from '@/components/Slogan';
import Livraison from '@/components/Livraison';
import Newletter from '@/components/Newletter';
import ProductsIntro from '@/components/ProductIntro';
import WineSelector from '@/components/WineSelector';
import Slider from '@/components/Slider';
import WineCategories from '@/components/WineCategories';
import Suggestion from '@/components/Suggestion';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const lastComponentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

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

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (!isMobile) {
        const target = e.target as Node;
        const filterContent = filterContentRef.current;
        const mainContent = mainContentRef.current;
        const lastComponent = lastComponentRef.current;
        const footer = document.querySelector('footer');

        // Gérer le scroll indépendant des filtres
        if (filterContent?.contains(target)) {
          e.preventDefault();
          filterContent.scrollTop += e.deltaY;
          return;
        }

        if (mainContent && lastComponent && footer) {
          const mainRect = mainContent.getBoundingClientRect();
          const lastComponentRect = lastComponent.getBoundingClientRect();
          const footerRect = footer.getBoundingClientRect();

          // Scroll vers le bas
          if (lastComponentRect.bottom <= mainRect.bottom && e.deltaY > 0 && !isAtBottom) {
            e.preventDefault();
            footer.scrollIntoView({ behavior: 'smooth' });
            setIsAtBottom(true);
          }

          // Scroll vers le haut
          if (isAtBottom && e.deltaY < 0) {
            e.preventDefault();
            // Vérifier si le footer est visible
            if (footerRect.top < window.innerHeight) {
              lastComponent.scrollIntoView({ behavior: 'smooth' });
              setIsAtBottom(false);
            }
          }
        }
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isMobile, isAtBottom]);

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
    <>
      <div className="flex flex-1">
      <aside
        className={`w-64 bg-white border-r border-gray-200 ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'} ${isMobile && !isFilterOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div
          ref={filterContentRef}
          className="p-4 h-full overflow-y-auto scroll-container"
          style={{
            overscrollBehavior: 'contain',
            msOverflowStyle: 'none',
            scrollbarWidth: 'thin'
          }}
        >
          <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleFilterChange} resetFilters={resetAllFilters} />
        </div>
      </aside>

      <main
        ref={mainContentRef}
        className="flex-1 bg-gray-50 overflow-y-auto"
        style={{
          overscrollBehavior: 'contain',
          height: '100vh'
        }}
      >
        <div className="space-y-8">
          <br /><br />
          <br /><br />
          <br /><br />
          <ProductsIntro />
          <Slider />
          <Suggestion />
          <WineCategories />
          <br />
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <section className="bg-white rounded-lg shadow">
              <ProductsCards selectedFilters={selectedFilters} />
            </section>
          </div>
          <br /><br />
          <HeroBanner />
          <Livraison />
          <WineSelector />
          <Slogan />
          <div ref={lastComponentRef}>
            <Newletter />
          </div>
          <br /><br />
        </div>
      </main>
    </div>
    {isMobile && isFilterOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={() => setIsFilterOpen(false)}
      />
    )}
  </>
  );
}
