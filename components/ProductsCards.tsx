'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  categories: { id: number; name: string }[];
  price: number;
  date_added: string;
  images: { src: string }[];
  millesime?: string;
  certification?: string;
  region__pays?: string;
  volume: string;
  style?: string;
  accord_mets?: string[];
}

interface ProductsCardsProps {
  selectedFilters: {
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    volume: string[];
    accord_mets: string[];
    region__pays: string[];
  };
}

const ProductsCards: React.FC<ProductsCardsProps> = ({ selectedFilters }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("La réponse de l'API n'est pas un tableau", response.data);
          setError('Erreur lors de la récupération des produits. Veuillez réessayer.');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des produits', err);
        setError('Erreur lors de la récupération des produits. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = useCallback((product: Product) => {
    const isColorMatch = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.categories[0]?.name || '');
    const isVintageMatch = selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.millesime || '');
    const isRegionMatch = selectedFilters.region.length === 0 || selectedFilters.region.some(region =>
      region.toLowerCase().trim() === (product.region__pays || '').toLowerCase().trim()
    );
    const isCertificationMatch = selectedFilters.certification.length === 0 || selectedFilters.certification.some(certification =>
      certification.toLowerCase().trim() === (product.certification || '').toLowerCase().trim()
    );
    const isStyleMatch = selectedFilters.style.length === 0 || selectedFilters.style.some(style =>
      style.toLowerCase().trim() === (product.style || '').toLowerCase().trim()
    );
    const isVolumeMatch = selectedFilters.volume.length === 0 || selectedFilters.volume.some(volume =>
      volume.toLowerCase().trim() === (product.volume || '').toLowerCase().trim()
    );
    const isAccordMetsMatch = selectedFilters.accord_mets.length === 0 || selectedFilters.accord_mets.some(accordMets =>
      (product.accord_mets || []).some(met => met.toLowerCase().trim() === accordMets.toLowerCase().trim())
    );

    return isColorMatch && isRegionMatch && isVintageMatch && isCertificationMatch && isStyleMatch && isVolumeMatch && isAccordMetsMatch;
  }, [selectedFilters]);

  const filteredProducts = useMemo(() => products.filter(filterProducts), [products, filterProducts]);

  const loadMoreProducts = () => {
    setVisibleCount(prevCount => prevCount + 12);
  };

  return (
    <div className="flex-1 px-4 lg:px-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
            <p className="font-semibold">Chargement des vins...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-600 p-4 text-center">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center p-4">Aucun produit trouvé.</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, visibleCount).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(productId, quantity) => {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      console.log(`Produit ${productId} ajouté au panier avec quantité ${quantity}`);
                      resolve();
                    }, 1000);
                  });
                }}
              />
            ))}
          </div>

          {filteredProducts.length > visibleCount && (
            <div className="flex justify-center py-6">
              <button
                onClick={loadMoreProducts}
                className="bg-primary text-white py-2 px-6 rounded-full hover:bg-orange-700 transition-colors duration-200"
              >
                Voir Plus de Vins
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsCards;
