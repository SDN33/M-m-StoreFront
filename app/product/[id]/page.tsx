'use client'; // Ajoutez cette ligne en haut du fichier

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Package } from 'lucide-react';
import Livraison from '@/components/Livraison';
import SocialShare from '@/components/Socialshare';
import AddToCartButton from '@/components/AddToCartButton';
import ProductReviews from '@/components/ProductReviews';



interface Product {
  id: number;
  name: string;
  price: number;
  volume: string;
  region__pays?: string;
  appelation?: string;
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
  degustation?: string;
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

const getCertificationLogo = (certification?: string) => {
  switch (certification?.toLowerCase()) {
    case 'bio':
      return { src: '/images/logobio1.webp', width: 24, height: 24 };
    case 'biodynamie':
      return { src: '/images/biodemeter.png', width: 80, height: 80 };
    case 'en conversion':
      return { src: '/images/enconv.png', width: 28, height: 28 };
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

const ProductPage: React.FC = () => {
  const { id } = useParams() as { id: string };
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



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="loader"></div>
          <p className="text-primary font-bold text-lg">Chargement des vins de Mémé...</p>
        </div>
        <br /><br />
        <br /><br />
        <br /><br />
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


  return (
    <div className="mt-20 px-12 min-h-screen flex flex-col justify-between">

      <div className="relative top-0 left-0 w-full">
      </div>
      <br /><br /><br />
      <div className="max-w-6xl mx-auto px-8 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm mb-4">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="text-gray-500 hover:text-gray-700">Accueil</a>
              <span className="mx-2 text-gray-500">&gt;</span>
            </li>
            <li className="flex items-center">
            <a className="cursor-pointer text-teal-500 hover:text-gray-700">
              {product.store_name || ' @MéméGeorgette'}
            </a>
            <span className="mx-2 text-gray-500">&gt;</span>
            </li>
            <li className="flex items-center">
              <span className="text-primary" aria-current="page">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mx-auto">
          <div className="md:w-1/2">
            <div className="flex items-start z-10">
              <p className="ml-4 text-sm">
                {product.certification ? (
                  <Image
                    {...getCertificationLogo(product.certification)}
                    alt="Certification logo"
                    width={product.certification === 'biodynamie' ? 100 : 30} // Plus grand si biodynamie
                    height={product.certification === 'biodynamie' ? 100 : 30} // Plus grand si biodynamie
                  />
                ) : (
                  'Non renseignée'
                )}
              </p>

            </div>
            <Image
              src={product.images && product.images.length > 0 ? product.images[0].src : '/images/vinmeme.png'}
              alt={product.name}
              width={300}
              height={500}
              objectFit="cover"
              className="rounded-lg"
              loading="lazy"
            />
          </div>

          <div className="md:w-1/2">
            <p className="text-sm font-bold flex">{product.nom_chateau || 'Château inconnu'}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-sm font-bold flex mt-1">
              {product.appelation?.toUpperCase()} | {product.region__pays?.toUpperCase()} | {product.millesime}
            </p>
            <div className="flex items-center -mb-6 mx-auto">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
              <span className="text-xs text-gray-600 ml-1">({product.rating_count || 0} avis)</span>
            </div>


            <br />
            <p className="text-5xl font-bold !mb-2 mt-2">
              <span className="flex items-start z-10">
                <span className="text-3xl font-bold">{Math.floor(product.price)}</span>
                <span className="text-xl font-bold align-top mt-1">
                  <sup>€{(product.price % 1).toFixed(2).substring(2)}</sup>
                </span>
              </span>
            </p>
            <span className="text-xs font-normal">Bouteille de {product.volume}</span>
            <br />
            <p className="text-sm font-normal">
              Vendu par
              <a className="cursor-pointer text-teal-500 hover:text-gray-700">
                 <br />{product.store_name || ' @MéméGeorgette'}
              </a>
            </p>


            <br />
            <SocialShare url={currentUrl} title={product.name} />
            <div className="items-center mt-6 flex gap-2">
              <Package className="h-6 w-6 mb-6" />
              <span className="font-bold text-xs mb-6">Livraison offerte dès 6 bouteilles achetées sur un domaine</span>
            </div>
            <div className="flex items-center mt-1">
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mr-4 p-2 border rounded bg-white border-gray-300"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <AddToCartButton
                product={product}
                quantity={quantity}
                productId={product.id}
                onAddToCart={() => {
                  return new Promise<void>((resolve) => {
                    console.log(`Added ${quantity} of product ${product.id} to cart`);
                    resolve();
                  });
                }}
              />
            </div>
          </div>
        </div>
        <br /><br />
        <Livraison />
        <br />
        <div className="mt-8">
          <h2 className="text-2xl font-bold !-mb-2 text-center text-primary">Description du produit</h2>
          <div className="border-b-4 border-primary w-[20rem] md:w-[50rem] my-2 md:my-2 slide-in-right flex mx-auto"></div>
          <p className='font-bold text-center mt-8'>
            {product.description && product.short_description
              ? formatDescription(product.description.length > product.short_description.length ? product.description : product.short_description)
              : formatDescription(product.description || product.short_description || '')}
          </p>
          <br />
          {/* Grille de 2 colonnes plus compact */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 mx-auto px-10">
            {/* Cépages */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-500 text-left">Cépages</h3>
                <p className="text-sm text-right">
                  {product.cepages ? joinIfArray(product.cepages) : 'Pas de cépages renseignés'}
                </p>
              </div>
            </div>

            {/* Style */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-500 text-left">Style</h3>
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
                <h3 className="text-lg font-bold text-teal-500 text-left">Accords mets et vins</h3>
                <p className="text-sm text-right">
                  {product.accord_mets ? joinIfArray(product.accord_mets) : 'Pas d\'accords renseignés'}
                </p>
              </div>
            </div>

            {/* Degré d'alcool */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-500 text-left">Degré d&apos;alcool</h3>
                <p className="text-sm text-right">
                  {product.degre ? `${product.degre}%` : 'Pas de degré renseigné'}
                </p>
              </div>
            </div>

            {/* Dégustation */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-teal-500 text-left">Dégustation</h3>
                <p className="text-sm text-right">
                  {product.degustation || 'Pas de note de dégustation'}
                </p>
              </div>
            </div>
          </div>
          <br />
          <br /><br />
          <h2 className="text-2xl font-bold !-mb-2 text-center text-primary">Avis clients</h2>
          <br /><br />
          <ProductReviews productId={product.id.toString()} />



          <br />
          <br />
          <Image
            src="/images/bannereco2.png"
            alt="Bannière écologique"
            width={1920}
            height={400}
            objectFit="cover"
            className="w-fit flex mx-auto" // Ajuste la hauteur si nécessaire
          />

          <br /><br />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
