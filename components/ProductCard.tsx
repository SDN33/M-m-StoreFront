import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

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
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number, variationId: number) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [variationId] = useState<number>(product.id);
  const [imageError, setImageError] = useState<boolean>(false);

  const handleRedirect = () => {
    router.push(`/product/${product.id}`);
  };

  const formatRating = (rating?: number, ratingCount?: number) => {
    if (typeof rating !== 'number' || typeof ratingCount !== 'number' || ratingCount === 0)
      return <span className='text-xs'>Non noté</span>;
    return <span>{(rating * 4).toFixed(1)}/20</span>;
  };

  const renderCertification = () => {
    if (product.certification?.toLowerCase() === 'biodynamie') {
      return (
        <div className="relative w-20 h-6">
          <Image
            src="/images/biodemeter.png"
            alt="Certification biodynamique"
            fill
            style={{ objectFit: 'contain' }}
            onError={() => setImageError(true)}
          />
        </div>
      );
    }
    if (product.certification?.toLowerCase() === 'bio') {
      return (
        <div className="relative w-6 h-6">
          <Image
            src="/images/logobio1.webp"
            alt="Certification bio"
            fill
            style={{ objectFit: 'contain' }}
            onError={() => setImageError(true)}
          />
        </div>
      );
    }
    return null;
  };

  const generateSlogan = () => {
    if (product.price < 9) return `Le qualité/prix IMBATTABLE !`;
    if (product.price > 20) return `${product.appelation?.toUpperCase() || 'Vin'} Haut de Gamme`;
    if (product.average_rating && product.average_rating > 3.5) return `Coup De Coeur de Mémé`;
    if (product.certification?.toLowerCase().includes('biodynamie')) return `Vin Démeter qui respecte la nature`;
    if (product.categories.length > 0 && product.categories[0]?.name.toLowerCase().includes('pétillant')) {
      const categoryName = product.categories.map(category => category.name).join(', ');
      return `Un ${categoryName} À Découvrir`;
    }
    return `Un ${product.appelation?.toUpperCase() || 'Vin'} À Découvrir`;
  };

  return (
    <div className="w-full max-w-[400px] min-w-[300px] bg-white rounded-lg overflow-hidden shadow-md">
      <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-1 px-2 text-center text-sm font-semibold">
        {generateSlogan()}
      </div>

      <div className="p-3">
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

        <div className="relative">
          <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-teal-800 to-teal-950 rounded-full p-1.5 text-white">
            <div className="text-sm font-bold">{formatRating(product.average_rating ?? 0, product.rating_count ?? 0)}</div>
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
              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = '/images/vinmeme.png';
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">
            {product.rating_count || 0} avis
          </span>
          {!imageError && <div className="flex gap-2">{renderCertification()}</div>}
        </div>

        <p className="text-xs mb-2 text-gray-700 h-8 overflow-hidden text-center">
          {(() => {
            const region = product.region__pays
              ? product.region__pays.toLowerCase() === 'bordeaux'
                ? 'du Sud-Ouest'
                : 'de ' + product.region__pays.charAt(0).toUpperCase() + product.region__pays.slice(1).toLowerCase()
              : '';
            const millesime = product.millesime ? ` millésimé en ${product.millesime}` : '';
            const chateau = product.nom_chateau ? ` par ${product.nom_chateau}` : '';
            const appelation = product.appelation ? product.appelation.charAt(0).toUpperCase() + product.appelation.slice(1).toLowerCase() : '';
            return `Un ${product.categories[0]?.name || 'vin'} ${appelation.toUpperCase()} ${region}${millesime}${chateau}`;
          })()}
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
            <div className="text-xs">à l&apos;unité</div>
            <div className="text-sm">{(product.price * 1.2).toFixed(2)}€</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mx-auto">
          <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-2 py-1 bg-white text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <AddToCartButton
            productId={product.id}
            product={product}
            quantity={quantity}
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
