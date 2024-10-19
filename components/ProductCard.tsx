"use client"; // Ajoutez cette ligne en haut du fichier

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

// Définition des interfaces pour le produit et les props
interface Product {
  id: number;
  name: string;
  price: number;
  categories: { id: number; name: string }[];
  certification?: string;
  images: { src: string }[];
  vendor?: { vendorPhotoUrl?: string; name?: string }; // Ajout du nom du vendeur
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
  const router = useRouter();

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
        return { src: "/images/logobio.webp", width: 24, height: 24 };
      case 'demeter':
      case 'biodynamie':
        return { src: "/images/biodemeter.png", width: 80, height: 80 };
      case 'en conversion':
        return { src: '/images/enconv.png', width: 28, height: 28 };
      default:
        return { src: '', width: 0, height: 0 };
    }
  };

  // Fonction pour formater le nom du vendeur
  const formatVendorName = (storeName?: string) => {
    if (!storeName) return '@M.Georgette'; // Si le nom du vendeur est manquant

    const words = storeName.split(' ');
    if (words.length > 1) {
      const firstNameInitial = words[0].charAt(0).toUpperCase();
      const lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1);
      return `${firstNameInitial}. ${lastName}`;
    }
    return storeName; // Si le vendeur a un seul mot pour son nom
  };

  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  };

  const handleRedirect = () => {
    router.push(`/product/${product.id}`);
  };

  const certificationLogo = getCertificationLogo(product.certification);

  return (
    <div
      className="border rounded-lg shadow-md p-4 flex flex-col"
      style={{ height: '490px', width: '100%' }}
    >
      <div className={`h-2 ${getCategoryColor(product.categories[0]?.name || 'default')} mb-4`}></div>

      <div className="flex justify-between items-start z-10">
        <div className="flex space-x-1">
          {product.categories.map(category => (
            <div key={category.id} className={`w-10 h-10 rounded-full ${getCategoryColor(category.name)} flex items-center justify-center`}>
              <span className="text-white border-black font-semibold sloganhero text-sm">{category.name.substring(0, 3)}</span>
            </div>
          ))}
          {product.certification && (
            <div className="flex items-center justify-center z-10">
              <Image
                src={certificationLogo.src}
                alt={product.certification}
                width={certificationLogo.width}
                height={certificationLogo.height}
              />
            </div>
          )}
        </div>
        <span className="flex items-start z-10">
          <span className="text-4xl font-bold">{Math.floor(product.price)}</span>
          <span className="text-xl font-bold align-top mt-1">
            <sup>€{(product.price % 1).toFixed(2).substring(2)}</sup>
          </span>
        </span>
      </div>

      <div className="relative w-full h-72 mb-4">
        <Image
          className="hover:scale-110 transition-transform"
          src={product.images.length > 0 ? product.images[0].src : '/images/vinmémé.png'}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          priority
        />

        {/* Afficher l'image du vendeur et son nom en bas à droite de l'image */}
        <div className="absolute bottom-6 right-2 md:right-6 flex flex-col items-center">
          <div className="relative w-12 h-12 mb-1 hover:scale-110 transition-transform">
            <Image
              src={product.vendor?.vendorPhotoUrl || '/images/mémé-georgette1.png'} // Utilisez l'image par défaut
              alt={formatVendorName(product.store_name)}
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          </div>
          <span className="text-[0.5rem] font-bold text-center text-green-600">
            {formatVendorName(product.store_name)}
          </span>
        </div>
      </div>

      <h3
        className="text-lg font-bold text-black hover:underline cursor-pointer"
        onClick={handleRedirect}
      >
        {product.name}
      </h3>

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
        {product.region__pays?.toUpperCase()} | {product.millesime} | {product.volume}
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
