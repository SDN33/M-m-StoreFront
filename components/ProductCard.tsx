// components/ProductCard.tsx
import React from 'react';
import Image from 'next/image'; // Assure-toi d'importer le composant Image de Next.js
import { Star } from 'lucide-react'; // Assure-toi d'avoir installé lucide-react pour les icônes

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
  rating?: number;
  rating_count?: number;
}

interface ProductCardProps {
  product: Product;
}


const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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


  const getCertificationLogo = (certification: string) => {
    // Remplace par ta logique pour obtenir le logo de certification
    const logos: { [key: string]: string } = {
      bio: '/images/logobio.webp',
      demeter: '/images/biodemeter.png',
      // Ajoute d'autres certifications si nécessaire
    };
    return logos[certification] || '/logos/default.png';
  };

  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col" style={{ height: '460px', width: '100%' }}>
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
                width={28}
                height={28}
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
      <h3 className="text-lg font-bold text-black">{product.name}</h3>
      <p className="text-sm font-bold">
        {product.nom_chateau || "Château inconnu"}
      </p>
      <p className="text-sm mb-1 font-bold">
        {product.appelation?.toUpperCase() || 'Vigneron inconnu'}
      </p>
      <p className="text-sm mb-2">
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
      <div className="flex-grow"></div>
      <button
        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-800 transition-colors w-fit mx-auto"
        onClick={() => alert('Ajouté au panier')}
      >
        Commander
      </button>
    </div>
  );
};

export default ProductCard;
