// src/components/VendorModal.jsx
import React, { useState, useEffect } from 'react';
import './VendorModal.css';

const VendorModal = ({ vendor, countries, cities, currencies, onSave }) => {
  const [formData, setFormData] = useState({ ...vendor });

  useEffect(() => {
    setFormData({ ...vendor });
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Vendor: {vendor.name}</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Select Country</option>
            {countries.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select name="city" value={formData.city} onChange={handleChange}>
            <option value="">Select City</option>
            {cities.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select name="currency" value={formData.currency} onChange={handleChange}>
            <option value="">Select Currency</option>
            {currencies.map((c, i) => (
              <option key={i} value={c.name}>{c.name}</option>
            ))}
          </select>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default VendorModal;
