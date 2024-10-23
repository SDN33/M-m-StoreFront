'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  categories: { id: number; name: string }[]; // Assurez-vous que chaque produit a une catégorie valide
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
    <div className="flex mr-4 lg:mr-16 mt-60">
      <div className="flex-grow mt-10">
        {loading && (
          <div className="flex justify-center mx-auto font-semibold">
            <p>Chargement des vins...</p>
          </div>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && filteredProducts.length === 0 && <p>Aucun produit trouvé.</p>}

        {/* Render the product cards only when loading is false */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4 lg:px-6">
            {filteredProducts.slice(0, visibleCount).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(productId, quantity) => {
                  // Implémentation logique pour ajouter au panier
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
        )}

        {filteredProducts.length > visibleCount && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMoreProducts}
              className="bg-primary text-white py-2 px-4 rounded hover:bg-orange-700"
            >
              Voir Plus de Vins
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsCards;
