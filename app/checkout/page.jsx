'use client';
import React, { useState} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';
import StripePayment from '../../components/StripePayment';
import BoxtalMap from '../../components/BoxtalMap';
import { Check } from 'lucide-react';

const CheckoutPage = () => {
  const [notification, setNotification] = useState(null);
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
    deliveryMethod: 'Livraison Point Relais',
  });

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const cartDetails = viewAllCartItems();
  const hasProductWithSixOrMore = cartDetails?.items?.some(item => item.quantity >= 6) || false;
  const shippingCost = hasProductWithSixOrMore ? 0 : 10;
  const totalPrice = (cartDetails.total + shippingCost - discount).toFixed(2);

  const applyCoupon = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/coupons');
      if (!response.ok) throw new Error('Erreur lors de la récupération des coupons');

      const coupons = await response.json();
      const matchedCoupon = coupons.find((c) => c.code === coupon);

      if (!matchedCoupon) {
        setError('Code de coupon invalide');
        setDiscount(0);
        setNotification({ type: 'error', message: 'Votre coupon est invalide ou expiré.' });
        return;
      }

      if (matchedCoupon.date_expires && new Date(matchedCoupon.date_expires) < new Date()) {
        setError('Ce coupon a expiré.');
        setDiscount(0);
        setNotification({ type: 'error', message: 'Votre coupon a expiré.' });
        return;
      }

      if (matchedCoupon.usage_limit && matchedCoupon.usage_count >= matchedCoupon.usage_limit) {
        setError('Ce coupon a atteint sa limite d\'utilisation.');
        setDiscount(0);
        setNotification({ type: 'error', message: 'Ce coupon a atteint sa limite d\'utilisation.' });
        return;
      }

      if (matchedCoupon.minimum_amount && cartDetails.total < parseFloat(matchedCoupon.minimum_amount)) {
        setError(`Le montant minimum pour utiliser ce coupon est de ${matchedCoupon.minimum_amount}€.`);
        setDiscount(0);
        setNotification({ type: 'error', message: `Le montant minimum pour utiliser ce coupon est de ${matchedCoupon.minimum_amount}€.` });
        return;
      }

      if (matchedCoupon.maximum_amount && cartDetails.total > parseFloat(matchedCoupon.maximum_amount)) {
        setError(`Le montant maximum pour utiliser ce coupon est de ${matchedCoupon.maximum_amount}€.`);
        setDiscount(0);
        setNotification({ type: 'error', message: `Le montant maximum pour utiliser ce coupon est de ${matchedCoupon.maximum_amount}€.` });
        return;
      }

      if (matchedCoupon.exclude_sale_items && cartDetails.items.some(item => item.on_sale)) {
        setError('Ce coupon ne peut pas être utilisé sur des articles en promotion.');
        setDiscount(0);
        setNotification({ type: 'error', message: 'Ce coupon ne peut pas être utilisé sur des articles en promotion.' });
        return;
      }

      const discountValue =
        matchedCoupon.discount_type === 'percent'
          ? cartDetails.total * (parseFloat(matchedCoupon.amount) / 100)
          : parseFloat(matchedCoupon.amount);

      setDiscount(discountValue);
      setError('');
      setNotification({ type: 'success', message: 'Coupon ajouté avec succès ! 🎉' });
    } catch (err) {
      console.error(err);
      setError('Impossible de vérifier le code du coupon. Veuillez réessayer plus tard.');
      setNotification({ type: 'error', message: 'Erreur réseau. Réessayez plus tard.' });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return formData.email && formData.phone;
      case 2:
        return formData.deliveryMethod === 'standard' ?
          (formData.firstName && formData.lastName && formData.address1 && formData.city && formData.postcode) :
          selectedPoint;
      case 3:
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
    if (point && point.address && point.city && point.postcode) {
      setSelectedPoint(point);
      setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }));
    } else {
      console.error("Données du point relais incorrectes :", point);
    }
  };


  const handleOrderSubmit = async () => {
    setLoading(true);
    try {
      if (formData.deliveryMethod === 'pickup' && !selectedPoint) {
        throw new Error('Aucun point relais sélectionné.');
      }

      const address = formData.deliveryMethod === 'pickup' ? selectedPoint.address : formData.address1;
      if (!address || !formData.city || !formData.postcode) {
        throw new Error('Adresse incomplète.');
      }

      const orderData = {
        billing: {
          address_1: address,
          city: formData.deliveryMethod === 'pickup' ? selectedPoint.city : formData.city,
          postcode: formData.deliveryMethod === 'pickup' ? selectedPoint.postcode : formData.postcode,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address_1: address,
          city: formData.deliveryMethod === 'pickup' ? selectedPoint.city : formData.city,
          postcode: formData.deliveryMethod === 'pickup' ? selectedPoint.postcode : formData.postcode,
        },
        shipping_lines: [{
          method_id: formData.deliveryMethod,
          method_title: formData.deliveryMethod === 'pickup' ? 'Point Relais' : 'Livraison Standard',
          total: shippingCost.toFixed(2)
        }],
      };

      const orderResponse = await createOrder(orderData);
      deleteAllCartItems();
      router.push(`/thank-you?order_id=${orderResponse.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors de la création de la commande.');
    } finally {
      setLoading(false);
    }
  };


  const StepIndicator = ({ currentStep }) => {
    const { viewAllCartItems } = useCart();
    const cartDetails = viewAllCartItems();
    const hasItems = cartDetails?.items?.length > 0;

    React.useEffect(() => {
      if (!hasItems) {
        router.push('/');
      }
    }, [hasItems]);

    return (
      <div className="px-4 sm:px-6 md:px-8 mb-8 mt-12 sm:mt-24 md:mt-48 w-full">
        {!hasItems ? (
          <div className="text-center">Redirection vers le panier...</div>
        ) : (
          <>
            <span className='md:hidden lg:hidden xl:hidden'><br /><br /><br /><br /></span>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              {[
                { num: 1, title: 'Contact' },
                { num: 2, title: 'Livraison' },
                { num: 3, title: 'Paiement' }
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex items-center justify-center sm:justify-start w-full sm:w-auto"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2
                        ${currentStep === step.num ? 'border-teal-800 bg-teal-800 text-white' :
                          currentStep > step.num ? 'border-green-500 bg-green-500 text-white' :
                          'border-gray-300 text-gray-300'}`}
                    >
                      {currentStep > step.num ? <Check size={16} /> : step.num}
                    </div>
                    <span
                      className={`ml-2 text-sm sm:text-base ${currentStep >= step.num ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {step.num < 3 && (
                    <div className="hidden sm:block">
                      <div
                        className={`w-12 md:w-24 h-0.5 mx-2 md:mx-4 ${currentStep > step.num ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

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
        className="w-full bg-primary text-white py-2 rounded disabled:bg-gray-300"
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
          <p className="font-semibold mt-2">{shippingCost.toFixed(2)}€</p>
        </button>
        <button
          onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
          className={`flex-1 p-4 border rounded-lg ${formData.deliveryMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
        >
          <h3 className="font-semibold">Point Relais (Indisponible)</h3>
          <p className="text-sm text-gray-600">Non disponible pour le moment</p>
          <p className="font-semibold mt-2">{shippingCost.toFixed(2)}€</p>
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
          className="flex-1 border border-teal-800 text-teal-800 py-2 rounded"
        >
          Retour
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={!isStepComplete(2)}
          className="flex-1 bg-primary text-white py-2 rounded disabled:bg-gray-300"
        >
          Continuer
        </button>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Résumé de la commande</h3>
      <ul className="space-y-4 mb-4 font-bold text-sm">
        {cartDetails.items.map((item) => (
          <li key={item.product_id} className="flex justify-between items-center border-b pb-2">
            <span>{item.name}<br /> x {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)}€</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-sm font-semibold mb-2">
        <span>Sous-total</span>
        <span>{cartDetails.total.toFixed(2)}€</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className='font-bold'>
          {formData.deliveryMethod === 'standard' ? 'Livraison standard' : 'Point Relais'}
          <span className="text-xs ml-2">(3-5 jours)</span>
        </span>
        <span className='font-bold'>{shippingCost === 0 ? <span className="text-teal-800">Offert</span> : `${shippingCost.toFixed(2)}€`}</span>
      </div>
      {/* Coupon Section */}
      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Code promo"
            className="flex-1 border p-2 rounded text-sm"
            />
          <button
            onClick={applyCoupon}
            className="bg-teal-800 text-white px-4 py-2 rounded text-sm"
            disabled={!coupon}
          >
            Appliquer
          </button>
        </div>
        {notification && (
          <div className={`text-sm p-2 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {notification.message}
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-semibold">
            <span>Réduction</span>
            <span>-{discount.toFixed(2)}€</span>
          </div>
        )}
      </div>
      <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
        <span>Total :</span>
        <span>{totalPrice}€</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-200px)] mx-auto px-4 sm:px-8 mt-16 max-w-full md:max-w-6xl pb-24">
      <StepIndicator currentStep={currentStep} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Section principale */}
        <div className="w-full md:w-2/3 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          {currentStep === 1 && renderContactStep()}
          {currentStep === 2 && renderDeliveryStep()}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Paiement</h2>
              <Image
                src="/images/stripe.webp"
                alt="Stripe"
                width={80}
                height={80}
                className="mx-auto sm:mx-0"
              />
              <div>
                <p className="font-medium text-gray-900">Paiement sécurisé par Stripe</p>
                <p className="text-sm text-gray-600">Vos informations de paiement sont protégées par un cryptage SSL.</p>
              </div>
              {loading && <p className="text-blue-500">Création de la commande en cours...</p>}
              <StripePayment
                totalPrice={totalPrice}
                formData={formData}
                setError={setError}
                onComplete={handleOrderSubmit}
                disable={!isStepComplete(2)}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          )}
        </div>

        {/* Résumé commande */}
        <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
