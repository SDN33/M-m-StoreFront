'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  description?: string; // Ajout de la description
}

const ProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params ? params.id : null; // Assurez-vous que l'id est disponible dans l'URL

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;
  if (!product) return <div className="text-center">Product not found</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-600">
      <div className="max-w-2xl w-full mx-4 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">{product.name}</h1>
        {product.images.length > 0 && (
          <img
            src={product.images[0].src}
            alt={product.name}
            className="w-full h-auto rounded-md mb-4"
          />
        )}
        <p className="text-xl text-orange-600 mb-2"><span className="font-bold">{product.price} € |  <em className='font-extralight text-sm'>{product.volume}</em></span></p>
        <p className="text-gray-600 mb-2">Vendu par: <span className='font-bold text-black'>{product.store_name}</span></p>
        <p className="text-gray-600 mb-2">Millesime: <span className='font-bold text-black'>{product.millesime}</span></p>
        <p className="text-gray-600 mb-2">Certification: {product.certification}</p>
        <p className="text-gray-600 mb-2">Region: {product.region__pays}</p>
        <p className="text-gray-600 mb-2">Appellation: {product.appelation}</p>
        <p className="text-gray-600 mb-2">Château: {product.nom_chateau}</p>
        {product.rating && product.rating_count ? (
          <p className="text-gray-600 mb-2">Rating: {product.rating} ({product.rating_count} avis)</p>
        ) : null}
        {product.description && (
          <div className="text-gray-700 mb-6">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            Commander
          </button>
          <button
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
            onClick={() => router.back()}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
