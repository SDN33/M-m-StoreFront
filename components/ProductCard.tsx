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
    return rating ? (rating / 5 * 20).toFixed(1) : "pas encore noté";
  };

  return (
    <div className="w-full max-w-[300px] bg-white rounded-lg overflow-hidden shadow-md">
      {/* Header - Purple Banner */}
      <div className="bg-primary text-white p-2 text-center font-semibold">
        Le {product.categories[0]?.name || 'Vin'} Imbattable
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
              {product.appelation} · {product.volume}
            </p>
          </div>
        </div>

        {/* Product Image and Rating Badge */}
        <div className="relative">
          <div className="absolute top-0 left-0 z-10 bg-accent rounded-full p-2 text-white">
            <div className="text-xs">NOTE</div>
            <div className="font-bold">{formatRating(product.average_rating)}/20</div>
          </div>
          <div className="relative w-full h-72 mb-4">
            <Image
              src={product.images[0]?.src || '/images/vinmémé.png'}
              alt={product.name}
              layout="fill"
              objectFit="contain"
              priority
              onClick={handleRedirect}
              className="hover:scale-105 transition-transform cursor-pointer"
            />
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-semibold cursor-pointer hover:underline">
              Lire les {product.rating_count || 0} avis
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm mb-4 text-gray-700">
          Un {product.categories[0]?.name} {product.appelation} au rapport prix/plaisir imbattable
        </p>
        <p className="text-sm mb-4 text-gray-700">
          {(() => {
            const shortDescription = product.short_description || '';
            const maxLength = 100;

            // Si la description est plus courte ou égale à 100 caractères, pas besoin de couper.
            if (shortDescription.length <= maxLength) return shortDescription;

            // Trouve le dernier espace avant la limite des 100 caractères.
            const lastSpaceIndex = shortDescription.substring(0, maxLength).lastIndexOf(' ');

            // Coupe à cet espace pour ne pas couper en plein milieu d'un mot.
            const truncatedDescription = shortDescription.substring(0, lastSpaceIndex);

            return `${truncatedDescription}... `;
          })()}
          <a href={`/product/${product.id}`} className="text-blue-500 hover:underline">
            voir plus
          </a>
        </p>

        {/* Delivery Badge */}
        <div className="bg-teal-500 text-white text-sm p-2 rounded-md flex items-center gap-2 mb-4">
          <span>🚚</span>
          <span>Produit en livraison 24H OFFERTE</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-900 px-2 py-1 rounded">
              -10%
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.floor(product.price)},
                <sup className="text-sm">{(product.price % 1).toFixed(2).substring(2)}€</sup>
              </div>
              <div className="text-sm text-gray-500">dès 3 bouteilles</div>
            </div>
          </div>
          <div className="text-gray-500">
            <div className="text-sm">à l'unité</div>
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
