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
import MobileHome from '@/components/MobileHome';
import Trust from '@/components/Trust';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const lastComponentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [bottomDwellTime, setBottomDwellTime] = useState(0);
  const lastScrollTime = useRef(Date.now());

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
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

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
        const mainContent = mainContentRef.current;
        const footer = footerRef.current;

        // Gérer le défilement du filtre séparément
        if (filterContentRef.current?.contains(target)) {
          e.preventDefault();
          filterContentRef.current.scrollTop += e.deltaY;
          return;
        }

        // Vérifier si l'événement provient du conteneur principal
        if (mainContent?.contains(target) && footer) {
          const mainScrollHeight = mainContent.scrollHeight;
          const mainScrollTop = mainContent.scrollTop;
          const mainClientHeight = mainContent.clientHeight;

          // Calculer si on est proche du bas du conteneur principal
          const isNearBottom = mainScrollHeight - (mainScrollTop + mainClientHeight) < 10;

          if (isNearBottom && e.deltaY > 0 && !isAtBottom) {
            e.preventDefault();
            setBottomDwellTime((prev) => prev + (Date.now() - lastScrollTime.current));

            // Si on a passé au moins 1 seconde en bas
            if (bottomDwellTime > 1000) {
              footer.scrollIntoView({ behavior: 'smooth' });
              setIsAtBottom(true);
              setBottomDwellTime(0);
            }
          } else {
            // Gérer le scroll vers le haut depuis le footer
            if (isAtBottom && e.deltaY < 0) {
              e.preventDefault();
              footer.scrollIntoView({ behavior: 'smooth' });
              setIsAtBottom(false);
            }
          }
        }

        lastScrollTime.current = Date.now();
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isMobile, isAtBottom, bottomDwellTime]);

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
      {isMobile ? (
        <MobileHome />
      ) : (
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
            <div className="">
              <br /><br />
              <br /><br />
              <br />
              <ProductsIntro />
              <Slider />
              <Suggestion />
              <WineSelector />
              <WineCategories />
              <br />
              <div className="max-w-7xl mx-auto px-4 space-y-8">
                <section className="bg-white rounded-lg shadow">
                  <ProductsCards selectedFilters={selectedFilters} onAddToCart={(product) => console.log('Add to cart:', product)} />
                </section>
              </div>
              <br /><br />
              <HeroBanner />
              <Livraison />
              <Slogan />
              <Trust />
              <div ref={lastComponentRef}>
                <Newletter />
              </div>
              <br /><br />
            </div>
          </main>
          <footer ref={footerRef}>
            {/* Votre contenu de footer ici */}
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
