import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaMapMarkerAlt, FaWineBottle, FaLeaf, FaSeedling } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: string;
  certification?: string;
  region__pays?: string;
  store_name?: string;
  vendor_image?: string;
  categories?: { name: string }[];
}

interface Vendor {
  store_name: string;
  products: Product[];
  vendor_image?: string;
  region__pays?: string;
  certifications: {
    bio: number;
    biodynamie: number;
    conversion: number;
  };
  categories: string[];
}

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getVendorBackground = (vendor: Vendor) => {
    if (vendor.certifications.biodynamie > 0) {
      return 'bg-gradient-to-br from-purple-700 to-purple-900';
    }
    if (vendor.certifications.bio > 0) {
      return 'bg-gradient-to-r from-teal-500 to-teal-700';
    }
    if (vendor.certifications.conversion > 0) {
      return 'bg-gradient-to-br from-amber-600 to-amber-800';
    }
    return 'bg-gradient-to-br from-gray-700 to-gray-900';
  };

  const getCertificationIcon = (vendor: Vendor) => {
    if (vendor.certifications.biodynamie > 0) {
      return <FaSeedling className="w-4 h-4" title="Biodynamie" />;
    }
    if (vendor.certifications.bio > 0) {
      return <FaLeaf className="w-4 h-4" title="Bio" />;
    }
    if (vendor.certifications.conversion > 0) {
      return <FaSeedling className="w-4 h-4 opacity-50" title="En conversion" />;
    }
    return null;
  };

  const getDominantCategory = (vendor: Vendor) => {
    const categoryCount: { [key: string]: number } = {};

    vendor.products.forEach(product => {
      product.categories?.forEach(category => {
        categoryCount[category.name] = (categoryCount[category.name] || 0) + 1;
      });
    });

    const dominantCategory = Object.entries(categoryCount).reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0]);

    return dominantCategory[0] || "aucune catégorie"; // Renvoie la catégorie dominante ou une valeur par défaut
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('/api/products');
        const products: Product[] = response.data;

        const vendorMap: { [key: string]: Vendor } = {};

        products.forEach((product) => {
          const storeName = product.store_name || '@MéméGeorgette';

          if (!vendorMap[storeName]) {
            vendorMap[storeName] = {
              store_name: storeName,
              products: [],
              vendor_image: product.vendor_image,
              region__pays: product.region__pays,
              certifications: {
                bio: 0,
                biodynamie: 0,
                conversion: 0
              },
              categories: []
            };
          }

          vendorMap[storeName].products.push(product);

          if (product.certification) {
            const certLower = product.certification.toLowerCase();
            if (certLower.includes('biodynamie')) {
              vendorMap[storeName].certifications.biodynamie++;
            } else if (certLower.includes('bio')) {
              vendorMap[storeName].certifications.bio++;
            } else if (certLower.includes('conversion')) {
              vendorMap[storeName].certifications.conversion++;
            }
          }

          if (product.categories) {
            vendorMap[storeName].categories.push(...product.categories.map(cat => cat.name));
          }
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

  // Gérer l'état de chargement et d'erreur
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
          <p className="font-semibold">Chargement des vignerons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4 text-center">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <h2 className="flex items-center justify-center text-xl font-bold mb-6 text-center">
        <div className="border-t border-black w-1/4" />
        <span className="mx-4">Les Domaines & Vignerons</span>
        <div className="border-t border-black w-1/4" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div
            key={vendor.store_name}
            className="relative overflow-hidden rounded-xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            onClick={() => router.push(`/vendor/${vendor.store_name}`)}
          >
            <div className={`relative h-80 p-4 md:p-6 ${getVendorBackground(vendor)}`}>
              <div className="absolute top-4 right-4 text-white">
                {getCertificationIcon(vendor)}
              </div>
              <div className="absolute top-4 left-4 text-white text-2xl">
                <FaWineBottle />
              </div>
              <div className="mt-4 mb-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-4 relative rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={vendor.vendor_image || '/images/meme-pas-contente.png'}
                    alt={vendor.store_name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full bg-white"
                  />
                </div>
                <h3 className="text-lg md:text-2xl font-bold mb-2 text-white text-center">
                  {vendor.store_name}
                </h3>
                {vendor.region__pays && (
                  <p className="text-xs md:text-sm text-white flex items-center justify-center mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    {vendor.region__pays.charAt(0).toUpperCase() + vendor.region__pays.slice(1)}
                  </p>
                )}
                <p className="text-xs md:text-sm text-white/90 text-center mb-2">
                  {vendor.store_name}, vigneron de {vendor.region__pays ? vendor.region__pays.charAt(0).toUpperCase() + vendor.region__pays.slice(1) : 'région inconnue'}, propose majoritairement des vins {getDominantCategory(vendor)}.
                </p>
                <div className="text-center mt-auto">
                  <span className="inline-block bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-lg">
                    {vendor.products.length} vins disponibles
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;
