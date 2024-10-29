"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';


export interface Order {

  id: number;

  status: string;

  total: string;

  date_created: string;

  payment_method: string;

  payment_method_title: string;

  set_paid: boolean;

  billing: {

    first_name: string;

    last_name: string;

    address_1: string;

    city: string;

    state: string;

    postcode: string;

    country: string;

    email: string;

    phone: string;

  };

  shipping: {

    first_name: string;

    last_name: string;

    address_1: string;

    city: string;

    state: string;

    postcode: string;

    country: string;

  };

  line_items: {

    product_id: number;

    quantity: number;

    name: string;

    price: string;

  }[];

  shipping_lines: {

    method_id: string;

    method_title: string;

    total: string;

  }[];

}


const CheckoutPage = () => {
  const { deleteAllCartItems, viewAllCartItems } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    state: '',
    postcode: '',
    email: '',
    phone: '',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const cartDetails = viewAllCartItems();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstName, lastName, address1, city, state, postcode, email, phone } = formData;
    if (!firstName || !lastName || !address1 || !city || !state || !postcode || !email || !phone) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const orderData: Order = {
      id: 0,
      status: 'pending',
      total: '0.00',
      date_created: new Date().toISOString(),
      payment_method: formData.paymentMethod,
      payment_method_title: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer',
      set_paid: true,
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address1,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        country: 'US',
        email: formData.email,
        phone: formData.phone,
      },
      shipping: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address1,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        country: 'US',
      },
      line_items: cartDetails.items.map((item: { product_id: number; quantity: number; name: string; price: string }) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      })),
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: '10.00',
        },
      ],
    };

    try {
      const orderResponse = await createOrder(orderData);
      deleteAllCartItems();
      router.push(`/thank-you?order_id=${orderResponse.id}`);
    } catch {
      setError('Order creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-8 mt-56 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Checkout Form */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-8 px-4 py-4">
          <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <input name="firstName" placeholder="First Name" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="lastName" placeholder="Last Name" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="address1" placeholder="Address" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="city" placeholder="City" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="state" placeholder="State" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="postcode" placeholder="Postcode" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="email" placeholder="Email" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="phone" placeholder="Phone" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-2 px-4 rounded"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;
