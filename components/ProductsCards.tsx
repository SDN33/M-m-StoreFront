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

const getCategoryColor = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'rouge':
      return 'bg-red-800';
    case 'blanc':
      return 'bg-yellow-500';
    case 'rosé':
      return 'bg-pink-400';
    case 'pétillant':
      return 'bg-blue-400';
    case 'liquoreux':
      return 'bg-purple-400';
    default:
      return 'bg-orange-500';
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
    const isColorMatch = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.categories[0]?.name || '');
    const isRegionMatch = selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region__pays || '');
    const isVintageMatch = selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.millesime || '');
    const isCertificationMatch = selectedFilters.certification.length === 0 || selectedFilters.certification.includes(product.certification || '');

    return isColorMatch && isRegionMatch && isVintageMatch && isCertificationMatch;
  };

  const filteredProducts = useMemo(() => products.filter(filterProducts), [products, selectedFilters]);

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

  const getCertificationLogo = (certification: string) => {
    switch (certification.toLowerCase()) {
      case 'bio':
        return "/images/logobio.webp";
      case 'demeter':
        return "/images/biodemeter.png";
      case 'biodynamie':
        return "/images/biodemeter.png";
      case 'en conversion':
        return '/images/enconv.png';
      default:
        return '';
    }
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
                style={{ height: '400px', width: '100%' }} // Taille de la carte
              >
                {/* Bande de couleur ajoutée */}
                <div className={`h-2 ${getCategoryColor(product.categories[0]?.name || 'default')} mb-4`}></div>

                <div className="flex justify-between items-start mb-2">
                  <div className="flex space-x-1">
                    {product.categories.map(category => (
                      <div key={category.id} className={`w-7 h-7 rounded-full ${getCategoryColor(category.name)} flex items-center justify-center`}>
                        <span className="text-white border-black font-semibold sloganhero text-xs">{category.name.substring(0, 3)}</span>
                      </div>
                    ))}

                    {product.certification && (
                      <div className="flex items-center justify-center">
                        <Image
                          src={getCertificationLogo(product.certification)}
                          alt={product.certification}
                          width={28} // Taille de l'image pour la certification
                          height={28} // Taille de l'image pour la certification
                        />
                      </div>
                    )}
                  </div>
                  <span className="flex items-start">
                    <span className="text-4xl font-bold">{Math.floor(product.price)}</span>
                    <span className="text-xl font-bold align-top mt-1">
                      <sup>€{(product.price % 1).toFixed(2).substring(2)}</sup>
                    </span>
                  </span>
                </div>

                <div className="relative w-full h-72 mb-4"> {/* Hauteur de l'image */}
                  <Image
                    src={product.images.length > 0 ? product.images[0].src : '/images/vinmémé.png'}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                  <div className="absolute top-14 right-3">
                    <Image
                      src={product.vendor?.vendorPhotoUrl || '/images/mémé-georgette1.png'}
                      alt="Vigneron"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="text-sm !font-bold sloganhero flex items-end">
                      {product.store_name && (
                        <>
                          {product.store_name.split(' ')[0]} <br />
                          {product.store_name.split(' ').slice(1).join(' ')}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm font-extralight">
                  <strong>{product.nom_chateau || "Château inconnu"}</strong>
                </p>
                <h3 className="text-lg font-bold mb-1 text-black">{product.name}</h3>
                <p className="text-sm mb-1">
                  <strong>{product.appelation?.toUpperCase() || 'Vigneron inconnu'}</strong>
                </p>
                <p className="text-sm mb-1">
                  {product.millesime} | {product.region__pays?.toUpperCase()} | {product.volume}
                </p>
                <div className="flex items-center">
                  {product.rating != null && typeof product.rating === 'number' && (
                    <>
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold">{product.rating.toFixed(1)}</span>
                      <span className="text-sm font-light">({product.rating_count} avis)</span>
                    </>
                  )}
                </div>
                <button className="mt-2 bg-orange-600 text-white !px-4 !py-2 rounded-lg hover:bg-orange-800 transition-colors !w-fit !mx-auto !font-medium text-sm sloganhero">
                  COMMANDER
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
