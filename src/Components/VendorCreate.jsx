import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const VendorCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorName: '', vendorCode: '', vendorType: '',
    taxReg: '', companyReg: '', currency: '',
    address1: '', address2: '', postalCode: '', country: '', city: '',
    accountName: '', accountNumber: '', bankName: '', branch: '', swiftCode: ''
  });

  const [contacts, setContacts] = useState([{ name: '', email: '', mobile: '' }]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch('https://hastin-container.com/staging/api/meta/country')
      .then(res => res.json())
      .then(data => setCountries(data?.data?.map(c => ({ value: c.name, label: c.name })) || []));

    fetch('https://hastin-container.com/staging/api/meta/currencies')
      .then(res => res.json())
      .then(data => setCurrencies(data?.data?.map(c => ({ value: c.name, label: c.name })) || []));
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetch('/staging/api/countryCities/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: formData.country })
      })
        .then(res => res.json())
        .then(data => {
          if (data?.data?.length) {
            setCities(data.data.map(c => ({ value: c.city, label: c.city })));
          } else {
            setCities([]);
          }
        });
    }
  }, [formData.country]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
    }
  };

  return (
    <div className="edit-vendor-container">
      <h2>Create New Vendor</h2>
      <div className="edit-vendor-form">
        <div className="card-section">
          <h5>Vendor Details</h5>
          <div className="form-group">
            <label>Vendor Name</label>
            <input name="vendorName" value={formData.vendorName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Vendor Code</label>
            <input name="vendorCode" value={formData.vendorCode} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Vendor Type</label>
            <select name="vendorType" value={formData.vendorType} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tax Registration</label>
            <input name="taxReg" value={formData.taxReg} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Company Registration</label>
            <input name="companyReg" value={formData.companyReg} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <Select
              options={currencies}
              value={currencies.find(c => c.value === formData.currency)}
              onChange={opt => setFormData(prev => ({ ...prev, currency: opt.value }))}
            />
          </div>
        </div>

        <div className="card-section">
          <h5>Address Info</h5>
          <div className="form-group">
            <label>Address Line 1</label>
            <input name="address1" value={formData.address1} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input name="address2" value={formData.address2} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <Select
              options={countries}
              value={countries.find(c => c.value === formData.country)}
              onChange={opt => setFormData(prev => ({ ...prev, country: opt.value, city: '' }))}
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <Select
              options={cities}
              value={cities.find(c => c.value === formData.city)}
              onChange={opt => setFormData(prev => ({ ...prev, city: opt.value }))}
            />
          </div>
        </div>

        <div className="card-section">
          <h5>Bank Info</h5>
          <div className="form-group">
            <label>Account Name</label>
            <input name="accountName" value={formData.accountName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input name="accountNumber" type="number" value={formData.accountNumber} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <input name="bankName" value={formData.bankName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Branch</label>
            <input name="branch" value={formData.branch} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>SWIFT Code</label>
            <input name="swiftCode" value={formData.swiftCode} onChange={handleInputChange} />
          </div>
        </div>

        <div className="card-section">
          <h5>Contact Info</h5>
          <table className="contact-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Mobile</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index}>
                  <td><input value={contact.name} placeholder='Name' onChange={e => handleContactChange(index, 'name', e.target.value)} /></td>
                  <td><input value={contact.email} placeholder='email' onChange={e => handleContactChange(index, 'email', e.target.value)} /></td>
                  <td><input type="number" value={contact.mobile} placeholder='Mobile' onChange={e => handleContactChange(index, 'mobile', e.target.value)} /></td>
                  <td>{contacts.length > 1 && <button className='btn-delete' type="button" onClick={() => removeContact(index)}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className='btn-add' type="button" onClick={addContact}> + Add Contact</button>
        </div>

        <div className="edit-btn-row">
          <button className="btn-submit" style={{ padding: '10px', height: '40px',}} type="button" onClick={handleSubmit}>Create Vendor</button>
          <button className="btn-back" style={{ height: '40px', marginBottom:'50%' }}  type="button" onClick={() => { navigate('/dashboard'); toast.info('Fetched to Vendors Screen'); }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default VendorCreate;
