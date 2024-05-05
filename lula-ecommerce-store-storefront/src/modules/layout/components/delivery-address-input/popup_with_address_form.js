"use client"
import React, { useState } from 'react';
import AddressForm from './delivery_address_input.client';
import './ModalStyles.css';

const PopupWithAddressForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState(null);

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
            <AddressForm onSave={handleSave} initialAddress={address} />
            <button onClick={() => setShowForm(false)}>Cancel</button>
            {address && (
              <div className="address-display">
                <p>Street: {address.street}</p>
                <p>City: {address.city}</p>
                <p>State: {address.state}</p>
                <p>ZIP: {address.zip}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupWithAddressForm;