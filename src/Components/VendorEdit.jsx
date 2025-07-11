import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, data } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import './VendorEdit.css';
import API_BASE_URL from './axiosInstance';

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
    taxRegNo: '',
    companyRegNo: '',
    defaultCurrencyId: '',
    address1: '',
    address2: '',
    postalCode: '',
    country: '',
    city: '',
    bankAcctName: '',
    bankAccountNum: '',
    bankName: '',
    bankBranchName: '',
    bankSwiftCode: '',
  });

  
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [countryRes, currencyRes] = await Promise.all([
        API_BASE_URL.get('/meta/country'),
        API_BASE_URL.get('/meta/currencies')
      ]);

      const countryList = countryRes.data.data.map(c => ({ value: c.name, label: c.name }));
      const currencyList = currencyRes.data.data.map(c => ({
        value: c.name,
        label: c.name,
        id: c.id
      }));

      setCountries(countryList);
      setCurrencies(currencyList);

      if (id) {
        const response = await API_BASE_URL.get(`/vendor/get/${id}`);
        const v = response.data?.data;

        if (v) {
          if (v.country) {
            await fetchCities(v.country); 
          }

          setFormData({
            vendorName: v.vendorName || '',
            vendorCode: v.vendorCode || '',
            vendorType: v.vendorType || '',
            taxRegNo: v.taxRegNo || '',
            companyRegNo: v.companyRegNo || '',
            defaultCurrencyId: currencyList.find(c => c.label === v.defaultCurrency)?.value || '',
            address1: v.address1 || '',
            address2: v.address2 || '',
            postalCode: v.postalCode || '',
            country: v.country || '',
            city: v.city || '', 
            bankAcctName: v.bankAcctName || '',
            bankAccountNum: v.bankAccountNum || '',
            bankName: v.bankName || '',
            bankBranchName: v.bankBranchName || '',
            bankSwiftCode: v.bankSwiftCode || ''
          });

          
          setContacts(Array.isArray(v.contacts) ? v.contacts.map(c => ({
            id: c.id || '',
            name: c.name || '',
            email: c.email || '',
            phone: c.phone || '',
            isDefault: c.isDefault || false
          })) : []);
        }
      }
    } catch (error) {
      toast.error('Error loading vendor or metadata');
      console.error(error);
    }
  };

  fetchData();
}, [id]);




  const fetchCities = async (countryName) => {
  try {
    const response = await API_BASE_URL.get('/countryCities/get', { country: countryName });

    const cityList = response.data?.data || [];
    setCities(cityList?.filter(data => data.countryName === countryName)?.map(city => ({ label: city.name, value: city.name })) || []);
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
    const payload = {
      id,
      ...formData,
      contacts
    };

    const response = await API_BASE_URL.put(
      '/vendor/update',
      payload
    );

    if (response.status === 200) {
      toast.success('Vendor updated successfully');
    } else {
      toast.error('Failed to update vendor');
    }
  } catch (err) {
    console.error('Update error:', err);
    toast.error('Error occurred while updating vendor');
  }
};


  const addContact = () => {
    setContacts([...contacts, { name: '', email: '', phone: '', isDefault: false }]);
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    console.log(contacts)
    updated[index][field] = value;
    setContacts(updated);
  };

  const deleteContact = async (index, contactId) => {
  if (!contactId) {
    
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);
    return;
  }

  try {
    const res = await API_BASE_URL.post('/vendor/contact/delete', {
      id: contactId
    });

    if (res.status === 200) {
      toast.success('Contact deleted successfully');
      const updated = [...contacts];
      updated.splice(index, 1);
      setContacts(updated);
    } else {
      toast.error('Failed to delete contact');
    }
  } catch (err) {
    console.error('Delete error:', err);
  }
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
          <div className="form-group"><label>Tax Reg. No</label><input value={formData.taxRegNo} onChange={e => handleChange('taxReg', e.target.value)} /></div>
          <div className="form-group"><label>Company Reg No</label><input value={formData.companyRegNo} onChange={e => handleChange('companyReg', e.target.value)} /></div>
          <div className="form-group"><label>Currency</label>
           <Select
              options={currencies}
              value={currencies.filter(c => c.value === formData.defaultCurrencyId)}
              onChange={(opt) => handleChange('defaultCurrencyId', opt.value)}
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
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
        </div>

        <div className="card-section">
          
          <h5>Bank Info</h5>
          <div className="form-group"><label>Account Name</label><input value={formData.bankAcctName} onChange={e => handleChange('accountName', e.target.value)} /></div>
          <div className="form-group"><label>Account Number</label><input value={formData.bankAccountNum} onChange={e => handleChange('accountNumber', e.target.value)} /></div>
          <div className="form-group"><label>Bank Name</label><input value={formData.bankName} onChange={e => handleChange('bankName', e.target.value)} /></div>
          <div className="form-group"><label>Branch</label><input value={formData.bankBranchName} onChange={e => handleChange('branch', e.target.value)} /></div>
          <div className="form-group"><label>SWIFT Code</label><input value={formData.bankSwiftCode} onChange={e => handleChange('swiftCode', e.target.value)} /></div>
        </div>

        <div className="card-section">
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
                  <td><input placeholder='Phone' value={contact.mobileNo} onChange={(e) => updateContact(index, 'phone', e.target.value)} /></td>
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
                <button className='btn-delete' type="button"  onClick={() => deleteContact(index, contact.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-add mt-2" onClick={addContact}>+ Add Contact</button>
        </div>
        <div className="submit-form" >
         <button type="submit" className="btn btn-submit">Update Vendor</button>
         <button type="button" className="btn btn-back" onClick={() => {
            navigate('/dashboard');
            toast.success('Fetched to Vendors')
          }}> Back</button>
      </div>
      </form>
    </div>
  );
};

export default VendorEdit;
