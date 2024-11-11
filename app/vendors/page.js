'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/get-vendor');
        
        // Log the status and content type for debugging
        console.log('Response:', response.data);
        console.log('Response status:', response.status);
        console.log('Response status:', response.status);
        console.log('Content type:', response.headers.get('content-type'));
  
        if (!response.ok) {
          throw new Error(`Error fetching vendors: ${response.status}`);
        }
  
        if (response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json();
          console.log('data', data)
          setVendors(data.slice(0, 10)); // Display only the first 10 vendors
        } else {
          throw new Error('Response is not JSON');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVendors();
  }, []);
  

  if (loading) return <p>Loading vendors...</p>;

  return (
    <div className='sx-container'>
      <h1>Vendor List</h1>
      {vendors.length ? (
        <ul>
          {vendors.map((vendor) => (
            <li key={vendor.id}>
              <Link href={`/vendors/${vendor.id}`}>
                {vendor.shop.title || 'Unknown Vendor'}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No vendors found.</p>
      )}
    </div>
  );
};

export default VendorsPage;
