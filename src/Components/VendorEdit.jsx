import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './VendorEdit.css';
import { toast } from 'react-toastify';

const VendorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    vendorName: '', vendorCode: '', vendorType: '',
    taxReg: '', companyReg: '', currency: '',
    address1: '', address2: '', postalCode: '', country: '', city: '',
    accountName: '', accountNumber: '', bankName: '', branch: '', swiftCode: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});

  useEffect(()  => {
    fetch('https://hastin-container.com/staging/api/meta/country')
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setCountries(data.data.map(c => ({ value: c.name, label: c.name })));
        }
      });

    fetch('https://hastin-container.com/staging/api/meta/currencies')
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setCurrencies(data.data.map(c => ({ value: c.name, label: c.name })));
        }
      });

    const fetchVendorDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://hastin-container.com/staging/api/vendor/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `BslogiKey ${token}`,
          },
        });

        const data = await response.json();
        if (data?.data) {
          const v = data.data;
          setFormData({
            vendorName: v.vendorName || '', vendorCode: v.vendorCode || '', vendorType: v.vendorType || '',
            taxReg: v.taxRegistrationNo || '', companyReg: v.companyRegistrationNo || '',
            currency: v.defaultCurrency || '', address1: v.address1 || '', address2: v.address2 || '',
            postalCode: v.postalCode || '', country: v.country || '', city: v.city || '',
            accountName: v.accountName || '', accountNumber: v.accountNumber || '',
            bankName: v.bankName || '', branch: v.branch || '', swiftCode: v.swiftCode || ''
          });
          setContacts(v.contacts || []);
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };

    if (id) fetchVendorDetails();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.vendorName) errors.vendorName = 'Vendor Name is required';
    if (!formData.vendorCode) errors.vendorCode = 'Vendor Code is required';
    if (!formData.vendorType) errors.vendorType = 'Vendor Type is required';
    if (!formData.address1) errors.address1 = 'Address 1 is required';
    if (!formData.postalCode) errors.postalCode = 'Postal Code is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.city) errors.city = 'City is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    fetch(`https://hastin-container.com/staging/api/vendor/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...formData })
    })
      .then(res => res.json())
      .then(() => {
        toast.success('Vendor updated successfully');
        navigate('/dashboard');
      });
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', email: '', phone: '', isDefault: false }]);
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const saveContact = (index) => {
    const c = contacts[index];
    const errors = {};
    if (!c.name) errors.name = 'Name is required';
    if (!c.email) errors.email = 'Email is required';
    if (!c.phone) errors.phone = 'Phone is required';
    if (Object.keys(errors).length) {
      setContactErrors({ [index]: errors });
      return;
    }

    const method = c.id ? 'PUT' : 'POST';
    const url = `https://hastin-container.com/staging/api/vendor/contact/${method === 'POST' ? 'create' : 'update'}`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...c, vendorId: id })
    })
      .then(res => res.json())
      .then(() => setContactErrors({}));
  };

  const deleteContact = (index) => {
    const c = contacts[index];
    if (c.id) {
      fetch(`https://hastin-container.com/staging/api/vendor/contact/delete/${c.id}/${id}`, { method: 'DELETE' });
    }
    setContacts(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="edit-vendor-container" >
      <h2>Edit Vendor</h2>
      <form className="edit-vendor-form" onSubmit={handleSubmit}>
        <div className="card-section">
          <h5>Basic Info</h5>
          <div className="form-group"><label>Vendor Name</label><input name='vendorname' value={formData.vendorName} onChange={e => handleChange('vendorName', e.target.value)} /></div>
          <div className="form-group"><label>Vendor Code</label><input name='vendorcode' value={formData.vendorCode} onChange={e => handleChange('vendorCode', e.target.value)} /></div>
          <div className="form-group"><label>Vendor Type</label>
            <select value={formData.vendorType} onChange={e => handleChange('vendorType', e.target.value)}>
              <option value="">Select</option>
              <option>Company</option>
              <option>Individual</option>
            </select>
          </div>
          <div className="form-group"><label>Tax Registration No</label><input name='taxReg' value={formData.taxReg} onChange={e => handleChange('taxReg', e.target.value)} /></div>
          <div className="form-group"><label>Company Registration No</label><input name='companyReg' value={formData.companyReg} onChange={e => handleChange('companyReg', e.target.value)} /></div>
          <div className="form-group"><label>Default Currency</label>
            <Select
              options={currencies}
              value={currencies.find(c => c.value === formData.currency)}
              onChange={opt => handleChange('currency', opt.value)}
            />
          </div>
        </div>

        <div className="card-section">
          <h5>Address</h5>
          <div className="form-group"><label>Address 1</label><input name='address1' value={formData.address1} onChange={e => handleChange('address1', e.target.value)} /></div>
          <div className="form-group"><label>Address 2</label><input name='address2' value={formData.address2} onChange={e => handleChange('address2', e.target.value)} /></div>
          <div className="form-group"><label>Postal Code</label><input name='postalcode' value={formData.postalCode} onChange={e => handleChange('postalCode', e.target.value)} /></div>
          <div className="form-group"><label>Country</label>
            <Select
              options={countries}
              value={countries.find(c => c.value === formData.country)}
              onChange={opt => handleChange('country', opt.value)}
            />
          </div>
          <div className="form-group"><label>City</label><input name='city' value={formData.city} onChange={e => handleChange('city', e.target.value)} /></div>
        </div>

        <div className="card-section">
          <h5>Bank Info</h5>
          <div className="form-group"><label>Account Name</label><input name='accountname' value={formData.accountName} onChange={e => handleChange('accountName', e.target.value)} /></div>
          <div className="form-group"><label>Account Number</label><input type='number' name='accountnumber' value={formData.accountNumber} onChange={e => handleChange('accountNumber', e.target.value)} /></div>
          <div className="form-group"><label>Bank Name</label><input name='banknumber' value={formData.bankName} onChange={e => handleChange('bankName', e.target.value)} /></div>
          <div className="form-group"><label>Branch</label><input name='branch' value={formData.branch} onChange={e => handleChange('branch', e.target.value)} /></div>
          <div className="form-group"><label>SWIFT Code</label><input name='swiftcode' value={formData.swiftCode} onChange={e => handleChange('swiftCode', e.target.value)} /></div>
        </div>

        <div className="card-section">
          <h5>Contact Info</h5>
          <table className="contact-table">
            <thead>
              <tr><th>S.NO</th><th>Name</th><th>Email</th><th>Phone</th><th>Is Default</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <input name='name' value={c.name}  placeholder='Name' onChange={e => updateContact(i, 'name', e.target.value)} />
                    {contactErrors[i]?.name && <p className="error">{contactErrors[i].name}</p>}
                  </td>
                  <td>
                    <input value={c.email} name='email' placeholder='E-mail' onChange={e => updateContact(i, 'email', e.target.value)} />
                    {contactErrors[i]?.email && <p className="error">{contactErrors[i].email}</p>}
                  </td>
                  <td>
                    <input value={c.phone} type='number' name='phone' placeholder='Phone' onChange={e => updateContact(i, 'phone', e.target.value)} />
                    {contactErrors[i]?.phone && <p className="error">{contactErrors[i].phone}</p>}
                  </td>
                  <td>
                    <select value={c.isDefault ? 'YES' : 'NO'} onChange={e => updateContact(i, 'isDefault', e.target.value === 'YES')}>
                      <option>YES</option><option>NO</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" onClick={() => saveContact(i)} className="btn-save">Save</button>
                    <button type="button" onClick={() => deleteContact(i)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addContact} className="btn-add">+ Add Contact</button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Update Vendor</button>
          <button type="button" onClick={() => 
            {navigate(-1);
              toast.info('Fetched to Vendors Screen')
            }} className="btn-back">Back</button>
        </div>
      </form>
    </div>
  );
};

export default VendorEdit;
