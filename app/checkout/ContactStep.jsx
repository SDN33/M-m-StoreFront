import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ContactStep = ({ formData, handleInputChange, isStepComplete, setCurrentStep }) => {
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    handleInputChange(e);

    if (!validateEmail(email) && email !== '') {
      setEmailError('Veuillez entrer une adresse email valide');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleEmailChange}
          className={`w-full border p-2 pl-4 rounded ${emailError ? 'border-red-500' : ''}`}
          required
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
      </div>
      <div>
        <PhoneInput
          country={'fr'}
          value={formData.phone}
          onChange={phone => handleInputChange({ target: { name: 'phone', value: phone } })}
          inputProps={{
            name: 'phone',
            required: true,
            className: 'w-full border p-2 pl-12 rounded'
          }}
          containerClass="phone-input"
          inputClass="w-full text-center"
          buttonClass="phone-button"
        />
      </div>
      <button
        onClick={() => setCurrentStep(2)}
        disabled={!isStepComplete(1) || emailError}
        className="w-full bg-primary text-white py-2 rounded disabled:bg-gray-300"
      >
        Continuer
      </button>
    </div>
  );
};

export default ContactStep;
