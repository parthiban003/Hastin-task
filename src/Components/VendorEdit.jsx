import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VendorEdit.css';

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
    swiftCode: ''
  });

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchInitialData();
    if (id) fetchVendorDetails(id);
  }, [id]);

  const fetchInitialData = async () => {
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
  };

  const fetchVendorDetails = async (vendorId) => {
    try {
      const response = await axios.post(
        `/staging/api/vendor/${vendorId}`,
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
  };

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
           body: JSON.stringify({ id })
        }
      );
      const cityList = response.data?.data || [];
      setCities(cityList.map(city => ({ label: city, value: city })));
    } catch (err) {
      console.error('City fetch error:', err);
      toast.error('Failed to fetch cities');
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
        { id, ...formData },
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

  return (
    <div className="edit-vendor-container">
      <h2>Edit Vendor</h2>
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
                handleChange('city', ''); // clear previous city
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

        <div className="form-actions">
          <button type="submit" className="btn-submit">Update Vendor</button>
          <button type="button" className="btn-back" onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </form>
    </div>
  );
};

export default VendorEdit;
