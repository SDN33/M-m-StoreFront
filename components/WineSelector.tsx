'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, Sun, Droplet, Award } from 'lucide-react';

const WineSelector = () => {
  const [hoveredWine, setHoveredWine] = useState<string | null>(null);

  const wines = [
    {
      color: 'rouge',
      name: 'Rouges',
      gradient: 'from-red-500 to-rose-600',
      hoverGradient: 'hover:from-red-500 hover:to-rose-600',
      path: '/products/category/rouge',
      slogan: 'Parfait pour les amateurs de viandes rouges et barbecues',
      icon: Wine
    },
    {
      color: 'blanc',
      name: 'Blancs',
      gradient: 'from-amber-400 to-yellow-600',
      hoverGradient: 'hover:from-amber-400 hover:to-yellow-600',
      path: '/products/category/blanc',
      slogan: 'Idéal avec des fruits de mer et des plats légers',
      icon: Sun
    },
    {
      color: 'rose',
      name: 'Rosés',
      gradient: 'from-pink-400 to-pink-600',
      hoverGradient: 'hover:from-pink-400 hover:to-pink-600',
      path: '/products/category/rose',
      slogan: 'Le compagnon idéal pour vos pique-niques',
      icon: Droplet
    },
    {
      color: 'petillant',
      name: 'Pétillants',
      gradient: 'from-teal-500 to-teal-700',
      hoverGradient: 'hover:from-teal-500 hover:to-teal-700',
      path: '/products/category/petillant',
      slogan: 'Pour célébrer chaque instant',
      icon: Sparkles
    },
    {
      color: 'liquoreux',
      name: 'Liquoreux',
      gradient: 'from-amber-600 to-amber-800',
      hoverGradient: 'hover:from-amber-600 hover:to-amber-800',
      path: '/products/category/liquoreux',
      slogan: 'Un délice pour accompagner vos desserts',
      icon: Award
    }
  ];

  const WineBubble = ({ wine, isHovered }: { wine: typeof wines[0], isHovered: boolean }) => {
    const Icon = wine.icon;
    return (
      <motion.div
        className={`
          flex items-center gap-3 px-6 py-3 rounded-full cursor-pointer
          transition-all duration-300 transform hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl border border-white
          ${isHovered ? `bg-gradient-to-r ${wine.gradient} text-white` : `bg-gray-50 hover:bg-gradient-to-r ${wine.hoverGradient} hover:text-white`}
        `}
        initial={false}
        animate={{
          y: isHovered ? -4 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <motion.div
          className="transition-transform duration-300"
          animate={{
            rotate: isHovered ? 12 : 0
          }}
        >
          <Icon size={20} className="w-5 h-5" />
        </motion.div>

        <span className="text-sm font-bold tracking-wide">{wine.name}</span>

        {isHovered && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        )}
      </motion.div>
    );
  };

  const getSlogan = () => {
    const hoveredWineInfo = wines.find(w => w.color === hoveredWine);
    return hoveredWineInfo ? hoveredWineInfo.slogan : "Rouges, Blancs, Rosés... on a le vin bio pour vous !";
  };

  return (
    <div className="relative max-w-4xl mx-auto py-8 px-4 mb-4 -mt-10 bg-transparent">
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {wines.map((wine) => (
          <Link
            href={wine.path}
            key={wine.color}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-full"
            onMouseEnter={() => setHoveredWine(wine.color)}
            onMouseLeave={() => setHoveredWine(null)}
          >
            <WineBubble
              wine={wine}
              isHovered={hoveredWine === wine.color}
            />
          </Link>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredWine || 'default'}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut"
          }}
          className="mt-8 text-center"
        >
          <h2 className="text-base sm:text-xl font-serif">
            <strong>{getSlogan()}</strong>
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 opacity-5">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-5">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-300 to-green-300 blur-3xl"></div>
      </div>
    </div>
  );
};

export default WineSelector;
