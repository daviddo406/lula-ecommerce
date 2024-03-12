"use client"

import { useState } from 'react';

export default function DeliveryToggle() {
  const [deliveryOption, setDeliveryOption] = useState('Pick Up');

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
