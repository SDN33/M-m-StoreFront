'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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
import WineAssistant from './WineAssistant';

interface DesktopHomeProps {
  className?: string;
}

export default function Home({ className }: DesktopHomeProps) {
  const [isMobile] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainContentRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    mass: 0.5
  });

  const paymentMethods = useMemo(() => [
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
  ], []);

  const [selectedFilters, setSelectedFilters] = useState(() => ({
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
    prestige: [],
  }));

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsInitialRender(false);
    }, 800);

    const resetScroll = () => {
      if (mainContentRef.current) {
        requestAnimationFrame(() => {
          mainContentRef.current!.scrollTop = 0;
        });
      }
    };

    const resetScrollTimeout = setTimeout(resetScroll, 100);

    const fetchProducts = async () => {
      try {
        const cachedProducts = localStorage.getItem('cachedProducts');
        const cacheTimestamp = localStorage.getItem('productsTimestamp');
        const now = Date.now();
        const cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;
        const CACHE_DURATION = 24 * 60 * 60 * 1000;

        if (cachedProducts && cacheAge < CACHE_DURATION) {
          setProductsLoaded(true);
          return;
        }

        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          localStorage.setItem('cachedProducts', JSON.stringify(products));
          localStorage.setItem('productsTimestamp', now.toString());
          setProductsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProductsLoaded(true);
      }
    };

    fetchProducts();

    return () => {
      clearTimeout(resetScrollTimeout);
      clearTimeout(loadingTimeout);
    };
  }, []);

  const handleFilterChange = useMemo(() =>
    (category: keyof typeof selectedFilters, filters: string[]) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [category]: filters
      }));
    },
  []);

  const resetAllFilters = useMemo(() =>
    () => {
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
        prestige: [],
      });
    },
  []);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
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
              priority
              className='rounded-full mt-2'
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-1 mt-2 ${className}`}
    >
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
            scrollMarginLeft: '1rem',
            willChange: 'transform'
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
        className="flex-1 bg-gray-50 overflow-y-auto overflow-x-hidden"
        style={{
          overscrollBehavior: 'contain',
          height: '100vh',
          willChange: 'transform'
        }}
      >
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <div className="pt-24 md:hidden lg:flex" />
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <ProductsIntro />
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Slider />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 min-h-[500px] min-w-[320px]">
              <motion.section
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow"
              >
                <div>
                  <h2 className='mt-4 pt-2 text-lg text-center font-black text-gray-600'>Achetez vos vins bio et biodynamiques en ligne</h2>
                  <h3 className='text-center text-gray-600 -mt-1 -mb-4'>Vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites</h3>
                  <div className='flex justify-center mx-auto mt-5 -mb-6'>
                    <Image
                      src="/images/paiement.png"
                      alt="Paiement sécurisé"
                      width={100}
                      height={100}
                      className='w-20 h-auto'
                      priority
                    />
                  </div>
                </div>
                {productsLoaded && (
                  <ProductsCards
                    selectedFilters={selectedFilters}
                    onAddToCart={(product) => console.log('Add to cart:', product)}
                  />
                )}
              </motion.section>
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
                <div className='flex justify-center mx-auto mb-10'>
                    <div className="mt-10">
                    {typeof window !== 'undefined' && (
                      <iframe
                      title="Facebook Page Plugin"
                      className="bg-transparent border-0 overflow-hidden"
                      src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmemegeorgette&tabs&width=340&height=70&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId"
                      width="280"
                      height="70"
                      loading="lazy"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      />
                    )}
                    </div>
                </div>
              </div>
            </div>
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Livraison />
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Trust />
            </motion.div>

            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <WineCategories />
            </motion.div>
            <Slogan />
            <br /><br />
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <BioWineDescription />
            </motion.div>
            <div className='flex mx-auto justify-center'>
              <Socialshare url="https://vinsmemegeorgette.com" title="VINS Mémé Georgette - ACHAT VINS BIO et BIODYNAMIQUE" />
            </div>
            <br />
            <GoToFooter />
          </div>
        </motion.div>
      </main>

      <BackToTop />
      <WineAssistant/>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left"
        style={{ scaleX }}
      />

      <footer ref={footerRef}>
      </footer>
    </motion.div>
  );
}
