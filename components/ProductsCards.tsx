import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Star } from 'lucide-react';
import ProductFilter from '@/components/ProductFilters';
import FilterTop from './Filtertop';

interface Product {
  id: number;
  name: string;
  categories: { id: number; name: string }[];
  price: number;
  rating: number;
  date_added: string;
  images: { src: string }[];
  millesime?: string;
  certification?: string;
  region?: string;
  brandname?: string; // Assurez-vous que cette propriété existe
  meta_data?: { id: number; key: string; value: string }[];
}

const getCategoryColor = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'rouge':
      return 'bg-red-800'; // Rouge
    case 'blanc':
      return 'bg-yellow-500'; // Blanc
    case 'rosé':
      return 'bg-pink-400'; // Rosé
    case 'pétillant':
      return 'bg-blue-400'; // Pétillant
    case 'liquoreux':
      return 'bg-purple-400'; // Liquoreux
    default:
      return 'bg-orange-500'; // Couleur par défaut
  }
};

const ProductsCards: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    price: string[];
    volume: string[];
  }>({
    color: [],
    region: [],
    vintage: [],
    certification: [],
    style: [],
    price: [],
    volume: [],
  });

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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (product: Product) => {
    const isPriceMatch = (selectedFilters.price.length === 0 || selectedFilters.price.some(range => {
      const [min, max] = range.split('-').map(Number);
      return product.price >= min && product.price <= max;
    }));

    const isColorMatch = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.categories[0]?.name || '');
    const isRegionMatch = selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region || '');
    const isVintageMatch = selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.millesime || '');
    const isCertificationMatch = selectedFilters.certification.length === 0 || selectedFilters.certification.includes(product.certification || '');

    return isPriceMatch && isColorMatch && isRegionMatch && isVintageMatch && isCertificationMatch;
  };

  const filteredProducts = useMemo(() => products.filter(filterProducts), [products, selectedFilters]);

  const sortProducts = (products: Product[], sortBy: string) => {
    switch (sortBy) {
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);
      case 'rating':
        return products.sort((a, b) => b.rating - a.rating);
      case 'date-added':
        return products.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
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
      color: [],
      region: [],
      vintage: [],
      certification: [],
      style: [],
      price: [],
      volume: [],
    });
    setSortBy('');
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
              <div className="loader"></div> {/* Animation de chargement */}
              <p className="text-orange-600 font-bold text-lg">
                Chargement des vins de Mémé...
              </p>
            </div>
          )}
          {sortedProducts.length === 0 && !loading && <p>Aucun produit trouvé.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4 lg:px-6">
            {sortedProducts.map(product => (
              <div
                key={product.id}
                className="border rounded-lg shadow-md p-4 flex flex-col"
                style={{ height: '400px', width: '100%' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex space-x-1">
                    {product.certification && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">{product.certification}</span>
                      </div>
                    )}
                    {product.categories.map(category => (
                      <div key={category.id} className={`w-6 h-6 rounded-full ${getCategoryColor(category.name)} flex items-center justify-center`}>
                        <span className="text-white border-black font-semibold sloganhero text-xs">{category.name.substring(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                  <span className="flex flex-col">
                    <span className="text-3xl font-bold">{Math.floor(product.price)}<span className="text-sm">,{(product.price % 1).toFixed(2).substring(2)} €</span></span>
                  </span>
                </div>

                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.images.length > 0 ? product.images[0].src : '/noimage.png'}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    priority // Ajout de l'attribut priority
                    className="rounded" // Ajout d'une classe pour arrondir les coins si nécessaire
                  />
                  <div className="absolute top-0 right-0">
                    <Image
                      src="/api/placeholder/40/40"
                      alt="Winemaker"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </div>

                {product.categories.length > 0 && (
                  <p className="text-sm">{product.brandname || "Château inconnu"}  |  {product.categories[0].name}  |  {product.millesime} </p>
                )}
                <h3 className="text-lg font-bold mb-1 text-black">{product.name}</h3>

                <div className="flex items-center mb-2 mx-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">12 avis</span>
                </div>

                <p className="text-sm mb-2">{product.region}</p>

                <button className="mt-auto bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 max-w-fit mx-auto">
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCards;
