"use client"
import React, { useState, useEffect } from 'react';
import AddressForm from './delivery_address_input.client';
import './ModalStyles.css';
import { emitter } from "../../../../utils/emitter"

const PopupWithAddressForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);  // State to handle button disabled status
 

  useEffect(() => {
    // Function to handle delivery option changes
    const handleDeliveryOptionChange = (option) => {
      // Disable button if delivery option is 'Pick Up'
      setIsButtonDisabled(option === 'Pick Up');
    };

    // Subscribe to delivery option changes
    emitter.on('deliveryOptionChange', handleDeliveryOptionChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      emitter.off('deliveryOptionChange', handleDeliveryOptionChange);
    };
  }, []);

  const handleSave = (newAddress) => {
    setAddress(newAddress);
    setShowForm(false);
    // Save the address to local storage
    localStorage.setItem('savedAddress', JSON.stringify(newAddress));
    emitter.emit('savedAddressChange', newAddress);
    // For checking against the available store location addresses (delivery radius), and alcohol delivery city/county restrictions
  };

  return (
    <>
      <button onClick={() => setShowForm(true)}
      disabled={isButtonDisabled}  // Use the isButtonDisabled state to control the button's disabled attribute
      style={{
        color: isButtonDisabled ? 'gray' : 'black',  // Change text color based on disabled state
        backgroundColor: isButtonDisabled ? '#ccc' : 'white',  // Optional: change background color when disabled
        border: '1px solid #ccc',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer'  // Change cursor to indicate not allowed action
      }}
      >
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