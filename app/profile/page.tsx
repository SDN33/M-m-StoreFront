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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchUserData() {
      try {
        setError(null);
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
        } else {
          if (response.status === 401) {
            router.push('/login');
          } else {
            setError('Failed to fetch profile data. Please try again later.');
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 mt-48 mb-56">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-bold text-gray-800">Bienvenue <br /> {user?.user_display_name} </h1>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {user && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user.user_display_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.user_email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Déconnecter
            </button>
          </div>
        )}

        {!user && !loading && (
          <p className="text-center text-gray-600">Redirecting to login...</p>
        )}
      </div>
    </main>
  );
}
