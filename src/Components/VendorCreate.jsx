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

          <div className="form-group">
            <label htmlFor="vendorName">Vendor Name</label>
            <input
              type="text"
              id="vendorName"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vendorCode">Vendor Code</label>
            <input
              type="text"
              id="vendorCode"
              name="vendorCode"
              value={formData.vendorCode}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vendorType">Vendor Type</label>
            <select
              id="vendorType"
              name="vendorType"
              value={formData.vendorType}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="taxReg">Tax Registration</label>
            <input
              type="text"
              id="taxReg"
              name="taxReg"
              value={formData.taxReg}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyReg">Company Registration</label>
            <input
              type="text"
              id="companyReg"
              name="companyReg"
              value={formData.companyReg}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
            >
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

          <div className="form-group">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address2">Address Line 2</label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              {countries.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
        </div>


        {/* BANK DETAILS */}
        <div className="card-section">
          <h5>Bank Info</h5>

          <div className="form-group">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="number"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="swiftCode">SWIFT Code</label>
            <input
              type="text"
              id="swiftCode"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleInputChange}
            />
          </div>
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
                  <td><input value={contact.mobile} type='number' placeholder='Phone' onChange={e => handleContactChange(index, 'mobile', e.target.value)} /></td>
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
        <button className="btn-back" style={{ height: '40px' }} onClick={() => 
          {navigate('/dashboard');
            toast.info('Fetched to Vendors Screen')
          }}>Cancel</button>
        <button className="btn-submit" style={{ padding: '10px', height: '40px', marginRight: '80%', marginTop: '3%' }} onClick={handleSubmit}>Create Vendor</button>
        
      </div>
    </div>
  );

};

export default VendorCreate;
