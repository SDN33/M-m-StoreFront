'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import Livraison from '@/components/Livraison';
import HeroBanner from '@/components/HeroBanner';
import Trust from '@/components/Trust';




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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-gray-500 text-lg animate-pulse">Chargement des produits...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg">Erreur de chargement des produits</div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen mx-20">
      <main className="flex-grow container mx-auto px-4 mt-40">
        {/* Section Titre */}
        <div className="text-center py-10 bg-black text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold">Les Promos de Mémé Georgette</h2>
        </div>

        {/* Section Description */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-12">
          <p className="text-lg font-medium text-center text-gray-700">
            🍇 Découvrez nos vins en promotion et profitez de remises exclusives !
            <br />
            <span className="font-bold text-teal-800">
              Merci Mémé ! Mais dépêchez-vous, les stocks sont limités.
            </span>
          </p>
        </div>

        {/* Grille de Produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 min-w-fit mb-20">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
        <HeroBanner />
        <Livraison />
        <Trust />
        <br />
      </main>
    </div>
  );
}
