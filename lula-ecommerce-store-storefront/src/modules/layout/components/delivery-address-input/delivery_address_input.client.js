"use client"
import React, { useState, useEffect } from 'react';

const AddressForm = ({ onSave, initialAddress }) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  // Populate form fields when initialAddress changes
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(address);
  };

  return (
    <div className="modal-content">
    <form onSubmit={handleSubmit} className="form-container">
      <input
        name="street"
        value={address.street}
        onChange={handleChange}
        placeholder="Street"
      />
      <input
        name="city"
        value={address.city}
        onChange={handleChange}
        placeholder="City"
      />
      <input
        name="state"
        value={address.state}
        onChange={handleChange}
        placeholder="State"
      />
      <input
        name="zip"
        value={address.zip}
        onChange={handleChange}
        placeholder="ZIP Code"
      />
      <button type="submit">Save Address</button>
    </form>
    </div>
  );
};

export default AddressForm;