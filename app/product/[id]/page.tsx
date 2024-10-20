'use client'; // Ajoutez cette ligne en haut du fichier

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Truck, Package } from 'lucide-react';
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
  // Retirer les balises HTML
  const plainText = description.replace(/<\/?[^>]+(>|$)/g, '');
  const words = plainText.split(' ');
  let formattedDescription = '';
  let line = '';

  words.forEach(word => {
    if (line.length + word.length + 1 > maxChars) {
      formattedDescription += line.trim() + '\n'; // Ajoute la ligne et un saut de ligne
      line = word + ' '; // Commence une nouvelle ligne avec le mot actuel
    } else {
      line += word + ' '; // Ajoute le mot à la ligne actuelle
    }
  });

  // Ajoute la dernière ligne si elle n'est pas vide
  if (line.trim()) {
    formattedDescription += line.trim();
  }

  return formattedDescription;
};


const getCertificationLogo = (certification?: string) => {
  switch (certification?.toLowerCase()) {
    case 'bio':
      return { src: "/images/logobio.webp", width: 24, height: 24 };
    case 'demeter':
    case 'biodynamie':
      return { src: "/images/biodemeter.png", width: 80, height: 80 };
    case 'en conversion':
      return { src: '/images/enconv.png', width: 28, height: 28 };
    default:
      return { src: '', width: 0, height: 0 };
  }
};

const getCategoryColor = (categoryName: string): string => {
  switch (categoryName.toLowerCase()) {
    case 'red': return 'bg-red-500 text-white';
    case 'white': return 'bg-yellow-500 text-black';
    case 'rose': return 'bg-pink-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
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
        <p className="text-red-600 font-bold text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 py-8 min-h-screen" style={{ marginTop: '5rem' }}>
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
          <p className="text-sm font-bold !-mb-2">{product.nom_chateau || 'Château inconnu'}</p>
          <h1 className="text-3xl font-bold ">{product.name}</h1>
          <p className="text-sm font-bold">{product.appelation?.toUpperCase()} | {product.region__pays?.toUpperCase()}</p>
          {product.categories.map(category => (
            <div key={category.id} className={`${getCategoryColor(category.name)} p-2 rounded-md inline-block mb-2`}>
              <span className="font-semibold text-black">Vin {category.name}</span>
            </div>
          ))}

          <p className="text-sm mb-4">
            {product.certification ? <Image {...getCertificationLogo(product.certification)} alt="Certification logo" /> : 'Non renseignée'}
          </p>
          <p className="text-sm font-normal">Vendu par <span className='text-green-600'>{product.store_name ? product.store_name : 'Mémé Georgette'}</span></p>
          <div className="flex items-center mb-4">
            {product.rating && renderStars(product.rating)}
            <span className="ml-2 text-sm text-gray-500">
              ({product.rating_count} avis)
            </span>
          </div>

          <p className="text-3xl font-bold mb-1">
            {product.price}€
            <span className="text-xs font-normal ml-2">Bouteille de {product.volume}</span>
          </p>
          <div className="flex items-center">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mr-4 p-2 border rounded bg-white"
              aria-label="Sélectionner la quantité"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-800 transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
              Ajouter au panier
            </button>
          </div>

          {/* Saut de ligne ajouté ici */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-orange-600" />
              <span>Livraison rapide</span>
              <Package className="h-4 w-4 text-orange-600" />
              <span>Emballage soigné</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 px-8">
        <h2 className="text-2xl font-bold sm:text-center ml-8">Description du vin</h2>
        <p>par <span className="text-green-600">{product.store_name ? product.store_name : 'Mémé Georgette'}</span></p>
        <hr className="my-2 border-gray-200" />
        <p className="mt-4 text-base font-bold text-gray-700 whitespace-pre-line text-center">{product.description ? formatDescription(product.description) : 'Aucune description disponible.'}</p>
      </div>
      <br /><br />
      <br /><br />
      <Livraison />
      <Image
        src="/images/bannereco2.png"
        alt="Livraison"
        width={1920}
        height={1080}
        layout="responsive"
        loading='lazy'
      />
    </div>
  );
};

export default ProductPage;
