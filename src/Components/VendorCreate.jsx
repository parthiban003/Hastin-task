import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VendorCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorName: '',
    vendorCode: '',
    vendorType: '',
    taxReg: '',
    companyReg: '',
    currency: '',
    address1: '',
    address2: '',
    postalCode: '',
    country: '',
    city: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    branch: '',
    swiftCode: ''
  });

  const [contacts, setContacts] = useState([{ name: '', email: '', mobile: '' }]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  

  useEffect(() => {
    fetch('https://hastin-container.com/staging/api/meta/country')
      .then(res => res.json())
      .then(data => setCountries(data?.data?.map(c => c.name) || []));

    fetch('https://hastin-container.com/staging/api/meta/currencies')
      .then(res => res.json())
      .then(data => setCurrencies(data?.data?.map(c => c.name) || []));
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', email: '', mobile: '' }]);
  };

  const removeContact = (index) => {
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');

    const payload = {
      vendorName: formData.vendorName,
      vendorCode: formData.vendorCode,
      vendorType: formData.vendorType,
      taxRegistrationNo: formData.taxReg,
      companyRegistrationNo: formData.companyReg,
      defaultCurrency: formData.currency,
      address1: formData.address1,
      address2: formData.address2,
      postalCode: formData.postalCode,
      country: formData.country,
      city: formData.city,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
      branch: formData.branch,
      swiftCode: formData.swiftCode,
      contacts
    };

    try {
      const response = await fetch('https://hastin-container.com/staging/api/vendor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `BslogiKey ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data?.message === "Vendor Created Successfully") {
        toast.success("Vendor created successfully!");
        navigate('/dashboard'); 
      } else {
        toast.error("Failed to create vendor!");
        console.log(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating vendor');
    }
  };

  return (
    <div className="edit-vendor-container">
      <h2>Create New Vendor</h2>
      <div className="edit-vendor-form">
        {/* VENDOR DETAILS */}
        <div className="card-section">
          <h5>Vendor Details</h5>
          {['vendorName', 'vendorCode', 'vendorType', 'taxReg', 'companyReg'].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label>{field}</label>
              <input name={field} value={formData[field]} onChange={handleInputChange} />
            </div>
          ))}
          <div className="form-group">
            <label>Currency</label>
            <select name="currency" value={formData.currency} onChange={handleInputChange}>
              <option value="">Select</option>
              {currencies.map((cur, i) => (
                <option key={i} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ADDRESS DETAILS */}
        <div className="card-section">
          <h5>Address Info</h5>
          {['address1', 'address2', 'postalCode'].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label>{field}</label>
              <input name={field} value={formData[field]} onChange={handleInputChange} />
            </div>
          ))}
          <div className="form-group">
            <label>Country</label>
            <select name="country" value={formData.country} onChange={handleInputChange}>
              <option value="">Select</option>
              {countries.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <input name="city" value={formData.city} onChange={handleInputChange} />
          </div>
        </div>

        {/* BANK DETAILS */}
        <div className="card-section">
          <h5>Bank Info</h5>
          {['accountName', 'accountNumber', 'bankName', 'branch', 'swiftCode'].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label>{field}</label>
              <input name={field} value={formData[field]} onChange={handleInputChange} />
            </div>
          ))}
        </div>

        {/* CONTACTS */}
        <div className="card-section">
          <h5>Contact Info</h5>
          <table className="contact-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index}>
                  <td><input value={contact.name} placeholder='Name' onChange={e => handleContactChange(index, 'name', e.target.value)} /></td>
                  <td><input value={contact.email} placeholder='E-mail' onChange={e => handleContactChange(index, 'email', e.target.value)} /></td>
                  <td><input value={contact.mobile} placeholder='Mobile' onChange={e => handleContactChange(index, 'mobile', e.target.value)} /></td>
                  <td>
                    {contacts.length > 1 && (
                      <button className="btn-delete" onClick={() => removeContact(index)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-add" onClick={addContact}>Add Contact</button>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="edit-btn-row">
        <button className="btn-back" style={{height:'40px'}} onClick={() => navigate('/dashboard')}>Cancel</button>
        <button className="btn-submit" style={{padding:'10px', height:'40px', marginRight:'80%', marginTop:'3%'}} onClick={handleSubmit}>Create Vendor</button>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
  
};

export default VendorCreate;
