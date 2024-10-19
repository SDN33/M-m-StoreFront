'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Truck, Package } from 'lucide-react';

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
    name?: string;
    vendorPhotoUrl?: string;
  };
  categories: { id: number; name: string }[];
  accords_mets?: string;
}

const getCategoryColor = (categoryName: string): string => {
  switch (categoryName.toLowerCase()) {
    case 'red':
      return 'bg-red-500';
    case 'white':
      return 'bg-yellow-500';
    case 'rose':
      return 'bg-pink-500';
    default:
      return 'bg-gray-500';
  }
};

const ProductPage: React.FC = () => {
  const params = useParams();
  const id = params ? params.id : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Scroll to top after loading
  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  useEffect(() => {
    const fetchProductById = async (id: number): Promise<Product> => {
      const response = await fetch(`/api/products?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      return data.find((product: Product) => product.id === id);
    };

    if (id) {
      fetchProductById(Number(id))
        .then(setProduct)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Loader
  if (loading) {
    return (
      <div className="flex-grow mt-10 flex items-center justify-center h-screen" style={{ marginTop: '18rem' }}>
        <div className="flex flex-col items-center">
          <div className="loader"></div>
          <p className="text-orange-600 font-bold text-lg" >Chargement des vins de Mémé...</p>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 min-h-screen" style={{ marginTop: '8rem' }}>
      <nav className="text-sm mb-4">
        <a href="/" className="text-gray-500 hover:text-gray-700">Accueil</a>
        <span className="mx-2 text-gray-500">&gt;</span>
        <a href="#" className="text-gray-500 hover:text-gray-700">{product.vendor?.name}</a>
        <span className="mx-2 text-gray-500">&gt;</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Image
            src={product.images && product.images.length > 0 ? product.images[0].src : '/images/vinmémé.png'}
            alt={product.name}
            width={300}
            height={500}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            {product.rating && renderStars(product.rating)}
            <span className="ml-2 text-sm text-gray-500">
              ({product.rating_count} avis)
            </span>
          </div>

          <p className="text-3xl font-bold mb-4">
            {product.price}€
            <span className="text-sm font-normal ml-2">Bouteille de {product.volume}</span>
          </p>
          {product.categories.map(category => (
            <div key={category.id} className={`${getCategoryColor(category.name)}`}>
              <span className=" border-black font-semibold">Vin {category.name}</span>
              <p className="text-sm font-normal">{product.appelation?.toUpperCase()} | {product.region__pays?.toUpperCase()}</p>
              <p className="text-sm font-normal mb-8">Vendu par {product.vendor?.name || 'Mémé Georgette'}</p>
            </div>

          ))}
          {product.description && (
            <p className="mt-8">
              {product.description.replace(/<\/?[^>]+(>|$)/g, '')}
            </p>
          )}
          <br />
          <p className="text-sm font-semibold">Accords Mets & Vin</p>
          <p className="text-sm">{product.accords_mets || 'Accords non renseignés'}</p>
          <br />
          <div className="flex items-center mb-6">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mr-4 p-2 border rounded bg-primary"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-800 transition">
              Ajouter au panier
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              <span>Livraison offerte en France dès 6 bouteilles par domaine</span>
            </div>
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              <span>Commande expédiée en 48h</span>
            </div>
          </div>

          {product.vendor && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2 text-primary">Le mot du Vigneron</h3>
              <div className="flex items-center">
                {product.vendor.vendorPhotoUrl && (
                  <Image
                    src={product.vendor.vendorPhotoUrl}
                    alt={product.vendor.name || 'Vigneron'}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                )}
                <p>{product.vendor.name || 'Vigneron inconnu (Mémé Georgette)'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Les avis</h2>
        {/* Section pour afficher les avis */}
      </div>
    </div>
  );
};

export default ProductPage;
