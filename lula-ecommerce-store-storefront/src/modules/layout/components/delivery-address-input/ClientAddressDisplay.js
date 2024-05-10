"use client"
import React, { useEffect, useState } from 'react';
import { emitter } from '../../../../utils/emitter';

const ClientAddressDisplay = () => {
  const [address, setAddress] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState('Pick Up');  // Default to 'Pick Up'

  useEffect(() => {
    // Listener for address changes
    const handleAddressChange = (newAddress) => {
      setAddress(newAddress);
    };
    // Listener for delivery option changes
    const handleDeliveryOptionChange = (option) => {
      setDeliveryOption(option);
    };

    emitter.on('savedAddressChange', handleAddressChange);
    emitter.on('deliveryOptionChange', handleDeliveryOptionChange);

    return () => {
      emitter.off('savedAddressChange', handleAddressChange);
      emitter.off('deliveryOptionChange', handleDeliveryOptionChange);
    };
  }, []);

  if (!address || deliveryOption === 'Pick Up') return null;  // Do not display if 'Pick Up' is selected

  return (
    <div>
      <p>{address.street}</p>
      <p>{address.city}, {address.state}, {address.zip} </p>
    </div>
  );
};

export default ClientAddressDisplay;