'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../../components/ProductCard';
import Livraison from '@/components/Livraison';
import HeroBanner from '@/components/HeroBanner';
import Trust from '@/components/Trust';
import FallingBottlesPromo from '@/components/FaillingBottlesPromo';

export default function VinsSansSulfites() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Filtre pour les vins sans sulfites
  interface Product {
    id: number;
    tags?: string[];
    name: string;
    price: number;
    sale_price: number;
    regular_price: number;
    images: { src: string }[];
    description: string;
    stock_status: string;
    categories: { id: number; name: string }[];
    vendor: number;
  }

  const [products, setProducts] = useState<Product[]>([]);

  const filterSansSulfites = useMemo(() => (product: Product) => product.tags?.includes('sans sulfites'), []);

  const handleAddToCart = async (productId: number, quantity: number, variationId: number | null) => {
    console.log('Product added to cart:', { productId, quantity, variationId });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const allProducts = await response.json();

        const vinsSansSulfites = allProducts.filter(filterSansSulfites);
        setProducts(vinsSansSulfites);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error instanceof Error ? error : new Error('An error occurred'));
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filterSansSulfites]);

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
      <main className="flex-grow container mx-auto px-4 mt-48 xl:px-40">
        <div className='text-center text-xs mx-auto text-gray-950 mb-4'>
          <a href="/">Accueil</a> / <strong>Vins sans sulfites</strong>
        </div>

        {/* Section Titre */}
        <FallingBottlesPromo />

        {/* Section Description */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-12">
          <p className="text-lg font-medium text-center text-gray-700">
            Explorez notre collection de vins sans sulfites pour une dégustation plus naturelle et authentique.
          </p>
        </div>

        {/* Grille de Produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 mb-20">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-600">Aucun vin sans sulfites disponible pour le moment</p>
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
