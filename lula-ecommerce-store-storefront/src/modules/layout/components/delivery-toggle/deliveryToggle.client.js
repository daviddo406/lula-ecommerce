"use client"
import React, { useEffect, useState } from 'react';
import { emitter } from '../../../../utils/emitter'


export default function DeliveryToggle() {
  const [deliveryOption, setDeliveryOption] = useState('Pick Up');

    useEffect(() => {
        // Only interact with localStorage when component is mounted, i.e., on the client side
        const storedDeliveryOption = localStorage.getItem('deliveryOption');
        if (storedDeliveryOption) {
            setDeliveryOption(storedDeliveryOption);
        }
    }, []);

    useEffect(() => {
        // Update local storage when deliveryOption changes
        localStorage.setItem('deliveryOption', deliveryOption);
        emitter.emit('deliveryOptionChange', deliveryOption);
    }, [deliveryOption]);


  return (
    <div className="delivery-toggle-container" style={{ display: 'inline-block', border: '1px solid #ccc', borderRadius: '20px', overflow: 'hidden' }}>
      <button
        onClick={() => setDeliveryOption('Pick Up')}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '20px',
          backgroundColor: deliveryOption === 'Pick Up' ? '#eb04fb' : 'transparent',
          color: deliveryOption === 'Pick Up' ? 'white' : '#eb04fb',
          cursor: 'pointer',
        }}
      >
        Pick Up
      </button>
      <button
        onClick={() => setDeliveryOption('Delivery')}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '20px',
          backgroundColor: deliveryOption === 'Delivery' ? '#eb04fb' : 'transparent',
          color: deliveryOption === 'Delivery' ? 'white' : '#eb04fb',
          cursor: 'pointer',
        }}
      >
        Delivery
      </button>
    </div>
  );
}
