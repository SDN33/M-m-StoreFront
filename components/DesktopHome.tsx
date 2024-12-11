'use client';

import React, { useEffect, useState, useRef } from 'react';
import ProductsCards from '@/components/ProductsCards';
import ProductFilter from '@/components/ProductFilters';
import Slogan from '@/components/Slogan';
import ProductsIntro from '@/components/ProductIntro';
import Slider from '@/components/Slider';
import Trust from '@/components/Trust';
import Livraison from '@/components/Livraison';
import WineCategories from '@/components/WineCategories';
import Image from 'next/image';
import GoToFooter from '@/components/GoToFooter';
import BioWineDescription from '@/components/BioWineDescription';
import Socialshare from '@/components/Socialshare';
import BackToTop from '@/components/BackToTop';
import { CreditCard } from 'lucide-react';

export default function Home() {
  const [isMobile] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const paymentMethods = [
    {
      name: 'Avis Google',
      href: 'https://g.page/r/CeblcZSGEi33EBM/review',
      src: '/images/Donnez-votre-avis.png',
      height: 100,
      width: 100,
    },
    {
      name: 'Visa',
      href: 'https://www.visa.fr/',
      src: '/images/visa.png',
      height: 40,
      width: 60,
    },
    {
      name: 'MasterCard',
      href: 'https://www.mastercard.fr/',
      src: '/images/mastercard.png',
      height: 40,
      width: 40,
    },
    {
      name: 'Stripe',
      href: 'https://stripe.com/fr',
      src: '/images/stripe.webp',
      height: 40,
      width: 60,
    },
  ];


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
    categories: [],
    sans_sulfites_: [],
    petit_prix: [],
    haut_de_gamme: [],
  });

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsInitialRender(false);
    }, 800);

    window.scrollTo(0, 0);

    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
    };

    resetScroll();

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

    window.addEventListener('load', resetScroll);

    return () => {
      window.removeEventListener('load', resetScroll);
      clearTimeout(resetScrollTimeout);
      clearTimeout(loadingTimeout);
    };
  }, []);

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
      categories: [],
      sans_sulfites_: [],
      petit_prix: [],
      haut_de_gamme: [],
    });
  };

  if (isInitialRender) {
    return (
      <div
        className="fixed inset-0 bg-gray-200 flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <div className="w-16 h-16 bg-gray-200 rounded-full">
          <div className="animate-ping w-16 h-16 bg-primary rounded-full font-gray-950 flex items-center justify-center text-center">
            <Image
              src="/images/meme-pas-contente.png"
              alt="Mémé Georgette"
              width={65}
              height={65}
              className='rounded-full mt-2'
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 mt-2">
        <aside
          className={`w-64 bg-gray-200 border-r border-gray-200 ${
            isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : 'relative'
          } ${isMobile ? '-translate-x-full' : 'translate-x-0'}`}
        >
          <div
            ref={filterContentRef}
            className="p-4 h-full overflow-y-auto scroll-container ml-20 pt-8"
            style={{
              overscrollBehavior: 'auto',
              msOverflowStyle: 'auto',
              scrollbarWidth: 'auto',
              maxHeight: '100vh',
              maxWidth: '15.6rem',
              scrollbarColor: 'rgba(209, 213, 219, 0.5) rgba(209, 213, 219, 0.1)',
              scrollPaddingBlockStart: '1rem',
              scrollMarginLeft: '1rem'
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
          className="flex-1 bg-white overflow-y-auto overflow-x-hidden"
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
                <div>
                  <h2 className='mt-4 text-lg text-center font-black text-gray-600'>Achetez vos vins bio et biodynamiques en ligne</h2>
                  <h3 className='text-center text-gray-400 -mt-1 -mb-4'>Vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites</h3>
                  <div className='flex justify-center mx-auto mt-6 -mb-4'>
                    <Image
                      src="/images/paiement.png"
                      alt="Paiement sécurisé"
                      width={110}
                      height={110}
                      className="object-contain"
                      sizes='(max-width: 640px) 100px, 110px'

                    />
                  </div>
                </div>
                {productsLoaded && (
                  <ProductsCards
                    selectedFilters={selectedFilters}
                    onAddToCart={(product) => console.log('Add to cart:', product)}
                  />
                )}
              </section>
            </div>
            <br />
            <div className="payment-logos-container -mb-4">
              <div className="flex justify-center items-center space-x-6 w-fit h-auto mx-auto mb-8 bg-white rounded-lg p-4 border border-gray-100">
                {paymentMethods.map((method) => (
                  <a
                    key={method.name}
                    href={method.href}
                    title={method.name}
                    aria-label={method.name}
                    className="transform transition-transform duration-200 hover:scale-110 opacity-80 hover:opacity-100"
                  >
                    <Image
                      src={method.src}
                      alt={method.name}
                      height={method.height}
                      width={method.width}
                      className="object-contain"
                    />
                  </a>
                ))}
                <div className="flex items-center text-gray-600 ml-2 pl-2 border-l border-gray-200">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Paiement sécurisé</span>
                </div>
              </div>
            </div>
            <Livraison />
            <div className="py-4" />
            <WineCategories />
            <Trust />
            <BioWineDescription />
            <Slogan />
            <div className="py-8" />
            <div className='flex mx-auto justify-center'>
              <Socialshare url="https://vinsmemegeorgette.com" title="VINS Mémé Georgette - ACHAT VINS BIO et BIODYNAMIQUE" />
            </div>
            <br />
            <GoToFooter />
            <BackToTop />
          </div>
        </main>

        <footer ref={footerRef}>
        </footer>
      </div>

    </>
  );
}
