"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface VendorDetails {
  id: number;
  avatar_id?: string;
  display_name: string;
  description: string;
  social?: Record<string, string>;
  shop?: {
    title: string;
    image?: string;
    banner?: string;
    url: string;
  };
}

export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      const fetchVendorDetails = async () => {
        try {
          const response = await axios.post(`/api/get-vendor`, { id });
          setVendor(response.data);
        } catch (err) {
          if (err instanceof Error) {
            console.error('Error fetching vendor details:', err.message);
          } else {
            console.error('Error fetching vendor details:', err);
          }
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
    return <div className='sx-container'>Loading...</div>;
  }

  if (error) {
    return <div className='sx-container'>Error: {error}</div>;
  }

  if (!vendor) {
    return <div className='sx-container'>No vendor details available</div>;
  }

  // Vérification de l'existence de 'shop' avant d'essayer d'y accéder
  const shop = vendor.shop;

  return (
    <div className='sx-container'>
      <h1>{shop?.title || vendor.display_name}</h1>
      {shop?.banner && (
        <img
          src={shop.banner.startsWith('//') ? `https:${shop.banner}` : shop.banner}
          alt={`${shop.title || vendor.display_name} banner`}
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
        />
      )}
      {shop?.image && (
        <img
          src={shop.image.startsWith('//') ? `https:${shop.image}` : shop.image}
          alt={`${shop.title || vendor.display_name} profile`}
          style={{ borderRadius: '50%', width: '150px', height: '150px' }}
        />
      )}
      <p>{vendor.description || 'No description available.'}</p>
      <h3>Visit Shop</h3>
      {shop?.url ? (
        <a href={shop.url} target="_blank" rel="noopener noreferrer">
          Go to {shop.title}&apos;s store
        </a>
      ) : (
        <p>Shop URL is not available.</p>
      )}
      <h3>Social Media Links</h3>
      <ul>
        {vendor.social ? (
          Object.entries(vendor.social).map(([platform, url]) =>
            url ? (
              <li key={platform}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {platform}
                </a>
              </li>
            ) : null
          )
        ) : (
          <li>No social media links available.</li>
        )}
      </ul>
    </div>
  );
}
