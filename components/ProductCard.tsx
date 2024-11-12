import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Info } from 'lucide-react';
import AddToCartButton from './AddToCartButton'; // Assurez-vous d'importer correctement ce composant

interface Product {
  id: number;
  name: string;
  appelation?: string;
  categories: { name: string }[];
  volume: string;
  millesime: string;
  average_rating: number;
  rating_count: number;
  images: { src: string }[];
  short_description: string;
  description: string;
  price: number;
}

const ProductCard: React.FC<{ product: Product; onAddToCart: (id: number, qty: number, varId: number) => void }> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [vendorImage, setVendorImage] = useState<string | null>(null);

  const generateSlogan = () => {
    return `Un ${product.appelation?.toUpperCase() || 'Vin'} À Découvrir`;
  };

  const formatRating = (rating: number, count: number) => {
    // Si le rating n'est pas un nombre valide, retourner une valeur par défaut
    if (typeof rating !== 'number' || isNaN(rating)) {
      return `Non noté `;
    }

    // Si rating est un nombre valide, utiliser toFixed
    return `${rating.toFixed(1)} (${count} avis)`;
  };

  const handleRedirect = () => {
    // Ajoutez la logique de redirection ici
  };

  const stripHtmlAndTruncate = (text: string, length: number) => {
    const strippedText = text.replace(/<\/?[^>]+(>|$)/g, ''); // Suppression des balises HTML
    return strippedText.length > length ? strippedText.substring(0, length) + '...' : strippedText;
  };

  return (
    <div className="w-full max-w-[400px] min-w-[300px] bg-white rounded-lg overflow-hidden shadow-md mb-8">
      <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-1 px-2 text-center text-sm font-semibold">
        {generateSlogan()}
      </div>

      <div className="p-3">
        <div className="flex items-start gap-1 mb-2">
          <div className="relative flex-grow">
            <div className="absolute -top-1 left-0">
              <Heart className="text-red-500 w-5 h-5 fill-current" />
            </div>
            <div className="flex items-center pl-6">
              <h3
                className="text-base font-bold cursor-pointer hover:underline truncate"
                onClick={handleRedirect}
                title={product.name}
              >
                {product.name}
              </h3>
              <div className="relative group" title={product.name}>
                <Info className="w-4 h-4 text-gray-500 ml-1 cursor-pointer" />
              </div>
            </div>
            <p className="text-xs text-gray-500 pl-6 truncate">
              {product.categories.map((category) => category.name).join(" et ")} · {product.volume} - {product.millesime}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-teal-800 to-teal-950 rounded-full p-1.5 text-white">
            <div className="text-sm font-bold">{formatRating(product.average_rating, product.rating_count)}</div>
            {product.rating_count === 0 && (
              <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-teal-800 to-teal-950 rounded-full p-1.5 text-white">
                <div className="text-sm font-bold">Non noté</div>
              </div>
            )}
          </div>
          <div className="relative w-full h-52 mb-2">
            <Image
              src={product.images[0]?.src || '/images/vinmeme.png'}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              priority
              onClick={handleRedirect}
              className="hover:scale-105 transition-transform cursor-pointer"
              onError={() => setImageError(true)}
            />
            {/* Vendor Avatar */}
            {vendorImage && (
              <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <Image src={vendorImage} alt="Vendor Avatar" width={40} height={40} objectFit="cover" />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">
            {product.rating_count || 0} avis
          </span>
          {!imageError && <div className="flex gap-2">{/* Render Certifications Here */}</div>}
        </div>

        <p className="text-xs mb-2 text-gray-700 h-8 overflow-hidden text-center">
          {stripHtmlAndTruncate(product.short_description || product.description || '', 110)}
        </p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded text-sm">
              -10%
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.floor(product.price)}<sup className="text-sm">{(product.price % 1).toFixed(2).substring(2)}€</sup>
              </div>
            </div>
          </div>
          <div className="text-gray-500 text-right">
            <div className="text-xs">avant remise</div>
            <div className="text-sm">{(product.price * 1.2).toFixed(2)}€</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mx-auto">
          <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md p-1 text-sm"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <AddToCartButton
            productId={product.id}
            product={product}
            quantity={quantity}
            onAddToCart={async () => {
              await onAddToCart(product.id, quantity, 0); // Assurez-vous d'ajouter `variationId` ou une valeur appropriée ici
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
