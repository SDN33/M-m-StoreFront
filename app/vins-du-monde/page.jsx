'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../../components/ProductCard';
import Livraison from '@/components/Livraison';
import HeroBanner from '@/components/HeroBanner';
import Trust from '@/components/Trust';
import FallingFlagsPromo from '@/components/FallingFlagsMonde';

export default function VinsDuMonde() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paysVinsMonde = useMemo(() => ['espagne', 'italie', 'portugal', 'allemagne'], []);


  const handleAddToCart = async (productId, quantity, variationId) => {
    console.log('Product added to cart:', { productId, quantity, variationId });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const allProducts = await response.json();

        const vinsMonde = allProducts.filter((product) =>
          paysVinsMonde.includes(product.region__pays?.toLowerCase())
        );

        setProducts(vinsMonde);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [paysVinsMonde]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg">Erreur de chargement des produits</div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 mt-44 xl:px-40">
        <div className='text-center text-xs mx-auto text-gray-950 mb-4'><a href="/">Accueil</a> / <strong>Les Autres Vins</strong></div>

        {/* Section Titre */}
        <FallingFlagsPromo />

        {/* Section Description */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-12">
          <p className="text-lg font-medium text-center text-gray-700">
            Découvrez notre sélection de vins du monde entier
            <br />
            <span className="font-bold text-teal-800 text-sm">
              Une collection unique de vins d&apos;Espagne, d&apos;Italie, du Portugal et d&apos;Allemagne.
            </span>
          </p>
        </div>

        {/* Grille de Produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 mb-20">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-600">Aucuns vins disponible pour le moment</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))
          )}
        </div>

        <HeroBanner />
        <Livraison />
        <br />
        <Trust />
        <br />
      </main>
    </div>
  );
}
