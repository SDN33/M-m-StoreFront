'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Globe, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const SocialIcon = ({ platform }) => {
  const icons = {
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    website: <Globe className="w-5 h-5" />
  };
  return icons[platform.toLowerCase()] || <Globe className="w-5 h-5" />;
};

export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      const fetchVendorDetails = async () => {
        try {
          const response = await fetch('/api/get-vendor', {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          setVendor(data);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch vendor details');
        } finally {
          setLoading(false);
        }
      };
      fetchVendorDetails();
    } else {
      setLoading(false);
      setError('No ID provided in the URL');
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="w-full h-64 bg-gray-200 animate-pulse rounded-b-lg" />
        <div className="flex items-end -mt-16 px-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse border-4 border-white" />
        </div>
        <div className="mt-4 space-y-4">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-red-500 font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500">No vendor details available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-52">
      {/* Cover Photo */}
      <div className="relative">
        <div className="w-full h-64 overflow-hidden rounded-b-lg">
          <img
            src={vendor.shop.banner}
            alt={`${vendor.shop.title} banner`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Photo */}
        <div className="absolute -bottom-16 left-6">
          <img
            src={vendor.shop.image}
            alt={`${vendor.display_name} profile`}
            className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white shadow-lg"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-20 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vendor.shop.title}</h1>
            {vendor.address?.city && (
              <div className="mt-2 flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1"/>
                <span>
                  {vendor.address.city}
                  {vendor.address?.postcode && ` (${vendor.address.postcode.substring(0, 2)})`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">À propos</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{vendor.shop.description}</p>
          </div>
        </div>

        {/* Social Links */}
        {vendor.social && Object.keys(vendor.social).length > 0 && (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Réseaux sociaux</h2>
              <div className="flex flex-wrap gap-4">
                {Object.entries(vendor.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <SocialIcon platform={platform} />
                    <span className="capitalize">{platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
