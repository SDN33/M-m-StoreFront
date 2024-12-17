import React from 'react';
import BoxtalMap from '../../components/BoxtalMap';

const DeliveryStep = ({ formData, handleInputChange, handlePointSelect, selectedPoint, shippingCost, setCurrentStep, isStepComplete }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleInputChange({ target: { name: 'deliveryMethod', value: 'standard' } })}
          className={`flex-1 p-4 border rounded-lg ${formData.deliveryMethod === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
        >
          <h3 className="font-semibold">Livraison Standard</h3>
          <p className="text-sm text-gray-600">3-6 jours ouvrés</p>
          <p className="font-semibold mt-2">{shippingCost.toFixed(2)}€</p>
        </button>
        <button
          onClick={() => handleInputChange({ target: { name: 'deliveryMethod', value: 'pickup' } })}
          className={`flex-1 p-4 border rounded-lg ${formData.deliveryMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
        >
          <h3 className="font-semibold">Point Relais (Indisponible)</h3>
          <p className="text-sm text-gray-600">Non disponible pour le moment</p>
        </button>
      </div>

      {formData.deliveryMethod === 'standard' ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
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
          <div className="flex flex-col gap-4 sm:flex-row">
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
              className="w-full sm:w-40 border p-2 rounded"
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
};

export default DeliveryStep;
