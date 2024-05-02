"use client"
import React, { useState } from 'react';
import AddressForm from './delivery_address_input.client';
import './ModalStyles.css';

const PopupWithAddressForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState();

  const handleSave = (newAddress) => {
    setAddress(newAddress);
    setShowForm(false);
    // Further processing like saving to global state or local storage
    // For checking against the available store location addresses (delivery radius), and alcohol delivery city/county restrictions
  };

  return (
    <>
      <button onClick={() => setShowForm(true)}>
        {address ? 'Edit Address' : 'Enter Address'}
      </button>
      
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <AddressForm onSave={handleSave} />
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupWithAddressForm;