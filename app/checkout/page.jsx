'use client';
import React, { useState} from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';
import { Check } from 'lucide-react';
import ContactStep from './ContactStep';
import DeliveryStep from './DeliveryStep';
import PaymentStep from './PaymentStep';

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
    deliveryMethod: 'standard',
  });

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const cartDetails = viewAllCartItems();
  const hasProductWithSixOrMore = cartDetails?.items?.some(item => item.quantity >= 6) || false;
  const shippingCost = formData.deliveryMethod === 'pickup' ? (hasProductWithSixOrMore ? 0 : 10) : 10;
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

    // Disable checkout if cart is empty, fetch fresh cart data on each interaction
    React.useEffect(() => {
      if (!hasItems) {
      setError('Votre panier est vide. Ajoutez des articles pour continuer.');
      setCurrentStep(1);
      }
    }, [hasItems]);

    return (
      <div className="px-4 sm:px-6 md:px-8 mb-8 mt-12 sm:mt-24 md:mt-48 w-full">
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
                    className={`ml-2 text-sm sm:text-base ${currentStep >= step.num ? 'text-gray-950' : 'text-gray-400'}`}
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
      </div>
    );
  };

  const renderOrderSummary = () => {
    const isRelayShippingFree = formData.deliveryMethod === 'pickup' && hasProductWithSixOrMore;

    return (
      <div className="bg-gray-50 rounded-lg p-6 mt-0 lg:-mt-10">
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
        <span className="text-xs ml-2">(3-6 jours)</span>
        </span>
        <span className='font-bold'>
        {isRelayShippingFree || shippingCost === 0 ?
          <span className="text-teal-800">Offert</span> :
          `${shippingCost.toFixed(2)}€`}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
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
  };

  return (
    <div className="min-h-[calc(100vh-200px)] mx-auto px-4 sm:px-8 mt-16 max-w-full md:max-w-6xl pb-24">
      <StepIndicator currentStep={currentStep} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Section principale */}
        <div className="w-full md:w-2/3 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          {currentStep === 1 && <ContactStep formData={formData} handleInputChange={handleInputChange} isStepComplete={isStepComplete} setCurrentStep={setCurrentStep} />}
          {currentStep === 2 && <DeliveryStep formData={formData} handleInputChange={handleInputChange} handlePointSelect={handlePointSelect} selectedPoint={selectedPoint} shippingCost={shippingCost} setCurrentStep={setCurrentStep} isStepComplete={isStepComplete} />}
          {currentStep === 3 && <PaymentStep totalPrice={totalPrice} formData={formData} setError={setError} handleOrderSubmit={handleOrderSubmit} isStepComplete={isStepComplete} loading={loading} error={error} />}
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
