"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import AddToCart from './AddToCartButton';

interface Product {
  id: number;
  name: string;
  price: number;
  categories: { id: number; name: string }[];
  certification?: string;
  images: { src: string }[];
  vendor?: { vendorPhotoUrl?: string; name?: string };
  store_name?: string;
  nom_chateau?: string;
  appelation?: string;
  millesime?: string;
  region__pays?: string;
  volume?: string;
  rating_count?: number;
  average_rating?: number;
  style?: string;
  cepages?: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number, variationId: number) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [variationId] = useState<number>(product.id);

  const cacheProductData = (product: Product) => {
    const cachedProducts = JSON.parse(localStorage.getItem('cachedProducts') || '{}');
    cachedProducts[product.id] = product;
    localStorage.setItem('cachedProducts', JSON.stringify(cachedProducts));
    console.log('Produit mis en cache:', product);
  };

  const getCachedProductData = (productId: number): Product | null => {
    const cachedProducts = JSON.parse(localStorage.getItem('cachedProducts') || '{}');
    console.log('Récupération des données du produit:', cachedProducts[productId]);
    return cachedProducts[productId] || null;
  };

  const handleRedirect = () => {
    console.log('Redirection vers le produit:', product.id);
    const cachedProduct = getCachedProductData(product.id);
    if (!cachedProduct) {
      cacheProductData(product);
    }
    router.push(`/product/${product.id}`);
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'rouge': return 'bg-red-800';
      case 'blanc': return 'bg-yellow-500';
      case 'rosé': return 'bg-pink-400';
      case 'pétillant': return 'bg-yellow-200';
      case 'liquoreux': return 'bg-amber-600';
      default: return 'bg-orange-600';
    }
  };

  const getCertificationLogo = (certification?: string) => {
    switch (certification?.toLowerCase()) {
      case 'bio': return { src: "/images/logobio.webp", width: 24, height: 24 };
      case 'demeter':
      case 'biodynamie': return { src: "/images/biodemeter.png", width: 80, height: 80 };
      case 'en conversion': return { src: '/images/enconv.png', width: 28, height: 28 };
      default: return { src: '', width: 0, height: 0 };
    }
  };

  const formatVendorName = (storeName?: string) => {
    if (!storeName) return '@M.Georgette';
    const words = storeName.split(' ');
    if (words.length > 1) {
      const firstNameInitial = words[0].charAt(0).toUpperCase();
      const lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1);
      return `${firstNameInitial}. ${lastName}`;
    }
    return storeName;
  };

  const certificationLogo = getCertificationLogo(product.certification);

  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col" style={{ height: '490px', width: '100%' }}>
      {/* Affichage des couleurs de catégories */}
      <div className={`h-2 ${getCategoryColor(product.categories[0]?.name || 'default')} mb-4`}></div>

      <div className="flex justify-between items-start z-10">
        <div className="flex space-x-1">
          {product.categories.map(category => (
            <div key={category.id} className={`w-10 h-10 rounded-full ${getCategoryColor(category.name)} flex items-center justify-center`}>
              <span className="text-white border-black font-semibold sloganhero text-sm">{category.name.substring(0, 3)}</span>
            </div>
          ))}
          {product.certification && (
            <div className="flex items-center justify-center z-10">
              <Image
                src={certificationLogo.src}
                alt={product.certification}
                width={certificationLogo.width}
                height={certificationLogo.height}
              />
            </div>
          )}
        </div>
        <span className="flex items-start z-10">
          <span className="text-4xl font-bold">{Math.floor(product.price)}</span>
          <span className="text-xl font-bold align-top mt-1">
            <sup>€{(product.price % 1).toFixed(2).substring(2)}</sup>
          </span>
        </span>
      </div>

      <div className="relative w-full h-72 mb-4">
        <Image
          src={product.images.length > 0 ? product.images[0].src : '/images/vinmémé.png'}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          priority
          onClick={handleRedirect}
          className="hover:scale-110 transition-transform cursor-pointer"
        />

        <div className="absolute bottom-6 right-2 md:right-6 flex flex-col items-center">
          <div className="relative w-12 h-12 mb-1 hover:scale-110 transition-transform">
            <Image
              src={product.vendor?.vendorPhotoUrl || '/images/mémé-georgette1.png'}
              alt={formatVendorName(product.store_name)}
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          </div>
          <span className="text-[0.5rem] font-bold text-center text-green-600">
            {formatVendorName(product.store_name)}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-black hover:underline cursor-pointer" onClick={handleRedirect}>
        {product.name}
      </h3>

      <p className="text-sm font-bold hover:underline cursor-pointer" onClick={handleRedirect}>
        {product.nom_chateau || "Château inconnu"}
      </p>

      <p className="text-sm mb-1 font-bold">
        {product.appelation?.toUpperCase() || 'Vigneron inconnu'}
      </p>
      <div className="flex items-center mb-2 mx-auto">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} />
        ))}
        <span className="text-xs text-gray-600 ml-1">({product.rating_count || 0} avis)</span>
      </div>
      <p className="text-sm mb-2">
        {product.region__pays?.toUpperCase()} | {product.millesime} | {product.volume}
      </p>
      <div className="flex-grow"></div>
      <div className="flex items-center mx-auto">
        <div className="relative mr-2">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="appearance-none bg-gray-100 border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        <AddToCart
          productId={product.id}
          quantity={quantity}
          variation_id={variationId}
          cart_item_data={{}}
          onAddToCart={async () => {
            console.log('Tentative d\'ajout au panier:', { productId: product.id, quantity });
            await onAddToCart(product.id, quantity, variationId);
          }}
        />
      </div>
    </div>
  );
};

export default ProductCard;
