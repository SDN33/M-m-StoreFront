'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Livraison from '@/components/Livraison';
import HeroBanner from '@/components/HeroBanner';
import Trust from '@/components/Trust';
import FallingEurosPromo from '@/components/FallingEurosPromo';

export default function ProductsPromotions() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddToCart = (product) => {
    console.log('Product added to cart:', product);
    // Add your add to cart logic here
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const allProducts = await response.json();

        const promoProducts = allProducts.filter(product =>
          product.sale_price !== null &&
          product.sale_price !== undefined &&
          parseFloat(product.sale_price) > 0
        );

        setProducts(promoProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        <div className='text-center text-xs mx-auto text-gray-950 mb-4'><a href="/">Accueil</a> / <strong>Promos de Mémé</strong></div>

        {/* Section Titre */}
        <FallingEurosPromo />

        {/* Section Description */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-12">
          <p className="text-lg font-medium text-center text-gray-700">
            Découvrez nos vins en promotion et profitez de remises exclusives sur une sélection de produits
            <br />
            <span className="font-bold text-primary text-sm">
              Merci Mémé ! Mais dépêchez-vous, les stocks sont limités !
            </span>
          </p>
        </div>

        {/* Grille de Produits */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 mb-20 bg-transparent">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative bg-transparent shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 text-lg mb-20">
            <br /><br />
            Aucuns vins disponible pour le moment
            <br /><br /><br /><br /><br /><br />
          </div>
        )}
        <HeroBanner />
        <Livraison />
        <Trust />
        <br />
      </main>
    </div>
  );
}
