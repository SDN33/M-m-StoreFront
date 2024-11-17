'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendorsAndProducts = async () => {
      try {
        // Fetch vendors
        const vendorResponse = await fetch('/api/get-vendor');
        if (!vendorResponse.ok) {
          throw new Error(`Error fetching vendors: ${vendorResponse.status}`);
        }
        const vendorData = await vendorResponse.json();

        // Fetch products
        const productResponse = await fetch('/api/products');
        if (!productResponse.ok) {
          throw new Error(`Error fetching products: ${productResponse.status}`);
        }
        const productData = await productResponse.json();

        // Associate products with vendors
        const vendorsWithProducts = vendorData.map((vendor: { id: string; shop: { display_name: string; image?: string; banner?: string; title?: string }; name?: string; description?: string; social?: Record<string, string> }) => {
          const vendorProducts = productData.filter(
            (product: { store_name: string }) => product.store_name === vendor.shop.display_name
          );
          return { ...vendor, products: vendorProducts };
        });

        setVendors(vendorsWithProducts);
        setError('');
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Unable to load vendors and products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorsAndProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Nos vignerons partenaires</h1>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-16 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Nos vignerons partenaires</h1>

        <div>
        <p className="text-center text-xl font-extrabold -mt-4 mb-4 slide-in-right text-primary">
          &ldquo;Chaque domaine est unique, nos vignerons jouent franc-jeu avec la nature&ldquo;
        </p>
        {/* Bio Winemakers Description */}
        <p className="text-center text-sm font-extrabold -mt-2 slide-in-right">
          Nos vignerons s&apos;engagent pour une agriculture respectueuse de l&apos;environnement,
          garantissant des vins de qualité, riches en saveurs et sans produits chimiques.
          Choisir leurs vins, c&apos;est soutenir une viticulture durable et éthique.
          <div className='border-t-2 border-primary w-16 mt-4 flex mx-auto'></div> {/* Réduit la largeur de la bordure et l'espacement */}
        </p>
        <br /><br />
      </div>



        {vendors.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-yellow-700">Aucun vignerons trouvés.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {vendors.map((vendor: { id: string; shop: { display_name: string; image?: string; banner?: string; title?: string }; name?: string; description?: string; social?: Record<string, string>; products?: { id: string; name: string; description: string; price: number }[] }) => {
              const avatar = vendor.shop?.image || vendor.shop?.banner;
              return (
                <div
                  key={vendor.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex items-center">
                      {avatar && (
                        <Image
                          src={avatar.startsWith('//') ? `https:${avatar}` : avatar}
                          alt={vendor.shop?.title || 'Vendor Avatar'}
                          className="w-16 h-16 rounded-full object-cover"
                          width={64}
                          height={64}
                        />
                      )}
                      <div className="ml-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {vendor.shop?.title || 'Unknown Vendor'}
                        </h2>
                        <p className="text-gray-600 text-lg">{vendor.description || 'null'}</p>
                      </div>
                    </div>
                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      Voir plus →
                    </Link>
                  </div>

                  {vendor.description && (
                    <p className="text-gray-600 mt-4 leading-relaxed">
                      {vendor.description.substring(0, 150)}
                      {vendor.description.length > 150 ? '...' : ''}
                    </p>
                  )}

                  {vendor.products && vendor.products.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-700">Nos vins disponibles</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {vendor.products.map((product) => (
                          <div key={product.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-800">{product.name}</h4>
                            <p className="text-gray-600">{product.description.substring(0, 80)}...</p>
                            <p className="font-semibold text-gray-800">{product.price} €</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vendor.social && Object.keys(vendor.social).length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex gap-4">
                        {Object.entries(vendor.social).map(([platform, url]) => (
                          url ? (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
                            >
                              {platform}
                            </a>
                          ) : null
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
