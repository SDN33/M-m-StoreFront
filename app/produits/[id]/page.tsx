'use client'; // Ajoutez cette ligne en haut du fichier

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Package, CreditCard, HeartHandshakeIcon } from 'lucide-react';
import Livraison from '@/components/Livraison';
import SocialShare from '@/components/Socialshare';
import AddToCartButton from '@/components/AddToCartButton';
import ProductReviews from '@/components/ProductReviews';
import Head from 'next/head';

interface Product {
  id: number;
  name: string;
  price: number;
  regular_price: number;
  sale_price: number;
  stock_status: string;
  volume: string;
  region__pays?: string;
  appellation?: string;
  description?: string;
  short_description?: string;
  images: { src: string }[];
  rating?: number;
  average_rating?: number;
  rating_count?: number;
  vendor?: {
    id?: number;
    vendorPhotoUrl?: string;
  };
  conservation?: string;
  style?: string;
  store_name?: string;
  categories: { id: number; name: string }[];
  accord_mets?: string;
  cepages?: string;
  nom_chateau?: string;
  certification?: string;
  degre?: number;
  millesime?: string;
  degustation: string;
  sans_sulfites_?: string;
}

const formatDescription = (description: string, maxChars = 90) => {
  const plainText = description.replace(/<\/?[^>]+(>|$)/g, '');
  const words = plainText.split(' ');
  let formattedDescription = '';
  let line = '';

  words.forEach((word) => {
    if (line.length + word.length + 1 > maxChars) {
      formattedDescription += line.trim() + '\n';
      line = word + ' ';
    } else {
      line += word + ' ';
    }
  });

  if (line.trim()) {
    formattedDescription += line.trim();
  }

  return formattedDescription;
};

const renderAOCBadge = (product: Product) => {
  if (product.name.toLowerCase().includes('aoc')) {
    return (
      <div className={`z-20 ${product.certification === 'biodynamie' ? 'ml-3' : 'ml-2'}`}>
        <Image
          src="/images/LogoAOC.jpg"
          alt="Badge AOC"
          style={{ objectFit: 'contain' }}
          width={30}
          height={30}
        />
      </div>
    );
  }
  return null;
};

const getCertificationLogo = (certification?: string) => {
  switch (certification?.toLowerCase()) {
    case 'bio':
      return { src: '/images/logobio1.webp', width: 24, height: 24 };
    case 'biodynamie':
      return { src: '/images/bioBiodynamie.png', width: 80, height: 80 };
    case 'en conversion':
      return { src: '/images/enconv.png', width: 80, height: 80 };
    default:
      return { src: '', width: 0, height: 0 };
  }
};

// Fonction joinIfArray
const joinIfArray = (value: string | string[], separator: string = ', ') => {
  if (Array.isArray(value)) {
    return value.join(separator);
  }
  return value; // Retourne la chaîne telle quelle si ce n'est pas un tableau
};

// Fonction getGoogleMapUrl
const getGoogleMapUrl = (location: string) => {
  const encodedLocation = encodeURIComponent(location || '');
  return `https://maps.google.com/maps?q=${encodedLocation}&z=12&output=embed`;
};

const ProductPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        const fetchedProduct = data.find((p: Product) => p.id === Number(id));
        if (!fetchedProduct) throw new Error('Product not found');
        // Assurez-vous que average_rating est un nombre
        fetchedProduct.average_rating = parseFloat(fetchedProduct.average_rating) || 0;
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);


  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const vendorRedirect = () => {
    if (product && product.vendor) {
      router.push(`/vignerons/${product.vendor}`);
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-bold text-lg">Erreur : {error}</p>
        <button onClick={() => location.reload()} className="mt-4 bg-primary text-white px-4 py-2 rounded">
          Réessayer
        </button>
      </div>
    );
  }

  if (!product) return null;

  const selectedProductIds = [621,632,255,284,286,292,653]; // Example array of selected product IDs

  const renderSelectedBadge = () => {
    if (selectedProductIds.includes(product.id)) {
      return (
        <div className="absolute -top-10 right-0 sm:right-1 md:-right-8 bg-red-700/90 shadow-2xl text-white text-[9px] px-3 py-2 rounded-full flex items-center gap-2 z-40">
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
    <>
      <Head>
        <title>{product.name} - Mémé Georgette - ACHAT VINS BIO et BIODYNAMIQUE</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} - Mémé Georgette - ACHAT VINS BIO et BIODYNAMIQUE`} />
        <meta property="og:description" content={`Achetez les meilleurs vins bio et biodynamiques avec Mémé Georgette. ${product.description}`} />
        <meta property="og:image" content="/images/default-product.jpg" />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />
      </Head>
      <div className=" min-h-screen sm:mt-0 md:mt-16 lg:mt-20 px-4 md:px-12 flex flex-col justify-between overflow-x-hidden overflow-y-hidden">
      <span className='sm:flex md:hidden lg:hidden'><br /><br /></span>
      <div className="relative top-0 left-0 w-full">
      </div>
      <br /><br /><br />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-hidden">
        <nav aria-label="Breadcrumb" className="text-xs mb-7 overflow-x-auto whitespace-nowrap text-center">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="text-gray-950 hover:text-gray-700">Accueil</a>
              <span className="mx-2 text-gray-950">&gt;</span>
            </li>
            <li className="flex items-center">
              <a className="cursor-pointer text-gray-950 hover:text-gray-700" onClick={vendorRedirect}>
                {product.store_name || ' @MéméGeorgette'}
              </a>
              <span className="mx-2 text-gray-950">&gt;</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-950 truncate max-w-[150px] sm:max-w-none" aria-current="page">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="flex items-start z-10 w-full justify-start px-4 md:px-0">
              <p className="text-sm flex gap-2">
                {product.certification ? (
                  <Image
                    {...getCertificationLogo(product.certification)}
                    alt="Certification logo"
                    width={product.certification === 'biodynamie' ? 100 : 30}
                    height={product.certification === 'biodynamie' ? 100 : 30}
                    priority
                  />
                ) : (
                  'Non renseignée'
                )}
                {product.certification === 'en conversion' && (
                  <p className="text-xs font-semibold text-gray-900 mt-2">En conversion biologique</p>
                )}
              </p>
              {renderAOCBadge(product)}
            </div>
            <div className="relative w-full sm:max-w[200px] md:max-w[300px] lg:max-w-[400px]">
              {renderSelectedBadge()}
              <Image
              src={product.images && product.images.length > 0 ? product.images[0].src : '/images/vinmeme.png'}
              alt={product.name}
              width={700}
              height={800} // Adjusted height to maintain a consistent aspect ratio
              className="mt-5 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-110 cursor-zoom-in"
              loading="lazy"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4 md:px-0">
            <p className="text-sm font-bold break-words">{product.nom_chateau || 'Château inconnu'}</p>
            <h1 className="text-3xl font-bold break-words">{product.name}</h1>
            <p className="text-sm font-bold mt-1 mb-2 break-words">
              {product.appellation?.toUpperCase()} • {product.region__pays?.toLowerCase() === 'bordeaux' ? 'Sud-Ouest' : product.region__pays?.toUpperCase() || ''} • {product.millesime}
            </p>
            <div className="flex items-center -mb-6 mx-auto">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
              <span className="text-xs text-gray-600 ml-1">({product.rating_count || 0} avis)</span>
            </div>


            <br />
            <div className='flex gap-2 mt-4'>
              {product.sale_price ? (
              <div className="bg-gray-950 text-primary text-right px-2 py-1 rounded w-fit text-sm ">
                Promo
              </div>
              ) : null}
              {product.sale_price && product.regular_price && (
                <div className="bg-red-100 text-purple-900 px-1.5 py-0.5 rounded text-sm h-fit mt-1">
                  {Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)}%
                </div>
              )}
            </div>
            <br />
            <div className='flex -mt-8'>
              <p className="text-5xl font-bold !mb-2">
                <span className="flex items-start z-10">
                  <span className="text-3xl font-bold">{Math.floor(product.price)}</span>
                  <span className="text-xl font-bold align-top mt-1">
                    <sup>€{(product.price % 1).toFixed(2).substring(2)}</sup>
                  </span>
                </span>
              </p>
              <div className="text-gray-500 ml-2 mt-2">
              {product.sale_price && <div className="text-xs">avant remise</div>}
              {product.sale_price && (
                <div className="text-sm line-through">
                {Math.floor(product.regular_price)}€
                </div>
              )}
            </div>
          </div>

            <span className="text-xs font-normal">Bouteille de {product.volume}</span>
            <br />
            <p className="text-sm font-normal mb-4">
              Vendu par
              <a className="cursor-pointer text-gray-950 hover:text-teal-800" onClick={vendorRedirect}>
                 <br />{product.store_name || ' @MéméGeorgette'}
              </a>
            </p>


            <SocialShare url={currentUrl} title={`${product.name} - VINS Mémé Georgette - ACHAT VINS BIO et BIODYNAMIQUE`} />
            <div className="items-center mt-6 flex gap-2">
              <Package className="h-6 w-6" />
              <span className="font-bold text-xs mb-1">Livraison offerte dès <span className='text-teal-800'>6 bouteilles achetées</span> sur un domaine</span>
            </div>
            <div
              className='ml-8 px-1 text-xs font-light -mt-4 mb-6'
              aria-label={`Prix par 6 : ${Math.floor(product.price * 6)} euros, livraison offerte`}
            >
              <p>
                <br />
                <span className='font-semibold'>Par <span className='text-teal-800'>6</span> = <span className='text-base'>{Math.floor(product.price * 6)}€</span> &nbsp;+</span>
                <span className='bg-gray-950 p-1 text-white ml-2'>Livraison offerte</span>
              </p>
            </div>

            <div className="flex items-center">
              <div className="flex items-center">
                <label htmlFor="quantity" className="sr-only">Quantité</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mr-4 p-2 border rounded bg-white border-gray-300"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <AddToCartButton
                product={product}
                quantity={quantity}
                productId={product.id}
                aria-label={`Ajouter ${quantity} bouteille${quantity > 1 ? 's' : ''} au panier`}
                onAddToCart={() => {
                  return new Promise<void>((resolve) => {
                    console.log(`Added ${quantity} of product ${product.id} to cart`);
                    resolve();
                  });
                }}
              />
            </div>
                {/* Logos de paiement */}
            <div className="flex justify-start items-center space-x-4 w-auto h-auto mb-8 bg-white rounded-lg p-2 mt-2">
              <a href="https://www.visa.fr" title="Visa">
                <Image
                  src="/images/visa.png"
                  alt="Visa"
                  height={20}
                  width={20}
                  sizes="20"
                />
              </a>
              <a href="https://www.mastercard.fr" title="mastercard"  aria-label="Mastercard">
                <Image
                  src="/images/mastercard.png"
                  alt="Mastercard"
                  height={20}
                  width={20}
                  sizes='20'
                />
              </a>
              <a href="https://stripe.com/fr" title="Stripe" aria-label="Stripe">
                <Image
                  src="/images/stripe.webp"
                  alt="Stripe"
                  height={40}
                  width={20}
                  sizes='20'
                />
              </a>
              <div className="flex items-center text-gray-600">
                <CreditCard className="h-3 w-3 mr-1 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        <br /><br />


        <div className="mt-8 w-full">
          <h2 className="text-2xl font-bold -mb-2 text-center text-white bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 p-8 rounded-t-xl">Description du produit</h2>
          <div className="border-b-8 border-white w-full max-w-[50rem] my-3 h-3 slide-in-right mx-auto -mt-1"></div>
            <p className='font-serif font-normal text-center mt-8 px-8'>
            {product.description && product.short_description
              ? formatDescription(product.description.length > product.short_description.length ? product.description : product.short_description)
              : formatDescription(product.description || product.short_description || '')}
            </p>
          <br />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4 md:px-10">
            {/* Grille d'informations produit */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-teal-800 text-left">Cépages</h3>
              <p className="text-sm text-right">
                {product.cepages ? joinIfArray(product.cepages) : 'Pas de cépages renseignés'}
              </p>
              </div>
            </div>

            {/* Style */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-800 text-left">Style</h3>
                <p className="text-sm text-right">
                  {typeof product.style === 'string'
                    ? product.style.charAt(0).toUpperCase() + product.style.slice(1).toLowerCase()
                    : 'Pas de style renseigné'}
                </p>
              </div>
            </div>

            {/* Accords mets et vins */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-800 text-left">Accords mets et vins</h3>
                <p className="text-sm text-right">
                  {product.accord_mets ? joinIfArray(product.accord_mets) : 'Pas d\'accords renseignés'}
                </p>
              </div>
            </div>

            {/* Degré d'alcool */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-800 text-left">Degré d&apos;alcool</h3>
                <p className="text-sm text-right">
                    {product.degre == 0 ? 'Non communiqué' : `${product.degre}%`}
                </p>
              </div>
            </div>

            {/* Dégustation */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-800 text-left">Dégustation</h3>
                <p className="text-sm text-right">
                  {product.degustation || 'Pas de note de dégustation'}
                </p>
              </div>
            </div>

            {/* Sans Sulfite */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-800 text-left">Sulfites</h3>
                <p className="text-sm text-right">
                  {product.sans_sulfites_ === 'oui' ? 'Sans sulfites ajoutés' : 'Contient des sulfites'}
                </p>
              </div>
            </div>
          </div>
          <br />
          <br />
          <Livraison />
          <br />
          <br />
           {/* Affichage de la carte Google */}
           {product.region__pays && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold -mb-2 text-center text-white bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 p-8 rounded-t-xl">Localisation du vigneron</h2>
              <iframe
                src={getGoogleMapUrl(product.nom_chateau || '')}
                width="100%"
                height="400"
                style={{ border: 'none' }}
                aria-hidden="false"
                tabIndex={0}
                title="Google Map"
                className="w-full rounded-lg shadow-md"
              ></iframe>
            </div>
          )}
          <br /><br />
          <h2 className="text-2xl font-bold -mb-2 text-center text-white bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 p-8 rounded-t-xl">Avis clients</h2>
          <ProductReviews productId={product.id.toString()} />

          <br />

          <br />
          <Image
            src="/images/bannereco2.png"
            alt="Bannière écologique"
            width={800}
            height={800}
            className="w-fit flex mx-auto" // Ajuste la hauteur si nécessaire
          />

        </div>
      </div>
    </div>
    </>
  );
};

export default ProductPage;
