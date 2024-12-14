import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { MapPin, HeartHandshakeIcon } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price: number;
  regular_price: number;
  categories: { id: number; name: string }[];
  certification?: string;
  images: { src: string }[];
  store_name?: string;
  nom_chateau?: string;
  appellation?: string;
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
  sans_sulfites_?: string;
  petit_prix?: string;
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
  const [loading, setLoading] = useState<boolean>(false);
  const vendorImageCache = useRef<{ [key: number]: string }>({});

  const vendorId = product.vendor;

  useEffect(() => {
    const fetchVendorImage = async () => {
      if (!vendorId) return;

      // Utiliser le cache si l'image existe
      if (vendorImageCache.current[vendorId]) {
        setVendorImages(vendorImageCache.current[vendorId]);
        return;
      }

      try {
        const fetchWithRetry = async (url: string, options: RequestInit, retries: number = 3, delay: number = 1000): Promise<Response> => {
          try {
            const response = await fetch(url, options);
            if (!response.ok) {
              if (response.status === 429 && retries > 0) {
                await new Promise(res => setTimeout(res, delay));
                return fetchWithRetry(url, options, retries - 1, delay * 2);
              }
              throw new Error('Échec de la récupération des données du vendeur');
            }
            return response;
          } catch (error) {
            if (retries > 0) {
              await new Promise(res => setTimeout(res, delay));
              return fetchWithRetry(url, options, retries - 1, delay * 2);
            }
            throw error;
          }
        };

        const response = await fetchWithRetry('/api/get-vendor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: vendorId }),
        });

        const vendorData = await response.json();
        if (vendorData?.shop?.image) {
          vendorImageCache.current[vendorId] = vendorData.shop.image;
          setVendorImages(vendorData.shop.image);
        } else {
          console.warn('Image du vendeur non disponible');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des images du vendeur :', error);
      }
    };

    fetchVendorImage();
  }, [vendorId]);

  const handleRedirect = () => {
    setLoading(true);
    router.push(`/produits/${product.id}`);
    setLoading(false);
  };

  // Debounce function to limit how often handleRedirect can be called
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedRedirect = debounce(handleRedirect, 300);

  const vendorRedirect = () => {
    router.push(`/vignerons/${product.vendor}`);
  }

  const renderAOCBadge = () => {
    if (product.name.toLowerCase().includes('aoc')) {
      return (
        <div className={`absolute bottom-2 ${product.certification?.toLowerCase() === 'bio' ? 'right-10' : 'right-12'} w-auto h-auto z-20`}>
          <Image
            src="/images/LogoAOC.png"
            width={28}
            height={28}
            alt="Badge AOC"
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
        <div className="relative w-20 h-6 mt-1">
          <Image
            src="/images/bioBiodynamie.png"
            alt="Certification biodynamique"
            fill
            sizes='100%'
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
            width={24}
            height={24}
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
      return plainText.substring(0, plainText.lastIndexOf(' ', maxLength)) + '';
    }
    return plainText;
  }

  const truncatedName = useMemo(() => stripHtmlAndTruncate(product.name, 40), [product.name]);

  useEffect(() => {
    setIsTruncated(product.name.length > 40);
  }, [product.name]);

  const generateSlogan = () => {
    // Helper pour sélection aléatoire
    const getRandomSlogan = (slogans: string[]) => {
      const randomIndex = Math.floor(Math.random() * slogans.length);
      return slogans[randomIndex];
    };

    // Variations pour chaque type de slogan
    const slogans = {

      contenance: [
        "Un Grand Format qui en Jette !",
      ],

      qualitePrix: [
        "Le qualité/prix IMBATTABLE !",
        "Petit Prix, Grand Vin !",
        "Une Affaire à ne pas Manquer !"
      ],

      hautDeGamme: [
        `${product.appellation?.toUpperCase() || 'Vin'} de Prestige`,
        "Un Vin d'Exception",
        "La Crème de la Crème"
      ],

      coupDeCoeur: [
        "Coup De Coeur de Mémé",
      ],

      petillant: (categoryName: string) => [
        `Un ${categoryName} pour vos Fêtes !`,
      ],

      decouverte: (appellation: string) => [
        `Un ${appellation.toUpperCase() || 'Vin'} À Découvrir`,
      ]
    };

    if (product.volume && product.volume.includes('autre')) {
      return getRandomSlogan(slogans.contenance);
    }

    // Même logique de conditions, mais avec variations
    if (product.price < 9) {
      return getRandomSlogan(slogans.qualitePrix);
    }

    if (product.price >= 20) {
      return getRandomSlogan(slogans.hautDeGamme);
    }

    if (product.average_rating && product.average_rating > 3.5) {
      return getRandomSlogan(slogans.coupDeCoeur);
    }

    if (product.categories.length > 0 && product.categories[0]?.name.toLowerCase().includes('pétillant')) {
      const categoryName = product.categories.map(category => category.name).join(', ');
      return getRandomSlogan(slogans.petillant(categoryName));
    }

    // Slogan par défaut avec variations
    return getRandomSlogan(slogans.decouverte(product.appellation || 'Vin'));
  };

  const selectedProductIds = [621,632,255,284,286,292,653,659]; // Example array of selected product IDs

  const renderSelectedBadge = () => {
    if (selectedProductIds.includes(product.id)) {
      return (
        <div className="absolute top-0 right-0 bg-red-700/90 shadow-2xl text-white text-[9px] px-3 py-2 rounded-full flex items-center gap-2 z-40">
          <span className="flex items-center justify-center text-white rounded-full ">
            <HeartHandshakeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
            <p>Le choix de Mémé </p>
          </span>
        </div>


      );
    }
    return null;
  };
  return (
    <div className="w-full max-w-[400px] min-w-[300px] bg-white rounded-lg overflow-hidden shadow-md mb-8">
      <div className="bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 text-white py-1 px-2 text-center text-sm font-semibold">
        {generateSlogan()}
      </div>

      <div className="p-3">
        <div className="flex items-start gap-1 mb-2">
          <div className="relative flex-grow">
            <div className="flex items-center">
              <h2
                className="text-base font-bold cursor-pointer hover:underline truncate"
                onClick={debouncedRedirect}
                title={isTruncated ? product.name : undefined}
              >
                {truncatedName}
              </h2>
              {isTruncated && (
                <div className="relative group" title={product.name}>
                  <Info className="w-4 h-4 text-gray-500 ml-1 cursor-pointer" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {product.categories.map((category) => category.name).join(" et ")} - {product.appellation?.split(/[\s-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} · {product.millesime} · {product.volume}
            </p>
          </div>
        </div>

        <div className="relative">
        <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-teal-800 to-teal-950 rounded-full text-white p-2">
          <div className="text-sm font-bold">
            <span className='text-xs font-semibold'> {product.rating_count} avis</span>
          </div>
        </div>
        <div>
          {product.sans_sulfites_ === 'oui' && (
            <div className="absolute top-0 right-0 z-10 bg-primary/95 text-white text-xs px-2 py-2 rounded-full">
              Sans sulfites
            </div>
          )}
        </div>
        <div className="relative w-full h-52 mb-2 mt-2">
          {renderSelectedBadge()}
          <Image
            src={product.images[0]?.src || '/images/vinmeme.png'}
            alt={product.name}
            width={500}
            height={500}
            sizes="(max-width: 768px) 500px, 500px"
            priority={true}
            onClick={handleRedirect}
            className="hover:scale-105 transition-transform cursor-pointer h-full w-full object-contain"
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


        </div>
        <div onClick={vendorRedirect} className="flex items-center gap-2 cursor-pointer">
          {vendorImages && (
            <div className="relative rounded-full overflow-hidden w-9 h-auto">
              <Image
                src={vendorImages || '/images/meme-pas-contente.png'}
                alt={product.store_name || 'Vendor shop'}
                width={36}
                height={36}
                className="rounded-full"
                sizes='100%'
              />
            </div>
          )}
          <div>
            <p className='text-xs cursor-pointer '>Découvrir <span className='text-teal-800'>{product.store_name || '@MéméGeorgette'}</span></p>
            <span className='text-xs font-semibold text-teal-800 flex items-center'>
              <MapPin className="w-3 h-3 mr-1 font-bold" />
                {product.region__pays ? product.region__pays.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace('Bordeaux', 'Sud-Ouest') : ''}
            </span>
          </div>
        </div>
      </div>
        <a href={`/produits/${product.id}`} className="text-xs text-gray-950 h-8 overflow-hidden text-center mx-4 font-medium mb-4 flex justify-center cursor-pointer">
          {stripHtmlAndTruncate(product.short_description || stripHtmlAndTruncate(product.description, 110) || '', 110)}
        </a>

        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-2xl font-bold ml-4">
             {Math.floor(product.price)}<sup className="text-sm">€{(product.price % 1).toFixed(2).substring(2)}</sup>
            </div>
          </div>
          {product.sale_price ? (
          <div className="bg-gray-950 text-primary text-right px-2 py-1 rounded text-sm ml-2 ">
            Promo
          </div>
          ) : null}
          <div className="flex items-center">
            {product.sale_price && product.regular_price && (
              <div className="bg-red-100 text-right ml-24 text-purple-900 px-1.5 py-0.5 rounded text-sm">
                {Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)}%
              </div>
            )}
          </div>
          <div className="text-gray-500 text-right mr-4 ">
            {product.sale_price && <div className="text-xs">avant remise</div>}
            {product.sale_price && (
              <div className="text-sm line-through">
              {Math.floor(product.regular_price)}€
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="border-b-2 border-gray-200 w-full mx-auto my-4"></div>
        </div>

        <div className="flex items-center justify-center mx-auto pb-4">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border mr-4 rounded-md p-2 "

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
            label="Ajouter au panier"
            onAddToCart={async () => {
              await onAddToCart(product.id, quantity, variationId);
            }}
          />
        </div>

      <div>
      </div>
    </div>
  );
};

export default ProductCard;
