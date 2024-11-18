'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';
import StripePayment from '../../components/StripePayment';
import BoxtalMap from '../../components/BoxtalMap';
import { Check } from 'lucide-react';

const CheckoutPage = () => {
  const { deleteAllCartItems, viewAllCartItems } = useCart();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    postcode: '',
    email: '',
    phone: '',
    paymentMethod: 'stripe',
    deliveryMethod: 'standard' // 'standard' ou 'pickup'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const cartDetails = viewAllCartItems();
  const totalPrice = (cartDetails.total + 10).toFixed(2);

  const isStepComplete = (step) => {
    switch (step) {
      case 1: // Contact Info
        return formData.email && formData.phone;
      case 2: // Delivery
        return formData.deliveryMethod === 'standard' ?
          (formData.firstName && formData.lastName && formData.address1 && formData.city && formData.postcode) :
          selectedPoint;
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePointSelect = (point) => {
    setSelectedPoint(point);
    setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }));
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    try {
      const orderData = {
        payment_method: "stripe",
        payment_method_title: "Stripe",
        set_paid: true,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.deliveryMethod === 'pickup' ? selectedPoint.address : formData.address1,
          city: formData.deliveryMethod === 'pickup' ? selectedPoint.city : formData.city,
          postcode: formData.deliveryMethod === 'pickup' ? selectedPoint.postcode : formData.postcode,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.deliveryMethod === 'pickup' ? selectedPoint.address : formData.address1,
          city: formData.deliveryMethod === 'pickup' ? selectedPoint.city : formData.city,
          postcode: formData.deliveryMethod === 'pickup' ? selectedPoint.postcode : formData.postcode,
        },
        line_items: cartDetails.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_lines: [{
          method_id: formData.deliveryMethod,
          method_title: formData.deliveryMethod === 'pickup' ? 'Point Relais' : 'Livraison Standard',
          total: '10.00'
        }],
      };

      const orderResponse = await createOrder(orderData);
      deleteAllCartItems();
      router.push(`/thank-you?order_id=${orderResponse.id}`);
    } catch (err) {
      console.error(err);
      setError('La création de la commande a échoué. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8 mt-48">
      <div className="flex justify-between items-center">
        {[
          { num: 1, title: 'Contact' },
          { num: 2, title: 'Livraison' },
          { num: 3, title: 'Paiement' }
        ].map((step) => (
          <div key={step.num} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2
                ${currentStep === step.num ? 'border-blue-500 bg-blue-500 text-white' :
                  currentStep > step.num ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 text-gray-300'}`}
            >
              {currentStep > step.num ? <Check size={16} /> : step.num}
            </div>
            <span className={`ml-2 ${currentStep >= step.num ? 'text-gray-900' : 'text-gray-400'}`}>
              {step.title}
            </span>
            {step.num < 3 && (
              <div className={`w-24 h-0.5 mx-4 ${currentStep > step.num ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="phone"
        type="tel"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={handleInputChange}
        className="w-full border p-2 rounded"
        required
      />
      <button
        onClick={() => setCurrentStep(2)}
        disabled={!isStepComplete(1)}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
      >
        Continuer
      </button>
    </div>
  );

  const renderDeliveryStep = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'standard' }))}
          className={`flex-1 p-4 border rounded-lg ${formData.deliveryMethod === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
        >
          <h3 className="font-semibold">Livraison Standard</h3>
          <p className="text-sm text-gray-600">3-5 jours ouvrés</p>
          <p className="font-semibold mt-2">10.00€</p>
        </button>
        <button
          onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
          className={`flex-1 p-4 border rounded-lg ${formData.deliveryMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
        >
          <h3 className="font-semibold">Point Relais</h3>
          <p className="text-sm text-gray-600">2-4 jours ouvrés</p>
          <p className="font-semibold mt-2">10.00€</p>
        </button>
      </div>

      {formData.deliveryMethod === 'standard' ? (
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleInputChange}
              className="flex-1 border p-2 rounded"
              required
            />
            <input
              name="lastName"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleInputChange}
              className="flex-1 border p-2 rounded"
              required
            />
          </div>
          <input
            name="address1"
            placeholder="Adresse"
            value={formData.address1}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex gap-4">
            <input
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleInputChange}
              className="flex-1 border p-2 rounded"
              required
            />
            <input
              name="postcode"
              placeholder="Code postal"
              value={formData.postcode}
              onChange={handleInputChange}
              className="w-40 border p-2 rounded"
              required
            />
          </div>
        </div>
      ) : (
        <div>
          <BoxtalMap onSelectPoint={handlePointSelect} />
          {selectedPoint && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold">Point de retrait sélectionné :</h4>
              <p>{selectedPoint.name}</p>
              <p>{selectedPoint.address}</p>
              <p>{selectedPoint.postcode} {selectedPoint.city}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 border border-blue-500 text-blue-500 py-2 rounded"
        >
          Retour
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={!isStepComplete(2)}
          className="flex-1 bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
        >
          Continuer
        </button>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Résumé de la commande</h3>
      <ul className="space-y-4 mb-4">
        {cartDetails.items.map((item) => (
          <li key={item.product_id} className="flex justify-between items-center border-b pb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)}€</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-lg mb-2">
        <span>Sous-total</span>
        <span>{cartDetails.total.toFixed(2)}€</span>
      </div>
      <div className="flex justify-between text-lg mb-2">
        <span>
          {formData.deliveryMethod === 'standard' ? 'Livraison standard' : 'Point Relais'}
          <span className="text-xs ml-2">(3-5 jours)</span>
        </span>
        <span>10.00€</span>
      </div>
      <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
        <span>Total :</span>
        <span>{totalPrice}€</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-200px)] mx-auto px-4 md:px-8 mt-24 max-w-6xl pb-24">
      {renderStepIndicator()}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 bg-white rounded-lg p-6 shadow-sm">
          {currentStep === 1 && renderContactStep()}
          {currentStep === 2 && renderDeliveryStep()}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Paiement</h2>
                <Image
                  src="/images/stripe.webp"
                  alt="Stripe"
                  width={100}
                  height={100}
                />
                <div>
                  <p className="font-medium text-gray-900">Paiement sécurisé par Stripe</p>
                  <p className="text-sm text-gray-600">Vos informations de paiement sont protégées par un cryptage SSL</p>
                </div>
              {loading && <p className="text-blue-500">Création de la commande en cours...</p>}
              <StripePayment
                totalPrice={totalPrice}
                formData={formData}
                setError={setError}
                onComplete={handleOrderSubmit}
                disable={!isStepComplete(2)}
              />
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
