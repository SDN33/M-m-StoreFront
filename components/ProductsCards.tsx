import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ProductFilter from '@/components/ProductFilters';
import FilterTop from './Filtertop';

// Définir le type pour un produit
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: { src: string }[];
  vendor: string;
  millésime: string;
  category: string;
  region: string;
  rating: number;
  certification: string;
  date_added: string;
  volume: string;
  grape_varieties: string[];
  food_pairing: string;
  conservation: string;
  comments: string;
}

const ProductsCards: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>(''); // État pour gérer le tri
  const [products, setProducts] = useState<Product[]>([]); // État pour les produits
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // État d'erreur
  const [selectedFilters, setSelectedFilters] = useState({
    color: [] as string[],
    region: [] as string[],
    vintage: [] as string[],
    certification: [] as string[],
    style: [] as string[],
    price: [] as string[],
    volume: [] as string[],
  });

  // Fonction pour récupérer les produits via l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products'); // Appel à l'API interne
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors de la récupération des produits');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrage des produits en fonction des filtres sélectionnés
  const filterProducts = (product: Product) => {
    return (
      (selectedFilters.color.length === 0 || selectedFilters.color.includes(product.category)) &&
      (selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region)) &&
      (selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.millésime)) &&
      (selectedFilters.certification.length === 0 || selectedFilters.certification.includes(product.certification))
    );
  };

  const filteredProducts = products.filter(filterProducts);

  // Tri des produits
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

  // Gérer le tri
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  // Gérer les changements de filtre
  const handleCheckboxChange = (filterType: string, selectedOptions: string[]) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedOptions,
    }));
  };

  // Réinitialiser les filtres
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
      {/* Composant FilterTop pour le tri et réinitialisation des filtres */}
      <FilterTop sortBy={sortBy} handleSortChange={handleSortChange} resetFilters={resetFilters} />

      <div className="flex flex-col md:flex-row mt-4">
        {/* Composant ProductFilter pour appliquer les filtres */}
        <div className="hidden md:block md:w-1/4">
          <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
        </div>

        {/* Affichage des produits */}
        <div className="flex-grow">
          {loading && <p className="text-orange-500 font-light sloganhero"><br /><br />Chargement des produits...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4 lg:px-6">
            {sortedProducts.map(product => (
              <div key={product.id} className="border p-4 rounded-md shadow-lg">
                <Image
                  src={product.images.length > 0 ? product.images[0].src : '/noimage.png'}
                  alt={product.name}
                  width={200}
                  height={100}
                  className="w-[100px] h-[200px] object-contain flex items-center justify-center mx-auto my-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-xl font-bold">{product.price} €</p>
                <br />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors w-full">
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
