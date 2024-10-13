import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ProductFilter from '@/components/ProductFilters';
import FilterTop from './Filtertop';

interface Product {
  id: number;
  name: string;
  categories: { id: number; name: string }[]; // Catégories du produit
  price: number;
  rating: number;
  date_added: string;
  images: { src: string }[];
  millésime?: string;
  certification?: string;
  region?: string;
}

const ProductsCards: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    color: [] as string[],
    region: [] as string[],
    vintage: [] as string[],
    certification: [] as string[],
    style: [] as string[],
    price: [] as string[],
    volume: [] as string[],
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
    return (
      (selectedFilters.color.length === 0 || selectedFilters.color.includes(product.categories[0]?.name || '')) &&
      (selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region || '')) &&
      (selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.millésime || '')) &&
      (selectedFilters.certification.length === 0 || selectedFilters.certification.includes(product.certification || ''))
    );
  };

  const filteredProducts = products.filter(filterProducts);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'date-added':
        return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
      default:
        return 0;
    }
  });

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
    <div className="flex flex-col mr-4 lg:mr-10 md:-mt-8">
      <FilterTop sortBy={sortBy} handleSortChange={handleSortChange} resetFilters={resetFilters} />

      <div className="flex flex-col md:flex-row mt-4">
        <div className="hidden md:block md:w-1/4">
          <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
        </div>

        <div className="flex-grow">
          {loading && <p className="text-orange-500 font-light sloganhero"><br /><br />Chargement des produits...</p>}
          {sortedProducts.length === 0 && !loading && <p>Aucun produit trouvé.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4 lg:px-6">
            {sortedProducts.map(product => (
              <div
                key={product.id}
                className="border p-4 rounded-md shadow-lg flex flex-col items-center"
                style={{ height: '400px', width: '100%' }} // Taille fixe de la carte
              >
                <div className="relative w-full h-64 flex items-center justify-center">
                  <Image
                    src={product.images.length > 0 ? product.images[0].src : '/noimage.png'}
                    alt={product.name}
                    width={100}
                    height={300}
                    className="object-contain"
                    style={{ maxHeight: '100%', maxWidth: '100%' }} // Taille des images
                  />
                </div>

                {/* Titre et catégorie sur la même ligne avec un séparateur */}
                <h3 className="text-lg font-semibold mt-4 flex justify-center items-center">
                  {product.name}
                  {product.categories.length > 0 && (
                    <>
                      <span className="mx-2 text-orange-500">|</span> {/* Séparateur stylisé */}
                      <span className="font-light text-lg">{product.categories[0].name}</span>
                    </>
                  )}
                </h3>

                <p className="text-xl font-bold">{product.price} €</p>
                <br />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors w-fit font-bold">
                  Commander
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
