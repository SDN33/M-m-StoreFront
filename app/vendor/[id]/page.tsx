'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Wine, MapPin, Star, Award } from 'lucide-react';
import Image from 'next/image';

// Composants de base personnalisés
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-orange-100 text-orange-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    outline: "border border-orange-600 text-orange-600",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Separator = () => (
  <div className="h-px w-full bg-gray-200 my-2" />
);

interface Product {
  id: number;
  name: string;
  price: string;
  store_name?: string;
  vendor_image?: string;
  images?: { id: number; src: string; alt?: string }[];
  certification?: string;
  nom_chateau?: string;
  description?: string;
  region__pays?: string;
  rating?: number;
}

const VendorPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const store_name = searchParams ? searchParams.get('store_name') : null;

  useEffect(() => {
    const fetchProducts = async () => {
      // Vérifier si les produits sont déjà en cache
      const cachedProducts = localStorage.getItem('products');
      if (cachedProducts) {
        const allProducts: Product[] = JSON.parse(cachedProducts);
        const filteredProducts = store_name
          ? allProducts.filter(product => product.store_name === store_name)
          : allProducts.filter(product => !product.store_name);
        setProducts(filteredProducts);
        setLoading(false); // On ne charge pas
        return;
      }

      // Si pas en cache, faire l'appel API
      try {
        const response = await fetch('/api/products');
        const allProducts: Product[] = await response.json();

        // Mettre en cache les produits
        localStorage.setItem('products', JSON.stringify(allProducts));

        const filteredProducts = store_name
          ? allProducts.filter(product => product.store_name === store_name)
          : allProducts.filter(product => !product.store_name);
        setProducts(filteredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des produits.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [store_name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wine className="w-12 h-12 text-orange-600 mx-auto" />
          <p className="text-lg font-semibold animate-bounce text-orange-600">Le vigneron prépare sa sélection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStars = (rating: number = 4.8) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <br /><br />
      <br /><br />
      <video
        src="/videos/minibanner.mp4"
        title="Banner vignes"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full"
      ></video>
      {/* En-tête du Vendeur */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-8 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-orange-800">
              {store_name || "La Sélection de Mémé Georgette"}
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{products[0]?.region__pays?.toUpperCase() || ''}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{products.length}</div>
              <div className="text-sm text-gray-600">Vins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4.8</div>
              <div className="flex items-center">
                {renderStars(4.8)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille des Produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id} className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-48">
              <Image
                src={product.images?.[0]?.src || '/images/vinmémé.png'}
                alt={product.name}
                className="object-cover rounded-t-lg"
                style={{ objectFit: 'cover' }}
                width={50}
                height={30}
              />
              {product.certification && (
                <Badge variant="success" className="absolute top-2 right-2">
                  <Award className="w-4 h-4 mr-1" />
                  {product.certification}
                </Badge>
              )}
            </div>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{product.nom_chateau}</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-orange-600">
                  {parseFloat(product.price).toFixed(2)}€
                </span>
                <Badge variant="outline" className='p-2 b-2'>
                  {product.region__pays || ''}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="p-12 text-center">
          <Wine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            Aucun vin disponible pour le moment
          </h3>
          <p className="text-gray-500 mt-2">
            Revenez plus tard pour découvrir notre sélection
          </p>
        </Card>
      )}
    </div>
  );
};

export default VendorPage;
