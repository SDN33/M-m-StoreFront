import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import AddToCart from './AddToCartButton';

interface Product {
  id: number;
  name: string;
  price: number;
  categories: { id: number; name: string }[];
  certification?: string;
  images: { src: string }[];
  vendor?: { vendorPhotoUrl?: string; name?: string };
  store_name?: string;
  nom_chateau?: string;
  appelation?: string;
  millesime?: string;
  region__pays?: string;
  volume?: string;
  rating_count?: number;
  average_rating?: number;
  style?: string;
  cepages?: string[];
  short_description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number, variationId: number) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [variationId] = useState<number>(product.id);

  const handleRedirect = () => {
    router.push(`/product/${product.id}`);
  };

  const formatRating = (rating?: number) => {
    if (!rating || product.rating_count === 0) return "pas encore noté";
    return (rating * 4).toFixed(1) + "/20";
  };

  const renderCertification = () => {
    if (product.certification?.toLowerCase() === 'biodynamie') {
      return <Image src="/images/demeter.png" alt="Certification biodynamique" width={24} height={24} />;
    }
    if (product.certification?.toLowerCase() === 'bio') {
      return <Image src="/images/logobio1.webp" alt="Certification bio" width={24} height={24} />;
    }
    return null;
  };

  const generateSlogan = () => {
    if (product.price < 9) return `Le qualité/prix IMBATTABLE !`;
    if (product.price > 20) return `${product.appelation || 'Vin'} Haut de Gamme`;
    if (product.average_rating && product.average_rating > 3.5) return `Coup De Coeur de Mémé`;
    if (product.certification?.toLowerCase().includes('biodynamie')) return `Vin Démeter qui respecte la nature`;
    if (product.categories.length > 0 && product.categories[0]?.name.toLowerCase().includes('pétillant')) {
      if (product.categories[0]?.name.toLowerCase() === 'rosé') {
        return `Des Bulles ${product.categories.map(category => category.name).filter(name => name.toLowerCase() !== 'pétillant').join(', ')} À Découvrir`;
      }
      if (product.categories[0]?.name.toLowerCase() === 'blanc') {
        return `Un ${product.categories.map(category => category.name).filter(name => name.toLowerCase() !== 'pétillant').join(', ')} pétillant À Découvrir`;
      }
      return `Un ${product.categories.map(category => category.name).join(' et  ')} À Découvrir`;
    }
    if (product.categories[0]?.name.toLowerCase().includes('autres')) return `Un Vin Original pour Surprendre`;
    return `Un ${product.appelation?.toUpperCase() || 'Vin'} À Découvrir`;
  };

  return (
    <div className="w-full max-w-[400px] min-w-[300px] bg-white rounded-lg overflow-hidden shadow-md">
      {/* Header - Slogan Banner */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-1 px-2 text-center text-sm font-semibold">
        {generateSlogan()}
      </div>

      {/* Main Content */}
      <div className="p-3">
        {/* Title Section with Heart Icon */}
        <div className="flex items-start gap-1 mb-2">
          <div className="relative flex-grow">
            <div className="absolute -top-1 left-0">
              <Heart className="text-red-500 w-5 h-5 fill-current" />
            </div>
            <h3 className="text-base font-bold pl-6 cursor-pointer hover:underline truncate" onClick={handleRedirect}>
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 pl-6 truncate">
              {product.categories.map(category => category.name).join(', ')} · {product.volume} - {product.millesime}
            </p>
          </div>
        </div>

        {/* Product Image and Rating Badge */}
        <div className="relative">
          <div className="absolute top-0 left-0 z-10 bg-teal-500 rounded-full p-1.5 text-white">
            <div className="text-xs">NOTE</div>
            <div className="text-sm font-bold">{formatRating(product.average_rating)}</div>
          </div>
          <div className="relative w-full h-52 mb-2">
            <Image
              src={product.images[0]?.src || '/images/vinmeme.png'}
              alt={product.name}
              fill
              objectFit="contain"
              priority
              onClick={handleRedirect}
              className="hover:scale-105 transition-transform cursor-pointer"
            />
          </div>
        </div>

        {/* Certification and Rating */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">
            {product.rating_count || 0} avis
          </span>
          <div className="flex gap-2">{renderCertification()}</div>
        </div>

        {/* Description */}
        <p className="text-xs mb-2 text-gray-700 h-8 overflow-hidden">
          {(() => {
            const region = product.region__pays
              ? product.region__pays.toLowerCase() === 'bordeaux'
                ? 'du Sud-Ouest'
                : 'de ' + product.region__pays.charAt(0).toUpperCase() + product.region__pays.slice(1).toLowerCase()
              : '';
            const millesime = product.millesime ? ` millésimé en ${product.millesime}` : '';
            const chateau = product.nom_chateau ? ` par ${product.nom_chateau}` : '';
            const appelation = product.appelation ? product.appelation.charAt(0).toUpperCase() + product.appelation.slice(1).toLowerCase() : '';
            return `Un ${product.categories[0]?.name || 'vin'} ${appelation} ${region}${millesime}${chateau}`;
          })()}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded text-sm">
              -10%
            </div>
            <div>
              <div className="text-xl font-bold">
                {Math.floor(product.price)}<sup className="text-xs">{(product.price % 1).toFixed(2).substring(2)}€</sup>
              </div>
            </div>
          </div>
          <div className="text-gray-500 text-right">
            <div className="text-xs">à l&apos;unité</div>
            <div className="text-sm">{(product.price * 1.2).toFixed(2)}€</div>
          </div>
        </div>

        {/* Add to Cart Section */}
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-2 py-1 bg-white text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <AddToCart
            productId={product.id}
            quantity={quantity}
            cart_item_data={{}}
            onAddToCart={async () => {
              await onAddToCart(product.id, quantity, variationId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
