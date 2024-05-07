"use client"
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import statesCities from './states_cities.json';

const AddressForm = ({ onSave, initialAddress }) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [errors, setErrors] = useState({});


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
    
    // Clear errors for a specific field when it is being edited
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };


  const handleSelectChange = (selectedOption, actionMeta) => {
    setAddress(prevAddress => ({
      ...prevAddress,
      [actionMeta.name]: selectedOption.value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(address);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Check each field for presence
    if (!address.street.trim()) newErrors.street = 'Please enter your street';
    if (!address.city.trim()) newErrors.city = 'Please enter your city';
    if (!address.state.trim()) newErrors.state = 'Please enter your state';
    if (!address.zip.trim()) {
      newErrors.zip = 'Please enter your ZIP code';
    } else if (!/^\d+$/.test(address.zip)) {
        newErrors.zip = 'ZIP code must be numeric';  // Ensure ZIP code is numeric
    }

    setErrors(newErrors);
    // Form is valid if there are no keys in the errors object
    return Object.keys(newErrors).length === 0;
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
      {errors.street && <div style={{ color: 'red' }}>{errors.street}</div>}

      <Select
          options={Object.keys(statesCities).map(state => ({ value: state, label: state }))}
          onChange={handleSelectChange}
          name="state"
          placeholder="Select State"
          value={address.state ? { value: address.state, label: address.state } : null}
        />
        {errors.state && <div style={{ color: 'red' }}>{errors.state}</div>}

        <Select
          options={address.state ? statesCities[address.state].map(city => ({ value: city, label: city })) : []}
          onChange={handleSelectChange}
          name="city"
          placeholder="Select City"
          value={address.city ? { value: address.city, label: address.city } : null}
          isDisabled={!address.state}
        />
        {errors.city && <div style={{ color: 'red' }}>{errors.city}</div>}

      <input
        name="zip"
        value={address.zip}
        onChange={handleChange}
        placeholder="ZIP Code"
      />
      {errors.zip && <div style={{ color: 'red' }}>{errors.zip}</div>}

      <button type="submit">Save Address</button>
    </form>
    </div>
  );
};

export default AddressForm;