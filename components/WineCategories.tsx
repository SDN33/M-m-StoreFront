'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaMapMarkerAlt, FaWineBottle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: string;
  certification?: string;
  region__pays?: string;
  store_name?: string;
  vendor_image?: string;
  meta_data: { key: string; value: string | string[] }[];
}

interface Vendor {
  store_name: string;
  products: Product[];
  vendor_image?: string;
  region__pays?: string;
}

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    return <div className="text-center p-6">Chargement des vignerons...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const handleVendorClick = (vendorName: string) => {
    router.push(`/vendor/${vendorName}`);
  };

  const generateDescription = (products: Product[]): string => {
    const appellations: Record<string, number> = {};
    const regions: Record<string, number> = {};

    products.forEach((product) => {
      if (product.certification) appellations[product.certification] = (appellations[product.certification] || 0) + 1;
      if (product.region__pays) regions[product.region__pays] = (regions[product.region__pays] || 0) + 1;
    });

    const mostCommonAppellation = Object.keys(appellations).reduce((a, b) => (appellations[a] > appellations[b] ? a : b), '');

    return `Domaine ${mostCommonAppellation || 'Non spécifié'}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="flex items-center justify-center text-xl font-bold mb-6 text-center">
        <div className="border-t border-black w-1/5" /> {/* Bordure gauche */}
        <span className="mx-4">Vignerons engagés et passionnés</span>
        <div className="border-t border-black w-1/5" /> {/* Bordure droite */}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendors.map((vendor) => (
          <div
            key={vendor.store_name}
            className="relative overflow-hidden rounded-xl group transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleVendorClick(vendor.store_name)}
          >
            <div className="relative h-64 bg-teal-500 p-6">
              <div className="absolute top-4 left-4 text-white text-3xl">
                <FaWineBottle />
              </div>
              <div className=" w-30 h-30 opacity-90">
                <Image
                  src={vendor.vendor_image || '/images/meme-pas-contente-removebg-preview.png'}
                  alt={vendor.store_name}
                  width={100}
                  height={100}
                  className="rounded-full bg-white"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">{vendor.store_name}</h3>
              {vendor.region__pays && (
                <p className="text-sm text-white flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> {vendor.region__pays}
                </p>
              )}
              <p className="text-white">{generateDescription(vendor.products)}</p>
              <button className=" mt-2 bg-white text-black px-4 py-2 rounded-lg mb-2 hover-animate transition-colors duration-300 hover:text-primary shadow-lg hover:shadow-xl">
                <p className="text-black hover:text-primary">{vendor.products.length} vins disponibles</p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;
