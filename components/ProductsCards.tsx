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
  region__pays?: string; // Changement à 'region__pays'
  vendor?: {
    display_name: string; // Ajout de la propriété display_name
    vendorPhotoUrl?: string; // Ajout de la propriété vendorPhotoUrl
  };
  appelation?: string; // Ajout de la propriété appelation
  rating?: number; // Ajout de la propriété rating
  rating_count?: number; // Ajout de la propriété rating_count
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
    const isColorMatch = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.categories[0]?.name || '');
    const isRegionMatch = selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region__pays || ''); // Utiliser region__pays
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
        return "/images/logobio.webp"; // Image pour certification bio
      case 'demeter':
        return "/images/demeter-logo.png"; // Image pour certification Demeter
      case 'biodynamie':
        return "/images/demeter-logo.png"; // Optionnel : si biodynamie est géré comme Demeter
      case 'en conversion':
        return '/images/enconv.png'; // Image pour certification en conversion
      default:
        return ''; // Pas d'image pour les autres certifications
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
                      <div className="w-7 h-7 rounded-full flex items-center justify-center">
                        <Image
                          src={getCertificationLogo(product.certification)}
                          alt={product.certification}
                          width={28}
                          height={28}

                        />
                      </div>
                    )}
                    {product.categories.map(category => (
                      <div key={category.id} className={`w-7 h-7 rounded-full ${getCategoryColor(category.name)} flex items-center justify-center`}>
                        <span className="text-white border-black font-semibold sloganhero text-xs">{category.name.substring(0, 3)}</span>
                      </div>
                    ))}
                    <div className='text-sm ml-1 font-semibold'> {product.region__pays?.toUpperCase() || 'Région inconnue'} </div>
                  </div>
                  <span className="flex flex-col">
                    <span className="text-3xl font-bold">{Math.floor(product.price)}<span className="text-sm">,{(product.price % 1).toFixed(2).substring(2)} €</span></span>
                  </span>
                </div>

                <div className="relative w-full h-72 mb-4"> {/* Augmenter la hauteur de l'image */}
                  <Image
                    src={product.images.length > 0 ? product.images[0].src : '/images/vinmémé.png'} // Image par défaut si pas d'image produit
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    priority // Ajout de l'attribut priority
                  />
                  <div className="absolute top-0 right-0">
                    <Image
                      src={product.vendor?.vendorPhotoUrl || '/images/noimage.jpg'} // Image par défaut si pas de photo du vendeur
                      alt="Vigneron"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </div>


                <p className="text-sm mb-1 font-extralight">
                  <strong>{product.name || "Château inconnu"}</strong>
                </p>
                <h3 className="text-lg font-bold mb-1 text-black">{product.name}</h3>
                <p className="text-sm mb-1">
                  <strong>{product.appelation?.toUpperCase() || 'Vigneron inconnu'}</strong>
                </p>
                <p className="text-sm mb-2">{product.millesime}</p>

                <div className="flex items-center mb-2 mx-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({product.rating_count || 0} avis)</span> {/* Affichage du nombre d'avis */}
                </div>


              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCards;
