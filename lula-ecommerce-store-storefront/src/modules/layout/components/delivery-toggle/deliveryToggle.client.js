"use client"
import React, { useEffect, useState } from 'react';


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
    }, [deliveryOption]);


  return (
    <div className="delivery-toggle-container" style={{ display: 'inline-block', border: '1px solid #ccc', borderRadius: '20px', overflow: 'hidden' }}>
      <button
        onClick={() => setDeliveryOption('Pick Up')}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '20px',
          backgroundColor: deliveryOption === 'Pick Up' ? '#007bff' : 'transparent',
          color: deliveryOption === 'Pick Up' ? 'white' : '#007bff',
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
          backgroundColor: deliveryOption === 'Delivery' ? '#007bff' : 'transparent',
          color: deliveryOption === 'Delivery' ? 'white' : '#007bff',
          cursor: 'pointer',
        }}
      >
        Delivery
      </button>
    </div>
  );
}
