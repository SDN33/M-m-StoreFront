// app/products/category/rouge/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const RougePage = () => {
  interface Product {
    id: number;
    vendor_image: string;
    name: string;
    price: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?type=products&category=rouge'); // Modifiez l'URL si nécessaire
        if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Nos Vins Rouges</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <p>Aucun produit trouvé dans cette catégorie.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border rounded p-4">
              <Image
                src={product.vendor_image || '/images/noimage/large.png'}
                alt={product.name}
                width={200}
                height={300}
                className="w-full h-auto"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.price} €</p>
              <a href={`/products/${product.id}`} className="text-blue-500 hover:underline">
                Voir le produit
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RougePage;
