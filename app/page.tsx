'use client';

import React, { useEffect, useState, useRef } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import Slogan from '@/components/Slogan';
import ProductsIntro from '@/components/ProductIntro';
import Slider from '@/components/Slider';
import MobileHome from '@/components/MobileHome';
import Trust from '@/components/Trust';
import HeroBanner from '@/components/HeroBanner';
import Livraison from '@/components/Livraison';
import WineCategories from '@/components/WineCategories';
import LatestArticles from '@/components/LatestArticles';
import BackToTop from '@/components/BackToTop';
import PromoCode from '@/components/PromoCode';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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

  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {

    // Reset scroll position immediately on load
    window.scrollTo(0, 0);

    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
    };

    // Reset scroll on initial load
    resetScroll();

    // Reset scroll after products are loaded
    const resetScrollTimeout = setTimeout(resetScroll, 100);

    const fetchProducts = async () => {
      try {
        const cachedProducts = localStorage.getItem('cachedProducts');

        if (cachedProducts) {
          setProductsLoaded(true);
          resetScroll();
          return;
        }

        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          localStorage.setItem('cachedProducts', JSON.stringify(products));
          setProductsLoaded(true);
          resetScroll();
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProductsLoaded(true);
        resetScroll();
      }
    };

    fetchProducts();

    // Additional scroll reset listeners
    window.addEventListener('load', resetScroll);

    return () => {
      window.removeEventListener('load', resetScroll);
      clearTimeout(resetScrollTimeout);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const checkMobile = () => {
      setIsMobile(mediaQuery.matches);
      window.scrollTo(0, 0);
    };

    checkMobile();

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      window.scrollTo(0, 0);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!scrollEnabled) return;

    const handleScroll = (e: WheelEvent) => {
      const target = e.target as Node;
      const mainContent = mainContentRef.current;
      const footer = footerRef.current;
      const filterContent = filterContentRef.current;

      if (filterContent?.contains(target)) {
        return;
      }

      if (mainContent?.contains(target) && footer) {
        const mainScrollHeight = mainContent.scrollHeight;
        const mainScrollTop = mainContent.scrollTop;
        const mainClientHeight = mainContent.clientHeight;

        const isNearBottom = mainScrollHeight - (mainScrollTop + mainClientHeight) < 10;

        setIsAtBottom(isNearBottom);

        if (isNearBottom && e.deltaY > 0) {
          e.preventDefault();
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }

        if (e.deltaY < 0 && isAtBottom) {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isMobile, isAtBottom, scrollEnabled]);

  const handleFilterChange = (category: keyof typeof selectedFilters, filters: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: filters
    }));
    setScrollEnabled(true);
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

  }

  return (
    <>
      {isMobile ? (
        <MobileHome />
      ) : (
        <div className="flex flex-1">
          <aside
            className={`w-64 bg-white border-r border-gray-200 ${
              isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'
            } ${isMobile && !isFilterOpen ? '-translate-x-full' : 'translate-x-0'}`}
          >
            <div
              ref={filterContentRef}
              className="p-4 h-full overflow-y-auto scroll-container"
              style={{
                overscrollBehavior: 'auto',
                msOverflowStyle: 'auto',
                scrollbarWidth: 'auto',
                maxHeight: '100vh'
              }}
            >
              <ProductFilter
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                resetFilters={resetAllFilters}
              />
            </div>
          </aside>

          <main
            ref={mainContentRef}
            className="flex-1 bg-white overflow-y-auto"
            style={{
              overscrollBehavior: 'contain',
              height: '100vh'
            }}
          >
            <div>
              <div className="pt-24 md:hidden lg:flex" />
              <ProductsIntro />
              <Slider />

              <div className="max-w-7xl mx-auto px-4">
                <section className="bg-white rounded-lg shadow">
                  {productsLoaded && (
                    <ProductsCards
                      selectedFilters={selectedFilters}
                      onAddToCart={(product) => console.log('Add to cart:', product)}
                    />
                  )}
                </section>
              </div>
              <div className="py-8" />
              <HeroBanner />
              <Livraison />
              <div className="py-8" />
              <WineCategories />
              <div className="py-8" />
              <LatestArticles />
              <Trust />
              <Slogan />
              <div className="py-8" />
              <BackToTop />
              <PromoCode />
            </div>
          </main>

          <footer ref={footerRef}>
          </footer>
        </div>
      )}

      {isMobile && isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}
