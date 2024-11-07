"use client"; // Assurez-vous que ce composant est un composant client

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrder } from '../../services/order';
import { Order } from '../../services/types';

// Composant de chargement
const Loading = () => (
  <p className="text-center text-xl my-8">Loading order details...</p>
);

const ThankYouPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get("order_id") : null;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (orderId) {
          const orderData = await getOrder(Number(orderId));
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <Loading />; // Utilisation du composant de chargement

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-56 bg-white rounded-lg p-8">
      <h2 className="text-3xl text-center font-bold mb-6 text-green-600">Merci pour votre commande !</h2>
      {order ? (
        <>
          <div className="mb-6">
            <p className="text-lg mb-2">Order ID: <span className="font-semibold">{order.id}</span></p>
            <p className="text-lg">Status: <span className="font-semibold text-blue-600 capitalize">{order.status}</span></p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Recapitulatif</h3>
          <div className="border-t pt-4">
            {order.line_items.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b py-3">
                <div>
                  <p className="font-medium text-lg">{item.name}</p>
                  <p className="text-gray-600 text-sm">Quantité: {item.quantity}</p>
                </div>
                <p className="font-medium text-lg">€{(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-xl mt-4 border-t pt-4">
            <p>Total</p>
            <p>€{Number(order.total).toFixed(2)}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Adresse de facturation</h3>
            <p>{order.billing.first_name} {order.billing.last_name}</p>
            <p>{order.billing.address_1}, {order.billing.city}</p>
            <p>{order.billing.state}, {order.billing.postcode}</p>
            <p>{order.billing.country}</p>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Adresse de livraison</h3>
            <p>{order.shipping.first_name} {order.shipping.last_name}</p>
            <p>{order.shipping.address_1}, {order.shipping.city}</p>
            <p>{order.shipping.state}, {order.shipping.postcode}</p>
            <p>{order.shipping.country}</p>
          </div>
        </>
      ) : (
        <p className="text-red-600 mt-4">Order data not found</p>
      )}
      <button
        onClick={() => router.push('/')}
        className="bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-2 px-4 rounded"
      >
        Retour à l'accueil
      </button>
    </div>
  );
};

// Encapsulation du composant ThankYouPage dans Suspense
const ThankYouPageWrapper = () => (
  <React.Suspense fallback={<Loading />}>
    <ThankYouPage />
  </React.Suspense>
);

export default ThankYouPageWrapper;
