import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  nom_du_chateau?: string; // Cette propriété pour le nom du château
  millesime?: string; // Ajoutez cette ligne pour le millésime
  certification?: string;
  store_name?: string;
  vendor_image?: string;
  images?: { id: number; src: string; alt?: string }[];
  meta_data: { key: string; value: string | string[] }[];
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
  const vendorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('/api/products');
        const products: Product[] = response.data;

        const vendorMap: { [key: string]: Vendor } = {};
        products.forEach((product) => {
          if (product.meta_data) {
            const chateauMeta = product.meta_data.find(meta => meta.key === 'nom_chateau');
            if (chateauMeta) {
              product.nom_du_chateau = chateauMeta.value as string;
            }
          }

          const storeName = product.store_name || '@MéméGeorgette';
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

  const handleScrollLeft = () => {
    if (vendorContainerRef.current) {
      vendorContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (vendorContainerRef.current) {
      vendorContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (error) {
    return <div className="p-6">{error}</div>;
  }

  const getCertificationLogo = (certification?: string) => {
    switch (certification?.toLowerCase()) {
      case 'bio':
        return { src: "/images/logobio.webp", width: 15, height: 15 };
      case 'demeter':
      case 'biodynamie':
        return { src: "/images/biodemeter.png", width: 50, height: 50 };
      case 'en conversion':
        return { src: '/images/enconv.png', width: 20, height: 20 };
      default:
        return { src: '', width: 0, height: 0 };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl md:text-3xl font-extrabold text-orange-600 tracking-tight mx-16 text-center">
        Nos Vignerons Partenaires
      </h2>

      {vendors.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-500">Aucun vendeur disponible.</p>
        </div>
      ) : (
        <div className="relative mx-auto max-w-2xl">
          <button onClick={handleScrollLeft} className="absolute -left-5 top-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white px-4 py-2 rounded-full">←</button>

          <div ref={vendorContainerRef} className="flex overflow-x-auto space-x-6">
            {vendors.map((vendor) => (
              <div key={vendor.store_name} className="bg-orange-600 border-black shadow rounded-lg w-80">
                <div className="p-4 bg-gray-50 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 border-4 border-white rounded-full overflow-hidden">
                      <img src={vendor.vendor_image || '/images/mémé-georgette1.png'} alt={vendor.store_name} />
                    </div>
                    <h2 className="text-lg font-bold">{vendor.store_name}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-black mb-4 text-white">Derniers vins ajoutés:</h3>
                  {vendor.products.length === 0 ? (
                    <p className="text-gray-400">Aucuns vins disponibles.</p>
                  ) : (
                    <ul className="space-y-2">
                      {vendor.products.slice(0, 4).map((product) => (
                        <li key={product.id} className="p-2 bg-gray-50 rounded-lg flex justify-between">
                          <div className="flex items-center space-x-3">
                            {product.images?.[0] && (
                              <img src={product.images[0].src} alt={product.name} className="w-10 h-10 object-cover" />
                            )}
                            <div>
                              <h4 className="font-semibold">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.nom_du_chateau}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded-full">
                            {parseFloat(product.price).toFixed(2)} €
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {vendor.products.length > 4 && (
                    <div className="mt-4 text-right">
                      <button className="text-sm bg-white text-orange-600 font-semibold border-orange-600 border px-2 py-1 rounded-full">
                        Voir plus
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleScrollRight} className="absolute -right-5 top-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white px-4 py-2 rounded-full">→</button>
        </div>
      )}
    </div>
  );
};

export default VendorList;
