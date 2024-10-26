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
    return (rating * 4).toFixed(1) + "/20"; // Conversion to /20
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
    if (product.price < 9) {
      return `Le qualité/prix IMBATTABLE !`;
    }
    if (product.price > 20) {
      return `${product.appelation || 'Vin'} D'Exception`;
    }
    if (product.average_rating && product.average_rating > 3.5) {
      return `Coup De Coeur de Mémé`;
    }
    if (product.certification?.toLowerCase().includes('biodynamie')) {
      return `Vin Démeter qui respecte la nature`;
    }

    if (product.categories.length > 0 && product.categories[0]?.name.toLowerCase().includes('pétillant')) {
      if (product.categories[0]?.name.toLowerCase() === 'rosé') {
        return `Des Bulles ${product.categories.map(category => category.name).filter(name => name.toLowerCase() !== 'pétillant').join(', ')} À Découvrir`;
      }
      if (product.categories[0]?.name.toLowerCase() === 'blanc') {
        return `Un ${product.categories.map(category => category.name).filter(name => name.toLowerCase() !== 'pétillant').join(', ')} pétillant À Découvrir`;
      }
      return `Un Vin ${product.categories.map(category => category.name).join(' et  ')} À Découvrir`;
    }
    if (product.categories[0]?.name.toLowerCase().includes('autres')) {
      return `Un Vin Original pour Surprendre`;
    }

    return `Un ${product.appelation?.toUpperCase() || 'Vin'} À Découvrir`;
  };

  return (
    <div className="w-full max-w-[400px] max-h-[90] min-w-[300px] bg-white rounded-lg overflow-hidden shadow-md">
      {/* Header - Personalized Banner */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white p-2 text-center font-semibold">
        {generateSlogan()}
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Title Section with Heart Icon */}
        <div className="flex items-start gap-2 mb-4">
          <div className="relative flex-grow">
            <div className="absolute -top-1 left-0">
              <Heart className="text-red-500 w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-bold pl-8 cursor-pointer hover:underline" onClick={handleRedirect}>
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 pl-8">
              {product.categories.map(category => category.name).join(', ')} · {product.volume} - {product.millesime}
            </p>
          </div>
        </div>

        {/* Product Image and Rating Badge */}
        <div className="relative">
          <div className="absolute top-0 left-0 z-10 bg-teal-500 rounded-full p-2 text-white">
            <div className="text-xs">NOTE</div>
            <div className="font-bold">{formatRating(product.average_rating)}</div>
          </div>
          <div className="relative w-full h-72 mb-4">
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

        {/* Certification */}
        <div className="mb-4 flex justify-end gap-2"> {renderCertification()} </div>

        {/* Rating Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-semibold cursor-pointer hover:underline">
              Lire les {product.rating_count || 0} avis
            </span>
          </div>
        </div>

        {/* Description */}
        {/* Description */}
        <p className="text-sm mb-4 text-gray-700">
          {(() => {
            const region = product.region__pays
              ? product.region__pays.toLowerCase() === 'bordeaux'
                ? 'du Sud-Ouest'
                : 'de ' + product.region__pays.charAt(0).toUpperCase() + product.region__pays.slice(1).toLowerCase()
              : '';

            const millesime = product.millesime ? ` millésimé en ${product.millesime}` : '';
            const chateau = product.nom_chateau ? ` par ${product.nom_chateau}` : '';

            return `Un ${product.categories[0]?.name || 'vin'} ${product.appelation || ''} ${region}${millesime}${chateau}`;
          })()}
        </p>



        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-900 px-2 py-1 rounded">
              -10%
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.floor(product.price)}<sup className="text-sm">{(product.price % 1).toFixed(2).substring(2)}€</sup>
              </div>
            </div>
          </div>
          <div className="text-gray-500">
            <div className="text-sm">à l&apos;unité</div>
            <div className="text-lg">{(product.price * 1.2).toFixed(2)}€</div>
          </div>
        </div>

        {/* Add to Cart Section */}
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-gray-400 cursor-pointer hover:text-red-500" />
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md px-3 py-2 bg-white"
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
