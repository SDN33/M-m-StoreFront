import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import ProductFilter from '@/components/ProductFilters';
import FilterTop from './Filtertop';
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
  store_name?: string;
  volume: string;
  vendor?: {
    vendorPhotoUrl?: string;
  };
  appelation?: string;
  nom_chateau?: string;
  rating?: number;
  rating_count?: number;
}

const RougeProductsCards: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    accord_mets: string[];
    region__pays: string[];
    price: string[];
    volume: string[];
  }>({
    color: ['rouge'], // Filtrer uniquement les vins rouges par défaut
    region: [],
    vintage: [],
    certification: [],
    style: [],
    accord_mets: [],
    region__pays: [],
    price: [],
    volume: [],
  });

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
    const isColorMatch = selectedFilters.color.includes('rouge'); // Filtrer uniquement les vins rouges
    const isRegionMatch = selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region__pays || '');
    const isVintageMatch = selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.millesime || '');
    const isCertificationMatch = selectedFilters.certification.length === 0 || selectedFilters.certification.includes(product.certification || '');

    return isColorMatch && isRegionMatch && isVintageMatch && isCertificationMatch;
  }, [selectedFilters]);

  const filteredProducts = useMemo(() => products.filter(filterProducts), [products, filterProducts]);

  const sortProducts = (products: Product[], sortBy: string) => {
    switch (sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'date-added':
        return [...products].sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(filteredProducts, sortBy);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleCheckboxChange = (filterType: string, selectedOptions: string[]) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedOptions,
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      color: ['rouge'], // Réinitialise les filtres à uniquement rouge
      region: [],
      vintage: [],
      certification: [],
      style: [],
      accord_mets: [],
      region__pays: [],
      price: [],
      volume: [],
    });
    setSortBy('');
    setVisibleCount(12);
  };

  const loadMoreProducts = () => {
    setVisibleCount(prevCount => prevCount + 12);
  };

  return (
    <div className="flex flex-col mr-4 lg:mr-16 md:-mt-8">
      <FilterTop sortBy={sortBy} handleSortChange={handleSortChange} resetFilters={resetFilters} />
      <div className="flex flex-col md:flex-row mt-4">
        <div className="hidden md:block md:w-1/4">
          <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
        </div>

        <div className="flex-grow mt-10">
          {loading && (
            <div className="flex flex-col items-center">
              <div className="loader"></div>
              <p className="text-orange-600 font-bold text-lg">Chargement des vins rouges...</p>
            </div>
          )}
          {error && <p className="text-red-600">{error}</p>}
          {sortedProducts.length === 0 && !loading && <p>Aucun vin rouge trouvé.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4 lg:px-6 -mt-10">
            {sortedProducts.slice(0, visibleCount).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {sortedProducts.length > visibleCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMoreProducts}
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                Voir Plus de Vins Rouges
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RougeProductsCards;