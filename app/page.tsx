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
import Footer from '@/components/Footer';
import WineCategories from '@/components/WineCategories';
import Suggestion from '@/components/Suggestion';


export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);

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

        if (filterContent?.contains(target)) {
          e.preventDefault();
          filterContent.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isMobile]);

  const handleFilterChange = (category: keyof typeof selectedFilters, filters: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: filters
    }));
  };

    return (
      <div className="flex flex-col min-h-screen">

        <div className="flex flex-1">
          <aside
            className={`w-64 bg-gray-50 border-r border-gray-200 ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'} ${isMobile && !isFilterOpen ? '-translate-x-full' : 'translate-x-0'}`}
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
              {/* Vous pouvez également cacher le ProductFilter si nécessaire sur mobile */}
              <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
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
              <HeroBanner />
              <div className="max-w-7xl mx-auto px-4 space-y-8">
                <section className="bg-gray-50 rounded-lg shadow">
                  <ProductsCards selectedFilters={selectedFilters} />
                </section>
              </div>
              <WineSelector />
              <Livraison />
              <Slogan />
              <Newletter />
              <br /><br />
            </div>
            <Footer />

          </main>
        </div>

        {isMobile && isFilterOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
      </div>
    );
  }
