'use client'; // Ajoutez cette ligne en haut du fichier

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Package } from 'lucide-react';
import Livraison from '@/components/Livraison';

interface Product {
  id: number;
  name: string;
  price: number;
  volume: string;
  region__pays?: string;
  appelation?: string;
  description?: string;
  images: { src: string }[];
  rating?: number;
  rating_count?: number;
  vendor?: {
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
      return { src: '/images/logobio.webp', width: 24, height: 24 };
    case 'demeter':
    case 'biodynamie':
      return { src: '/images/biodemeter.png', width: 80, height: 80 };
    case 'en conversion':
      return { src: '/images/enconv.png', width: 28, height: 28 };
    default:
      return { src: '', width: 0, height: 0 };
  }
};

const getCategoryColor = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'rouge':
      return 'bg-red-800';
    case 'blanc':
      return 'bg-yellow-500';
    case 'rosé':
      return 'bg-pink-400';
    case 'pétillant':
      return 'bg-blue-400';
    case 'liquoreux':
      return 'bg-purple-400';
    default:
      return 'bg-orange-500';
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
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0); // Remonter en haut de l'écran après le chargement
    }
  }, [loading]);

  const renderStars = (rating: number) => (
    <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="loader"></div>
          <p className="text-orange-600 font-bold text-lg">Chargement des vins de Mémé...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-bold text-lg">Erreur : {error}</p>
        <button onClick={() => location.reload()} className="mt-4 bg-orange-600 text-white px-4 py-2 rounded">
          Réessayer
        </button>
      </div>
    );
  }

  if (!product) return null;

  const isMobile = window.innerWidth <= 768;


  return (
    <div className={`mt-0 :mt-[5rem] md:px-16 sm:px-8 lg:px-16`}>

      <div className="relative top-0 left-0 w-full">
      </div>
      <br /><br />
      <br /><br />
      <div className="max-w-6xl mx-auto px-8 sm:px-6 lg:px-8 py-8 min-h-screen">
        <nav aria-label="Breadcrumb" className="text-sm mb-4">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="/" className="text-gray-500 hover:text-gray-700">Accueil</a>
              <span className="mx-2 text-gray-500">&gt;</span>
            </li>
            <li className="flex items-center">
              <a href="#" className="text-green-600 hover:text-gray-700">{product.store_name}</a>
              <span className="mx-2 text-gray-500">&gt;</span>
            </li>
            <li className="flex items-center">
              <span className="text-orange-600" aria-current="page">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mx-auto">
          <div className="md:w-1/2">
            <div className="flex items-start z-10">
              {product.categories.map((category) => (
                <div
                  key={category.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(category.name)}`}
                  title={category.name} // Affiche le nom de la catégorie au survol
                >
                  <span className="text-white font-semibold text-sm">{category.name.substring(0, 3)}</span>
                </div>
              ))}
              <p className="ml-4 text-sm mb-4">
                {product.certification ? (
                  <Image
                    {...getCertificationLogo(product.certification)}
                    alt="Certification logo"
                    width={30}
                    height={30}
                  />
                ) : (
                  'Non renseignée'
                )}
              </p>
            </div>
            <Image
              src={product.images && product.images.length > 0 ? product.images[0].src : '/images/vinmémé.png'}
              alt={product.name}
              width={300}
              height={500}
              objectFit="cover"
              className="rounded-lg"
              loading="lazy"
            />
          </div>

          <div className="md:w-1/2">
            <p className="text-sm font-bold">{product.nom_chateau || 'Château inconnu'}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mb-2">
              {product.rating && renderStars(product.rating)}
              <span className="ml-2 text-sm text-gray-500">
                ({product.rating_count} avis)
              </span>
            </div>
            <br />
            <p className="text-4xl font-bold !mb-7">
              <span className="flex items-start z-10">
                <span className="text-4xl font-bold">{Math.floor(product.price)}</span>
                <span className="text-xl font-bold align-top mt-1">
                  <sup>€{(product.price % 1).toFixed(2).substring(2)}</sup>
                </span>
              </span>
            </p>
            <span className="text-xs font-normal">Bouteille de {product.volume}</span>
            <p>
              {product.appelation?.toUpperCase()} | {product.region__pays?.toUpperCase()}
            </p>
            <p className="text-sm font-normal">Vendu par <span className="text-green-600">{product.store_name || 'Mémé Georgette'}</span></p>

            <br />
            <div className="items-center mt-6 flex gap-2">
              <Package className="h-6 w-6" />
              <span className="font-bold text-xs">Livraison offerte dès 6 bouteilles achetées sur un domaine</span>
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
              <button
                onClick={() => console.log(`Ajouté ${quantity} ${product.name} au panier`)}
                className="bg-orange-600 hover:bg-orange-500 text-white py-2 px-4 rounded"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold !-mb-2">Description du produit</h2>
          <div className="border-b-4 border-orange-600 w-[20rem] md:w-[50rem] my-2 md:my-2 slide-in-right"></div>
          <p className='font-bold'>
            {product.description ? formatDescription(product.description) : 'Pas de description disponible.'}
          </p>
          <br />
          {/* Grille de 2 colonnes plus compact */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2  md:w-[20rem] px-10">
            {/* Cépages */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center px-10">
                <h3 className="text-lg font-bold text-orange-600 text-left">Cépages</h3>
                <p className="text-sm text-right">
                  {product.cepages ? joinIfArray(product.cepages) : 'Pas de cépages renseignés'}
                </p>
              </div>
            </div>

            {/* Style */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-orange-600 text-left">Style</h3>
                <p className="text-sm text-right">
                  {typeof product.style === 'string'
                    ? product.style.charAt(0).toUpperCase() + product.style.slice(1).toLowerCase()
                    : 'Pas de style renseigné'}
                </p>
              </div>
            </div>

            {/* Accords mets et vins */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-orange-600 text-left">Accords mets</h3>
                <p className="text-sm text-right">
                  {product.accord_mets? joinIfArray(product.accord_mets) : 'Pas d\'accords mets renseignés'}
                </p>
              </div>
            </div>

            {/* Conservation */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-orange-600 text-left">Conservation</h3>
                <p className="text-sm text-right">
                  {product.conservation ? product.conservation : 'Pas d\'informations de conservation'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <video
          src="/videos/minibanner.mp4"
          width={1920}
          height={400}
          autoPlay
          loop
          muted
          playsInline
          className={`hidden md:block w-full h-[${isMobile ? '400px' : '500px'}] object-cover`}

        >
          Your browser does not support the video tag.
        </video>
        <Image
          src="/images/bannereco2.png"
          alt="Bannière écologique"
          width={1920}
          height={400}
          objectFit="cover"

        />
        <Livraison />
      </div>
    </div>
  );
};

export default ProductPage;
