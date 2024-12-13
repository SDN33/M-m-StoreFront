'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Wine } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: string;
  images: ProductImage[];
}

interface Vendor {
  id: string;
  shop: {
    display_name: string;
    image?: string;
    banner?: string;
    title?: string;
    description?: string;
  };
  name?: string;
  description?: string;
  address?: {
    city?: string;
    postcode?: string;
  };
  social?: Record<string, string>;
  products?: Product[];
}

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/get-vendor');
        if (!response.ok) {
          throw new Error(`Error fetching vendors: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch {
        throw new Error('Failed to fetch vendors');
      }
    };

    const fetchProductsForVendor = async (vendorId: string) => {
      try {
        const response = await fetch(`/api/get-vendor-products?vendorId=${vendorId}`);
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const products = await response.json();
        return products.slice(0, 3);
      } catch (error) {
        console.error(`Error fetching products for vendor ${vendorId}:`, error);
        return [];
      }
    };

    const fetchAllData = async () => {
      try {
        const vendorData = await fetchVendors();
        const vendorsWithProducts = await Promise.all(
          vendorData.map(async (vendor: Vendor) => {
            const products = await fetchProductsForVendor(vendor.id);
            return { ...vendor, products };
          })
        );
        setVendors(vendorsWithProducts);
        setError('');
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Unable to load vendors and products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
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
      <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-10 bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 pt-7 rounded-t-xl">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-white mb-8">
          Nos Vignerons Partenaires&nbsp;
          <Wine size={32} className="md:inline text-white animate-ping duration-1000 hidden" />
        </h2>
        <div className="border-b-4 border-white w-full max-w-[50rem] my-2 slide-in-right mx-auto"></div>
      </div>
        <div>
          <p className="text-center text-xl font-extrabold -mt-4 slide-in-right text-primary">
          </p>
          <h3 className="sm:text-sm md:text-lg lg:text-xl xl:text-xl font-serif font-semibold text-teal-800 mb-2 text-center">
            <span className='hidden lg:flex justify-center'>Le Défi de l&apos;Agriculture Bio dans la Vigne :</span>Les Vignerons Français au Cœur de la Transition Écologique
          </h3>
          <p className="text-center sm:text-xs md:text-lg font-serif -mt-2 slide-in-right px-4 md:px-20">
            Choisir leurs vins, c&apos;est soutenir une viticulture durable et éthique
          </p>
          <div className='border-t-2 border-white w-16 mt-4 flex mx-auto'></div>


      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Image
          src="https://res.cloudinary.com/daroyxenr/image/upload/q_auto:good/v1734051910/Design_sans_titre_54_nsgmrl.webp"
          alt="Vineyard"
          width={1920}
          height={1080}
          className='rounded-lg mb-8'
        />
      </motion.div>

        </div>

        {vendors.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-yellow-700">Aucun vignerons trouvés.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vendors
              .sort((a, b) => (b.products?.length || 0) - (a.products?.length || 0))
              .map((vendor) => {
              const avatar = vendor.shop?.image || vendor.shop?.banner;
              return (
                <div
                  key={vendor.id}
                  className="bg-gray-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex items-center">
                      {avatar && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                          <Image
                            src={avatar.startsWith('//') ? `https:${avatar}` : avatar}
                            alt={vendor.shop?.title || 'Vendor Avatar'}
                            className="w-full h-full object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                      )}
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {vendor.shop?.title || 'Unknown Vendor'}
                        </h2>
                        {vendor.address?.city && (
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {vendor.address.city.split(/[\s-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} ({vendor.address?.postcode?.substring(0, 2) || 'N/A'})
                            </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/vignerons/${vendor.id}`}
                      className="inline-flex items-center text-xs px-2 py-2 bg-blue-50 text-teal-800 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      Voir plus →
                    </Link>
                  </div>

                  {vendor.shop?.description && (
                    <>
                      <p className="mt-4 text-gray-950 text-xs text-center">
                        {vendor.shop.description.replace(/<\/?[^>]+(>|$)/g, "").length > 20
                          ? `${vendor.shop.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200)}...`
                          : vendor.shop.description.replace(/<\/?[^>]+(>|$)/g, "")}
                      </p>
                      <Link
                        href={`/vignerons/${vendor.id}`}
                        className="text-teal-800 text-xs mt-2 inline-block text-center mx-auto"
                      >
                        En Savoir plus →
                      </Link>
                    </>
                  )}


                    {vendor.products && vendor.products.length > 0 && (
                    <div className="mt-6 border-t border-teal-800/20 pb-2">
                      <h3 className="text-base font-semibold text-teal-800 mb-4 text-center mt-2">Vins Recommandés</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {vendor.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            {product.images && product.images[0] && (
                              <div className="w-24 h-24 mb-3 relative overflow-hidden rounded-full border-2 border-white shadow-sm">
                                <Link href={`/produits/${product.id}`} passHref>
                                  <Image
                                    src={product.images[0].src}
                                    alt={product.name}
                                    sizes='100%'
                                    className="transition-transform duration-300 hover:scale-110"
                                    style={{ maxWidth: '100%', height: 'auto' }} // Make image responsive
                                    width={96}
                                    height={96}
                                  />
                                </Link>
                              </div>
                            )}
                            <h4 className="font-semibold text-sm text-center text-gray-800 line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-gray-950 font-semibold mt-1">
                              {product.price}€
                            </p>
                            <p className="text-gray-950 mt-1 text-center text-xs">
                                {product.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 85) || product.short_description}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Image
            src="/images/vignerons.png"
            alt="Vineyard"
            width={1920}
            height={1080}
            className="rounded-lg mb-8"
          />
          <Link
            href={`/vignerons`}
            className="inline-flex items-center text-sm px-2 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            Voir tous les vignerons →
          </Link>
          </div>
        )}
      </div>
      <div className="bg-transprent p-6 rounded-lg mb-16 mx-10">
        <br />
        <p className="text-gray-700 text-base font-serif leading-relaxed text-center hidden lg:flex ">
          L&apos;agriculture biologique représente un véritable défi dans le domaine de la viticulture, particulièrement en France, pays reconnu pour son héritage viticole exceptionnel. Les vignes, étant particulièrement sensibles aux maladies et aux conditions climatiques, nécessitent des pratiques agricoles rigoureuses et innovantes pour respecter les principes de l&apos;agriculture biologique. C&apos;est dans ce contexte que les vignerons français jouent un rôle crucial.<br /><br />Leur expertise, combinée à leur engagement en faveur de la biodiversité et de la durabilité, en fait des acteurs incontournables de la transition écologique. En adoptant des méthodes biodynamiques et en réduisant l&apos;utilisation de produits chimiques, ces vignerons contribuent non seulement à la préservation de notre environnement, mais aussi à la production de vins d&apos;une qualité exceptionnelle, respectant les écosystèmes naturels. Leurs efforts sont un exemple concret de la manière dont l&apos;industrie viticole peut évoluer vers un modèle plus durable, sans compromis sur l&apos;excellence des produits.
        </p>
      </div>
    </div>
  );
};

export default VendorsPage;
