import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VendorEdit.css';
import axiosInstance from './axiosInstance';

const VendorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [contacts, setContacts] = useState([]);
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
    swiftCode: '',
  });

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');

      const fetchCities = async (countryName) => {
        try {
          const response = await axios.post(
            'https://hastin-container.com/staging/api/countryCities/get',
            { country: countryName },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `BslogiKey ${token}`,
              },
            }
          );
          const cityList = response.data?.data || [];
          setCities(cityList.map(city => ({ label: city, value: city })));
        } catch (err) {
          console.error('City fetch error:', err);
          toast.error('Failed to fetch cities');
        }
      };

      try {
        const [countryRes, currencyRes] = await Promise.all([
          axios.get('https://hastin-container.com/staging/api/meta/country'),
          axios.get('https://hastin-container.com/staging/api/meta/currencies')
        ]);

        setCountries(countryRes.data.data.map(c => ({ value: c.name, label: c.name })));
        setCurrencies(currencyRes.data.data.map(c => ({ value: c.name, label: c.name })));
      } catch (error) {
        toast.error('Error loading metadata');
      }

      if (id) {
        try {
          const response = await axiosInstance.get(
            `https://hastin-container.com/staging/api/vendor/${id}`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `BslogiKey ${token}`,
              },
            }
          );

          if (response.data?.data) {
            const v = response.data.data;
            setFormData({
              vendorName: v.vendorName || '',
              vendorCode: v.vendorCode || '',
              vendorType: v.vendorType || '',
              taxReg: v.taxRegistrationNo || '',
              companyReg: v.companyRegistrationNo || '',
              currency: v.defaultCurrency || '',
              address1: v.address1 || '',
              address2: v.address2 || '',
              postalCode: v.postalCode || '',
              country: v.country || '',
              city: v.city || '',
              accountName: v.accountName || '',
              accountNumber: v.accountNumber || '',
              bankName: v.bankName || '',
              branch: v.branch || '',
              swiftCode: v.swiftCode || ''
            });
            setContacts(v.contacts || []);
            if (v.country) fetchCities(v.country);
          }
        } catch (err) {
          console.error('Failed to fetch vendor', err);
          toast.error('Failed to fetch vendor details');
        }
      }
    };

    fetchData();
  }, [id]);

  const fetchCities = async (countryName) => {
    try {
      const response = await axios.post(
        'https://hastin-container.com/staging/api/countryCities/get',
        { country: countryName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `BslogiKey ${token}`,
          },
        }
      );
      const cityList = response.data?.data || [];
      setCities(cityList.map(city => ({ label: city, value: city })));
    } catch (err) {
      console.error('City fetch error:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://hastin-container.com/staging/api/vendor/update`,
        { id, ...formData, contacts },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `BslogiKey ${token}`
          }
        }
      );

      toast.success('Vendor updated successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to update vendor');
    }
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', email: '', phone: '', isDefault: false }]);
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const deleteContact = (index) => {
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);
  };

  return (
    <div className="edit-vendor-container">
      <div className='header'>
        <h2>Edit Vendor</h2>
       
      </div><br />
      <form className="edit-vendor-form" onSubmit={handleSubmit}>
        <div className="card-section">
          <h5>Basic Info</h5>
          <div className="form-group"><label>Vendor Name</label><input value={formData.vendorName} onChange={e => handleChange('vendorName', e.target.value)} /></div>
          <div className="form-group"><label>Vendor Code</label><input value={formData.vendorCode} onChange={e => handleChange('vendorCode', e.target.value)} /></div>
          <div className="form-group"><label>Vendor Type</label>
            <select value={formData.vendorType} onChange={e => handleChange('vendorType', e.target.value)}>
              <option value="">Select</option>
              <option>Company</option>
              <option>Individual</option>
            </select>
          </div>
          <div className="form-group"><label>Tax Reg. No</label><input value={formData.taxReg} onChange={e => handleChange('taxReg', e.target.value)} /></div>
          <div className="form-group"><label>Company Reg. No</label><input value={formData.companyReg} onChange={e => handleChange('companyReg', e.target.value)} /></div>
          <div className="form-group"><label>Currency</label>
            <Select
              options={currencies}
              value={currencies.find(c => c.value === formData.currency)}
              onChange={(opt) => handleChange('currency', opt.value)}
            />
          </div>
        </div>

        <div className="card-section">
          <h5>Address</h5>
          <div className="form-group"><label>Address 1</label><input value={formData.address1} onChange={e => handleChange('address1', e.target.value)} /></div>
          <div className="form-group"><label>Address 2</label><input value={formData.address2} onChange={e => handleChange('address2', e.target.value)} /></div>
          <div className="form-group"><label>Postal Code</label><input value={formData.postalCode} onChange={e => handleChange('postalCode', e.target.value)} /></div>
          <div className="form-group"><label>Country</label>
            <Select
              options={countries}
              value={countries.find(c => c.value === formData.country)}
              onChange={(opt) => {
                handleChange('country', opt.value);
                fetchCities(opt.value);
                handleChange('city', '');
              }}
            />
          </div>
          <div className="form-group"><label>City</label>
            <Select
              options={cities}
              value={cities.find(c => c.value === formData.city)}
              onChange={(opt) => handleChange('city', opt.value)}
            />
          </div>
        </div>

        <div className="card-section">
          
          <h5>Bank Info</h5>
          <div className="form-group"><label>Account Name</label><input value={formData.accountName} onChange={e => handleChange('accountName', e.target.value)} /></div>
          <div className="form-group"><label>Account Number</label><input value={formData.accountNumber} onChange={e => handleChange('accountNumber', e.target.value)} /></div>
          <div className="form-group"><label>Bank Name</label><input value={formData.bankName} onChange={e => handleChange('bankName', e.target.value)} /></div>
          <div className="form-group"><label>Branch</label><input value={formData.branch} onChange={e => handleChange('branch', e.target.value)} /></div>
          <div className="form-group"><label>SWIFT Code</label><input value={formData.swiftCode} onChange={e => handleChange('swiftCode', e.target.value)} /></div>
        </div>

        <div className="contact-section">
          <h5>Contact Info</h5>
          <table className="contact-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Is Default</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td><input placeholder='Name' value={contact.name} onChange={(e) => updateContact(index, 'name', e.target.value)} /></td>
                  <td><input placeholder='E-mail' value={contact.email} onChange={(e) => updateContact(index, 'email', e.target.value)} /></td>
                  <td><input placeholder='Phone' value={contact.phone} onChange={(e) => updateContact(index, 'phone', e.target.value)} /></td>
                  <td>
                    <select
                      value={contact.isDefault ? 'YES' : 'NO'}
                      onChange={(e) => updateContact(index, 'isDefault', e.target.value === 'YES')}
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                  </td>
                  <td>
                <button className='btn-delete' type="button" onClick={() => deleteContact(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-add mt-2" onClick={addContact}>+ Add Contact</button>
        </div>
      </form>
      <br />
       <button type="submit" className="btn btn-submit">Update Vendor</button>
       <button type="button" className="btn btn-back" onClick={() => {
            navigate('/dashboard');
            toast.success('Fetched to Vendors')
          }}> Back</button>
    </div>
  );
};

export default VendorEdit;
