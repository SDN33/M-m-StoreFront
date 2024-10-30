"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { viewCart } from '../../services/cart';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';
import { loadScript } from "@paypal/paypal-js"; 
// import { Order } from '../../services/types';

const CheckoutPage = () => {
  const { deleteAllCartItems, viewAllCartItems } = useCart();
  // const [cartDetails, setCartDetails] = useState({ total: 0, items: [] });
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
  let cartDetails = viewAllCartItems();

  useEffect(() => {
    loadScript({ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" })
      .then(() => console.log("PayPal SDK loaded successfully"))
      .catch((err) => console.error("Failed to load PayPal SDK", err));
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Handle PayPal Payment and Order Submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const { firstName, lastName, address1, city, state, postcode, email, phone } = formData;
    if (!firstName || !lastName || !address1 || !city || !state || !postcode || !email || !phone) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Configure the PayPal button to capture payment
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: (cartDetails.total+10).toFixed(2), // PayPal amount as a string
            }
          }]
        });
      },
      onApprove: async (data, actions) => {
        deleteAllCartItems();
        return actions.order.capture().then(async (details) => {
          // console.log("Payment successful:", details);

          // Construct order payload
          const orderData = {
            payment_method: "paypal",
            payment_method_title: "PayPal",
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
            line_items: cartDetails.items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
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
            router.push(`/thank-you?order_id=${orderResponse.id}`);
          } catch (err) {
            setError('Order creation failed. Please try again.');
          } finally {
            setLoading(false);
          }
        });
      },
      onError: (err) => {
        console.error("PayPal Checkout error:", err);
        setError("Payment failed. Please try again.");
        setLoading(false);
      },
    }).render('#paypal-button-container');
  };

  return (
    <div className="mx-auto px-8 mt-56 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
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
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-8 px-4 py-4">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <ul className="space-y-4 mb-4">
            {cartDetails.items.map((item) => (
              <li key={item.product_id} className="flex justify-between items-center border-b pb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold text-lg mb-2">
            <span>Subtotal:</span>
            <span>{(cartDetails.total).toFixed(2)}€</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-2">
            <span>Shipping:</span>
            <span>10.00€</span>
          </div>
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Total:</span>
            <span>{(cartDetails.total + 10).toFixed(2)}€</span>
          </div>
          <div>
            <select name="paymentMethod" onChange={handleInputChange} className="w-full border p-2 rounded mb-4">
              <option value="cod">Cash on Delivery</option>
              <option value="bacs">Direct Bank Transfer</option>
            </select>
            <button
              onClick={handleOrderSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-2 px-4 rounded"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <div className="mt-4" id="paypal-button-container"></div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
