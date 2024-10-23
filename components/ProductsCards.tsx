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
        setLoading(true);
        const response = await axios.get('/api/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("La réponse de l'API n'est pas un tableau", response.data);
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
    <div className="flex flex-col mr-4 lg:mr-16 mt-60">
      <div className="flex-grow mt-10">
        {loading && (
          <div className="flex flex-col items-center">
            <div className="loader"></div>
            <p className="text-orange-600 font-bold text-lg animate-bounce">Chargement des vins de Mémé...</p>
          </div>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {filteredProducts.length === 0 && !loading && <p>Aucun produit trouvé.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4 lg:px-6 -mt-10">
          {filteredProducts.slice(0, visibleCount).map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={(productId, quantity, variationId) => {
              // Implement your onAddToCart logic here
              return new Promise((resolve, reject) => {
                // Example: Simulate an API call
                setTimeout(() => {
                  console.log(`Added product ${productId} with quantity ${quantity} and variation ${variationId} to cart`);
                  resolve();
                }, 1000);
              });
            }} />
          ))}
        </div>
        {filteredProducts.length > visibleCount && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMoreProducts}
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-600"
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
