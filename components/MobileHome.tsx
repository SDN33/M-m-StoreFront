'use client';

import React, { useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import ProductsCards from '@/components/ProductsCards';
import Slogan from '@/components/Slogan';
import WineCategories from '@/components/WineCategories';
import MobileProductFilter from '@/components/MobileProductFilter';
import Trust from '@/components/Trust';
import MobileProductsIntro from './MobileProductIntro';
import PromotionSection from './PromotionSection';
import BioWineDescription from './BioWineDescription';
import Image from 'next/image';
import MobileSlider from './MobileSlider';

const MobileHome: React.FC = () => {
  // Initialize state with a callback to prevent unnecessary re-renders
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
  }));

  // Memoize handlers to prevent unnecessary re-renders
  const handleFilterChange = useMemo(
    () => (filterType: string, values: string[]) => {
      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: values
      }));
    },
    []
  );

  const resetFilters = useMemo(
    () => () => {
      setSelectedFilters({
        color: [], region: [], vintage: [], millesime: [],
        certification: [], style: [], volume: [],
        accord_mets: [], region__pays: [], categories: [],
        sans_sulfites_: [], petit_prix: [], haut_de_gamme: []
      });
    },
    []
  );

  // Common animation variants
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

  // Scroll progress for performance optimization
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    mass: 0.5
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col bg-gray-100 overflow-y-auto overflow-x-hidden"
        style={{ willChange: 'transform' }}
      >
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
          style={{ scaleX }}
        />

        <br /><br /><br /><br />
        <div className="mt-8">
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <PromotionSection />
        </motion.div>

        <div className="mx-auto bg-yellow-50">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Image
              src="/images/post_partage.webp"
              alt="Mémé Georgette"
              width={600}
              height={600}
              className='object-cover flex justify-center mx-auto'
              priority
              loading="eager"
            />
          </motion.div>

          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <MobileProductsIntro />
          </motion.div>

          <div className="w-screen">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <MobileSlider />
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 space-y-6 mt-2">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white w-full justify-center items-center -my-2"
            >
              <div className="flex justify-center items-center space-x-6 w-fit h-auto mx-auto mb-4 bg-white rounded-lg p-4 border border-gray-100">
                <Image
                  src="/images/paiement.png"
                  alt="Paiement sécurisé"
                  height={130}
                  width={130}
                  sizes="130"
                  priority
                />
              </div>
            </motion.div>

            <motion.section
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow"
            >
              <ProductsCards
                selectedFilters={selectedFilters}
                onAddToCart={(product) => console.log('Add to cart:', product)}
              />
            </motion.section>
          </div>

          <br />
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <WineCategories />
          </motion.div>

          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Trust />
          </motion.div>

          <br />
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Slogan />
          </motion.div>

          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <BioWineDescription />
          </motion.div>

          <br /><br />
        </div>
      </div>
    </motion.div>
    <MobileProductFilter
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
      resetFilters={resetFilters}
    />
    </>
  );
};

export default MobileHome;
