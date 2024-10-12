import React, { useState } from 'react';
import ProductFilter from '@/components/ProductFilters';
import Image from 'next/image';

// Définir le type pour un produit
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: { src: string }[];
  supplier: string; // Nom du fournisseur
  vintage: string; // Millésime
  color: string; // Couleur du vin
  region: string; // Région du vin
  rating: number; // Note du produit
  certification: string; // Certification du vin
  date_added: string; // Date d'ajout du produit
  volume: string; // Volume du vin
}

const ProductsCards: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>(''); // État pour gérer le tri
  const [products] = useState<Product[]>([]); // État pour les produits
  const [selectedFilters, setSelectedFilters] = useState({
    color: [] as string[],
    region: [] as string[],
    vintage: [] as string[],
    certification: [] as string[],
    style: [] as string[],
    price: [] as string[],
    volume: [] as string[], // Ajout
  });
  const [loading] = useState(true); // État de chargement
  const [error] = useState<string | null>(null); // État d'erreur



  // Filtrage des produits
  const filterProducts = (product: Product) => {
    return (
      (selectedFilters.color.length === 0 || selectedFilters.color.includes(product.color)) &&
      (selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region)) &&
      (selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.vintage)) &&
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
      volume: [], // Ajout
    });
    setSortBy('');
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="block md:hidden mb-4">
        <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
      </div>

      <div className="hidden md:block">
        <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
      </div>

      <div className="flex-grow">
        <div className="flex flex-col items-center mb-4 sm:flex-row sm:justify-center md:justify-end mr-4">
          <label className="mr-6 font-bold text-gray-600">+ de 120 vignerons</label>
          <span className="mr-6 font-bold text-orange-500">|</span>
          <label className="mr-6 font-bold text-gray-600">+ de 1000 vins</label>
          <span className="mr-6 font-bold text-orange-500">|</span>
          <label htmlFor="sortBySelect" className="mr-6 font-bold text-gray-600">Trier par :</label>

          <select
            id="sortBySelect"
            value={sortBy}
            onChange={handleSortChange}
            className="border rounded px-2 py-1"
            aria-label="Trier les produits par"
          >
            <option value="">Choisir une option</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Note</option>
            <option value="date-added">Date d&apos;ajout</option>
          </select>

          <button onClick={resetFilters} className="ml-4 bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded transition duration-300">
            Réinitialiser les filtres
          </button>
        </div>

        {loading && <p className="text-blue-500">Chargement des produits...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map(product => (
            <div key={product.id} className="border p-4 rounded-md shadow-lg">
              <Image
                src={product.images.length > 0 ? product.images[0].src : '/noimage.png'}
                alt={product.title}
                width={300}
                height={200}
                className="w-20 h-auto object-fill flex items-center justify-center mx-auto my-4"
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-500">{product.description}</p>
              <p className="text-xl font-bold">{product.price} €</p>
              <p className="text-sm text-gray-400">Note : {product.rating}</p>
              <p className="text-sm text-gray-400">Certifié : {product.certification}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsCards;
