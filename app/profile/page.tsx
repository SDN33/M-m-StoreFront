"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface User {
  user_display_name: string;
  user_email: string;
}

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null); // Type user en User ou null
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
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
        } else {
          router.push('/login');
        }
      } catch {
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
