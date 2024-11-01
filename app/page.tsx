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
import WineCategories from '@/components/WineCategories';
import Livraison from '@/components/Livraison';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const [isAtBottom, setIsAtBottom] = useState(false); // État pour suivre si on est en bas de la page

  useEffect(() => {
    async function fetchProducts() {
      await fetch('/api/products');
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

        // Mettre à jour l'état isAtBottom
        setIsAtBottom(isNearBottom);

        if (isNearBottom && e.deltaY > 0) {
          e.preventDefault();
          // Défilement vers le footer
          window.scrollTo({
            top: document.body.scrollHeight, // Défiler vers le bas de la page
            behavior: 'smooth'
          });
        }

        // Vérifier si on scroll vers le haut
        if (e.deltaY < 0 && isAtBottom) {
          e.preventDefault();
          // Remonter vers le haut de la page
          window.scrollTo({
            top: 0, // Défilement vers le haut
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isMobile, isAtBottom]); // Ajouter isAtBottom comme dépendance

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
            className="flex-1 bg-white overflow-y-auto"
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
              <div className="max-w-7xl mx-auto px-4 space-y-8">
                <section className="bg-white rounded-lg shadow">
                  <ProductsCards selectedFilters={selectedFilters} onAddToCart={(product) => console.log('Add to cart:', product)} />
                </section>
              </div>
              <br /><br />
              <HeroBanner />
              <Livraison />
              <br /><br />
              <WineCategories />
              <Trust />
              <Slogan />
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
