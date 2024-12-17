import React from 'react';

const ContactStep = ({ formData, handleInputChange, isStepComplete, setCurrentStep }) => {
  return (
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
};

export default ContactStep;
