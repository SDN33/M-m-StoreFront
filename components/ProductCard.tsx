"use client"; // Ajoutez cette ligne en haut du fichier

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Utiliser le hook useRouter de next/navigation
import { Star } from 'lucide-react';

// Définition des interfaces pour le produit et les props
interface Product {
  id: number;
  name: string;
  price: number;
  categories: { id: number; name: string }[];
  certification?: string;
  images: { src: string }[];
  vendor?: { vendorPhotoUrl?: string };
  store_name?: string;
  nom_chateau?: string;
  appelation?: string;
  millesime?: string;
  region__pays?: string;
  volume?: string;
  rating_count?: number;
  average_rating?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter(); // Utilisation du routeur pour redirection

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

  const getCertificationLogo = (certification?: string) => {
    switch (certification?.toLowerCase()) {
      case 'bio':
        return "/images/logobio.webp";
      case 'demeter':
      case 'biodynamie':
        return "/images/biodemeter.png";
      case 'en conversion':
        return '/images/enconv.png';
      default:
        return '';
    }
  };

  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  };

  const handleRedirect = () => {
    router.push(`/product/${product.id}`); // Redirection vers la page produit
  };

  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col" style={{ height: '490px', width: '100%' }}>
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
                width={28}
                height={28}
                loading="lazy" // Amélioration de la performance
              />
            </div>
          )}
          <div>
            <div className="text-xs text-orange-600">Millésime</div>
            {product.millesime}
          </div>
        </div>
        <span className="flex items-start">
          <span className="text-4xl font-bold">{Math.floor(product.price)}</span>
          <span className="text-xl font-bold align-top mt-1">
            <sup>€{(product.price % 1).toFixed(2).substring(2)}</sup>
          </span>
        </span>
      </div>

      <div className="relative w-full h-72 mb-4">
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
          <div className="text-sm !font-bold sloganhero flex items-end text-gray-600">
            {product.store_name && (
              <>
                {product.store_name.split(' ')[0]} <br />
                {product.store_name.split(' ').slice(1).join(' ')}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nom du produit avec surlignement et redirection */}
      <h3
        className="text-lg font-bold text-black hover:underline cursor-pointer"
        onClick={handleRedirect}
      >
        {product.name}
      </h3>

      {/* Nom du château avec surlignement et redirection */}
      <p
        className="text-sm font-bold hover:underline cursor-pointer"
        onClick={handleRedirect}
      >
        {product.nom_chateau || "Château inconnu"}
      </p>

      <p className="text-sm mb-1 font-bold">
        {product.appelation?.toUpperCase() || 'Vigneron inconnu'}
      </p>
      <p className="text-sm mb-2">
        {product.region__pays?.toUpperCase()} | {product.volume}
      </p>
      <div className="flex items-center mb-2 mx-auto">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} />
        ))}
        <span className="text-xs text-gray-600 ml-1">({product.rating_count || 0} avis)</span>
      </div>

      <div className="flex-grow"></div>
      <div className="flex items-center mx-auto">
        <div className="relative mr-2">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-orange-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:bg-orange-700 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Commander
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
