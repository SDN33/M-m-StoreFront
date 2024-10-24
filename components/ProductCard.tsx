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
    return rating ? (rating / 5 * 20).toFixed(1) : "pas encore d'avis";
  };

  const cleanHTMLTags = (description?: string) => {
    if (!description) return '';
    return description.replace(/<\/?[^>]+(>|$)/g, ""); // Supprimer toutes les balises HTML
  };

  // Génération du titre en fonction du prix
  const generateTitle = () => {
    if (product.price < 6) {
      return `Le vin ${product.categories[0]?.name || 'de Mémé'} - Bon plan de mémé`;
    } else if (product.price >= 6 && product.price < 20) {
      return `Le prestigieux vin ${product.categories[0]?.name || 'raffiné'}`;
    } else {
      return `L'excellence de ${product.categories[0]?.name || 'la cave'}`;
    }
  };

  // Génération d'une dizaine de slogans personnalisés
  const slogans = [
    "Un vin à savourer en toute occasion",
    "La sélection unique de mémé",
    "Un cru exceptionnel pour les connaisseurs",
    "Le choix des gourmets à petit prix",
    "Le meilleur rapport qualité-prix",
    "Un vin qui fait plaisir sans se ruiner",
    "L'ami de vos apéros et repas de fête",
    "Un classique indémodable à découvrir",
    "L'élégance à portée de main",
    "Le charme discret de la tradition",
  ];

  return (
    <div className="w-full max-w-[300px] bg-white rounded-lg overflow-hidden shadow-md">
      {/* Header - Purple Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-primary p-2 text-center font-semibold">
        {generateTitle()} - {slogans[Math.floor(Math.random() * slogans.length)]}
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
            const shortDescription = cleanHTMLTags(product.short_description);
            const maxLength = 100;

            if (shortDescription.length <= maxLength) return shortDescription;

            const lastSpaceIndex = shortDescription.substring(0, maxLength).lastIndexOf(' ');
            const truncatedDescription = shortDescription.substring(0, lastSpaceIndex);

            return (
              <>
                {truncatedDescription}...{' '}
                <a href={`/product/${product.id}`} className="text-blue-500 hover:underline">
                  voir plus
                </a>
              </>
            );
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
