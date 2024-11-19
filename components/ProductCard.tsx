import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Info } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { MapPin } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  categories: { id: number; name: string }[];
  certification?: string;
  images: { src: string }[];
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
  description?: string;
  rating?: number;
  vendor: number;
}

interface VendorData {
  id: number;
  shop: {
    images: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number, variationId: number) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [variationId] = useState<number>(product.id);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [vendorImages, setVendorImages] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorImages = async () => {
      try {
        const response = await fetch(`/api/get-vendor-products?vendorId=${product.vendor}`);
        if (!response.ok) throw new Error('Failed to fetch vendor data');
        const vendorData: VendorData = await response.json();
        if (vendorData?.shop?.images) {
          setVendorImages(vendorData.shop.images);
        }
      } catch (error) {
        console.error('Error fetching vendor image:', error);
      }
    };

    if (product.vendor) {
      fetchVendorImages();
    }
  }, [product.vendor]);

  const handleRedirect = () => {
    router.push(`/product/${product.id}`);
  };

  const vendorRedirect = () => {
    router.push(`/vendors/${product.vendor}`);
  }

  const formatRating = (rating?: number, ratingCount?: number) => {
    if (!rating || !ratingCount || ratingCount === 0) return <span className='text-xs'>Non noté</span>;
    return <span>{(rating * 4).toFixed(1)}/20</span>;
  };

  const renderAOCBadge = () => {
    if (product.name.toLowerCase().includes('aoc')) {
      return (
        <div className={`absolute bottom-3 ${product.certification?.toLowerCase() === 'bio' ? 'right-10' : 'right-12'} w-7 h-7 z-20`}>
          <Image
            src="/images/LogoAOC.jpg"
            alt="Badge AOC"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      );
    }
    return null;
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
          />
        </div>
      );
    }
    return null;
  };

  function stripHtmlAndTruncate(text: string = '', maxLength: number): string {
    const plainText = text.replace(/<\/?[^>]+(>|$)/g, '');
    if (plainText.length > maxLength) {
      return plainText.substring(0, plainText.lastIndexOf(' ', maxLength)) + '...';
    }
    return plainText;
  }

  const truncatedName = useMemo(() => stripHtmlAndTruncate(product.name, 36), [product.name]);

  useEffect(() => {
    setIsTruncated(product.name.length > 38);
  }, [product.name]);

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
    <div className="w-full max-w-[400px] min-w-[300px] bg-white rounded-lg overflow-hidden shadow-md mb-8">      <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-1 px-2 text-center text-sm font-semibold">
        {generateSlogan()}
      </div>

      <div className="p-3">
        <div className="flex items-start gap-1 mb-2">
          <div className="relative flex-grow">
            <div className="flex items-center">
              <h3
                className="text-base font-bold cursor-pointer hover:underline truncate"
                onClick={handleRedirect}
                title={isTruncated ? product.name : undefined}
              >
                {truncatedName}
              </h3>
              {isTruncated && (
                <div className="relative group" title={product.name}>
                  <Info className="w-4 h-4 text-gray-500 ml-1 cursor-pointer" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {product.categories.map((category) => category.name).join(" et ")} - {product.appelation?.split(/[\s-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} · {product.millesime} · {product.volume}
            </p>
          </div>
        </div>

        <div className="relative">
        <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-teal-800 to-teal-950 rounded-full p-1.5 text-white">
          <div className="text-sm font-bold">{formatRating(product.average_rating, product.rating_count)}</div>
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
          {renderAOCBadge()}
          <div className={`absolute bottom-2 ${product.certification?.toLowerCase() === 'biodynamie' ? 'right-6' : 'right-0'} w-8 h-8 z-20`}>
            {renderCertification()}
          </div>

        </div>
        <div onClick={vendorRedirect} className="flex items-center gap-2 cursor-pointer">
          {vendorImages && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={vendorImages}
                alt={product.store_name || 'Vendor shop'}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}
          <div>
            <p className='text-xs cursor-pointer '>Découvrir <span className='text-teal-800'>{product.store_name || '@MéméGeorgette'}</span></p>
            <span className='text-xs font-semibold text-gray-800 flex items-center'>
              <MapPin className="w-3 h-3 mr-1 font-bold" />
              {product.region__pays ? product.region__pays.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''}
            </span>
          </div>
        </div>
      </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold cursor-pointer hover:underline">
            {product.rating_count || 0} avis
          </span>
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
              await onAddToCart(product.id, quantity, variationId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
