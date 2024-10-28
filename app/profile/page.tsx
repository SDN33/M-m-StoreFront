"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        router.push('/login');
        return;
    }

    async function fetchUserData() {
        try {
            // Fetch profile data via the Next.js API route
            const response = await fetch('/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                const errorText = await response.text();
                router.push('/login');
            }
        } catch (error) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }

    fetchUserData();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <main style={{ maxWidth: '600px', margin: '14rem auto' }}>
      {user ? (
        <div style={{ textAlign: 'center' }}>
          <h1>Welcome, {user.user_display_name}!</h1>
          <p>Email: {user.user_email}</p>
          <button
            onClick={() => {
              // localStorage.removeItem('jwtToken');
              logout();
              router.push('/login');
            }}
            style={{
              backgroundColor: '#ff6347',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              borderRadius: '5px',
              marginTop: '20px',
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </main>
  );
}
