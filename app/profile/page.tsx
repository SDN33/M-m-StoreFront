"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface User {
  user_display_name: string;
  user_email: string;
}

interface Order {
  id: number;
  date: string;
  total: string;
  status: string;
}

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
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
        const userResponse = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData: User = await userResponse.json();
          setUser(userData);
        } else {
          router.push('/login');
          return;
        }

        const ordersResponse = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (ordersResponse.ok) {
          const ordersData: Order[] = await ordersResponse.json();
          setOrders(ordersData);
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

      {/* Section des commandes récentes */}
      <section style={{ marginTop: '30px' }}>
        <h2>Vos dernières commandes</h2>
        {orders.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {orders.map((order) => (
              <li key={order.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                <p>Commande #{order.id}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p>Total: {order.total} €</p>
                <p>Statut: {order.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune commande récente.</p>
        )}
      </section>
    </main>
  );
}
