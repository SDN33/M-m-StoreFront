'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setError(null);
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          fetchOrders(data.user_id);  // Fetch orders once user data is retrieved
        } else {
          if (response.status === 401) {
            router.push('/login');
          } else {
            setError('Impossible de récupérer vos données. Réessayez plus tard.');
          }
        }
      } catch {
        setError('Une erreur inattendue est survenue. Réessayez plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchOrders = async (userId) => {
    try {
      const orderResponse = await fetch(`/api/orders?customer_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setOrders(orderData.orders);  // Update orders with the fetched data
      } else {
        setError('Impossible de récupérer les commandes.');
      }
    } catch {
      setError('Une erreur est survenue lors de la récupération des commandes.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch {
      setError('Échec de la déconnexion. Veuillez réessayer.');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 mt-18 sm:mt-36">
      <div className='md:hidden sm:flex'><br /><br /><br /><br /><br /></div>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-sm p-4 sm:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 text-center sm:text-left">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center mb-3 sm:mb-0">
                <span className="text-2xl font-bold text-white">
                  {user?.user_display_name?.charAt(0).toUpperCase() || ''}
                </span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-950">{user?.user_display_name}</h1>
                <p className="text-sm sm:text-base text-gray-500">{user?.user_email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-sm p-4 sm:p-8">
          <h2 className="text-lg font-semibold text-teal-800 mb-4">Vos commandes</h2>
          {Array.isArray(orders) && orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="border p-4 rounded-lg shadow-sm">
                  <p>
                    <strong>ID commande :</strong> {order.id}
                  </p>
                  <p>
                    <strong>Date :</strong> {new Date(order.date_created).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Statut :</strong> {order.status}
                  </p>
                  <p>
                    <strong>Total :</strong> {order.total} €
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Vous n&apos;avez pas encore de commandes.</p>
          )}
        </div>
      </div>


    </div>
  );
}
