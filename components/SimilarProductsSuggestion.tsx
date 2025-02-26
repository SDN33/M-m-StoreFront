import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  images: { src: string }[];
  store_name?: string;
  categories: { id: number; name: string }[];
  average_rating?: number;
}


interface SimilarProductsProps {
  currentProduct: Product;
  allProducts: Product[];
  productId: string;

}

const SimilarProductsSuggestion: React.FC<SimilarProductsProps> = ({
  currentProduct,
  allProducts
}) => {
  const [similarByDomain, setSimilarByDomain] = useState<Product[]>([]);

  useEffect(() => {
    // Filter similar products by domain (store_name)
    const domainSimilars = allProducts
      .filter(p =>
        p.store_name === currentProduct.store_name &&
        p.id !== currentProduct.id
      )
      .sort(() => 0.5 - Math.random()) // Randomize order
      .slice(0, 4);
    setSimilarByDomain(domainSimilars);
  }, [currentProduct, allProducts]);

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Link
      href={`/produits/${product.id}`}
      className="block bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative w-full aspect-square mb-2">
        <img
          src={product.images?.[0]?.src || '/images/vinmeme.png'}
          alt={product.name}
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-sm font-semibold truncate mt-2">{product.name}</h3>
      <p className="text-xs text-gray-500 truncate">{product.store_name}</p>
      <p className="text-xs text-gray-500 truncate">{product.categories[0]?.name}</p>
      <div className="flex justify-between items-center mt-1">
        <p className="text-sm font-bold">{Number(product.price)?.toFixed(2) ?? 0}€</p>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(product.average_rating || 0)
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </Link>
  );

  // Only render if there are similar products
  if (similarByDomain.length === 0) {
    return null;
  }

  return (
    <div className="-mt-8">
      <div className='border-t border-gray-200 mb-8 border-4 rounded-xl'></div>
      {similarByDomain.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-left">
            Autres vins du domaine
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4">
            {similarByDomain.map(product => (
              <div key={product.id} className="scale-75 transform origin-top">
              <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimilarProductsSuggestion;
