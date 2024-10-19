'use client'; // Assurez-vous que cela est en haut pour le rendu côté client

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  categories: { id: number; name: string }[];
  price: number;
  date_added: string;
  images: { src: string }[];
  millesime?: string;
  certification?: string;
  region__pays?: string;
  store_name?: string;
  volume: string;
  vendor?: {
    vendorPhotoUrl?: string;
  };
  appelation?: string;
  nom_chateau?: string;
  rating?: number;
  rating_count?: number;
  description?: string;
}

const handleAddToCart = (quantity: number, product: Product) => {
  console.log(`Added ${quantity} of ${product.name} to the cart.`);
};

const ProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params ? params.id : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // État pour la quantité

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
      const fetchProduct = async () => {
        try {
          const productData = await fetchProductById(Number(id));
          setProduct(productData);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Fonction pour afficher les étoiles
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-5 w-5 ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`} />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-600">
      <div className="max-w-4xl w-full mx-4 p-6 bg-white rounded-lg shadow-lg mt-12">
        {loading ? (
          <div className="flex flex-col items-center mt-10">
            <div className="loader"></div>
            <p className="text-orange-600 font-bold text-lg mt-4">Chargement du vin de Mémé...</p>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : !product ? (
          <p className="text-center">Produit introuvable</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Colonne texte à gauche */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-xl text-orange-600 mb-2">
                <span className="font-bold">{product.price} € | <em className="font-extralight text-sm">{product.volume}</em></span>
              </p>
              <p className="text-gray-600 mb-2">Château: <span className="font-bold text-black">{product.nom_chateau}</span></p>
              <p className="text-gray-600 mb-2">Millesime: <span className="font-bold text-black">{product.millesime}</span></p>
              <p className="text-gray-600 mb-2">Certification: <span className="font-bold text-black">{product.certification?.toUpperCase()}</span></p>
              <p className="text-gray-600 mb-2">Région: <span className="font-bold text-black">{product.region__pays?.toUpperCase()}</span></p>
              <p className="text-gray-600 mb-2">Appellation: <span className="font-bold text-black">{product.appelation ? product.appelation.toUpperCase() : ''}</span></p>
              <p className="text-gray-600 mb-2">Vendu par: <span className="font-bold text-black">{product.store_name}</span></p>
              {product.rating && product.rating_count ? (
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-gray-600">({product.rating_count} avis)</span>
                </div>
              ) : null}
            </div>

            {/* Colonne image à droite */}
            <div className="flex justify-center md:w-1/2">
              {product.images.length > 0 && (
                <div className="relative w-full h-96">
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    width={250}
                    height={250}
                    objectFit="cover" // Aligné sur le style des cartes
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description en dessous de la carte */}
        {product?.description && (
          <div className="text-gray-700 mt-6">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>
        )}

        {/* Sélecteur de quantité et bouton de commande */}
        <div className="flex items-center mt-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-orange-600 rounded-md p-2 w-16 mr-2"
          />
          <button
            onClick={() => handleAddToCart(quantity, product!)}
            className="bg-orange-600 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:bg-orange-700 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Commander
          </button>
        </div>
        <button
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition duration-200 mt-2"
          onClick={() => router.back()}
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
