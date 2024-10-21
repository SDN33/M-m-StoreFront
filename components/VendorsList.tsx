import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: string;
  store_name?: string;
  vendor_image?: string;
  images?: string[]; // Modifié pour être un tableau de chaînes
}

interface Vendor {
  store_name: string;
  products: Product[];
  vendor_image?: string;
}

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('/api/products');
        const products: Product[] = response.data;
        const vendorMap: { [key: string]: Vendor } = {};

        products.forEach((product) => {
          const storeName = product.store_name || 'Vendeur Anonyme';
          if (!vendorMap[storeName]) {
            vendorMap[storeName] = {
              store_name: storeName,
              products: [],
              vendor_image: product.vendor_image,
            };
          }
          vendorMap[storeName].products.push(product);
        });

        setVendors(Object.values(vendorMap));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des vendeurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl md:text-3xl font-extrabold text-orange-600 tracking-tight mx-16 text-center">
        Nos Vignerons partenaires
      </h2>
   
      {vendors.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-500">Aucun vendeur disponible.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl overflow-hidden rounded-lg shadow-lg">
          <div className="flex overflow-x-auto space-x-4 p-4">
            {vendors.map((vendor) => (
              <div key={vendor.store_name} className="bg-white shadow rounded-lg flex-none w-60">
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {vendor.vendor_image ? (
                        <img src={vendor.vendor_image} alt={vendor.store_name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold">{vendor.store_name}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">Produits disponibles :</h3>
                  {vendor.products.length === 0 ? (
                    <p className="text-gray-400">Aucun produit disponible.</p>
                  ) : (
                    <ul className="space-y-4">
                      {vendor.products.map((product) => (
                        <li key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {product.images && product.images.length > 0 && (
                              <img
                                src={product.images[0]} // Affiche la première image du produit
                                alt={product.name}
                                className="w-16 h-16 rounded-md object-cover"
                              />
                            )}
                            <div>
                              <h4 className="font-semibold">{product.name}</h4>
                              <p className="text-sm text-gray-600">Prix: {product.price} €</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
                            {parseFloat(product.price).toFixed(2)} €
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <video
          src="/videos/minibanner.mp4"
          title="Banner vignes"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"

          className="w-full h-full"></video>
    </div>
  );
};

export default VendorList;
