// VendorCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from './axiosInstance';

const VendorCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorName: '', vendorCode: '', vendorType: '',
    taxRegNo: '', companyRegNo: '', defaultCurrencyId: '',
    address1: '', address2: '', postalCode: '', country: '', city: '',
    bankAcctName: '', bankAccountNum: '', bankName: '', bankBranchName: '', bankSwiftCode: ''
  });

  const [contacts, setContacts] = useState([{ name: '', email: '', mobile: '' }]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchCities = async (countryName) => {
    try {
      const response = await API_BASE_URL.get('/countryCities/get', { country: countryName });
      const cityList = response?.data?.data || [];
      setCities(cityList?.filter(data => data.countryName === countryName)?.map(city => ({ label: city.name, value: city.name })) || []);
    } catch (err) {
      console.error('City fetch error:', err);
      toast.error('Failed to fetch cities');
    }
  };

  useEffect(() => {
    if (formData.country) fetchCities(formData.country);
  }, [formData.country]);

  useEffect(() => {
    fetch('https://hastin-container.com/staging/api/meta/country')
      .then(res => res.json())
      .then(data => setCountries(data?.data?.map(c => ({ value: c.name, label: c.name })) || []));

    fetch('https://hastin-container.com/staging/api/meta/currencies')
      .then(res => res.json())
      .then(data => setCurrencies(
        data?.data?.map(c => ({
          value: c.id,
          label: c.name,
          fullData: c
        })) || []
      ));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const addContact = () => setContacts([...contacts, { name: '', email: '', mobile: '' }]);

  const removeContact = (index) => {
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = 'Required';
    });
    contacts.forEach((c, i) => {
      if (!c.name || !c.email || !c.mobile) newErrors[`contact-${i}`] = 'All contact fields required';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const vendorRes = await API_BASE_URL.post('/vendor/create', formData);
      const vendorId = vendorRes?.data?.data?.id || [];

      if (!vendorId) {
        toast.error('Vendor creation failed');
        return;
      }

      const contactPayload = contacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        isDefault: true,
        vendorId
      }));

      await API_BASE_URL.post('/vendor/contact/create', contactPayload);
      toast.success('Vendor created successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Creation error:', error);
      toast.error('Something went wrong');
    }
  };

  contacts.forEach((c, i) => {
    if (!c.name || !c.email || !c.mobile) {
      errors[`contact-${i}`] = 'Name required';
    } else {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(c.email)) {
        errors[`contact-email-${i}`] = 'Invalid email format';
      }


      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(c.mobile)) {
        errors[`contact-mobile-${i}`] = 'Mobile must be 10 digits';
      }
     
    }
  });


  return (
    <div className="edit-vendor-container">
      <h2>Create New Vendor</h2>
      <form className="edit-vendor-form" onSubmit={handleSubmit}>
        <div className="card-section">
          <h5>Vendor Details</h5>
          <div className="form-group">
            <label>Vendor Name</label>
            <input name="vendorName" value={formData.vendorName} onChange={handleInputChange} />
            {errors.vendorName && <span className="error-text">{errors.vendorName}</span>}
          </div>
          <div className="form-group">
            <label>Vendor Code</label>
            <input name="vendorCode" value={formData.vendorCode} onChange={handleInputChange} />
            {errors.vendorCode && <span className="error-text">{errors.vendorCode}</span>}
          </div>
          <div className="form-group">
            <label>Vendor Type</label>
            <select name="vendorType" value={formData.vendorType} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
            {errors.vendorType && <span className="error-text">{errors.vendorType}</span>}
          </div>
          <div className="form-group">
            <label>Tax Registration</label>
            <input name="taxRegNo" value={formData.taxRegNo} onChange={handleInputChange} />
            {errors.taxRegNo && <span className="error-text">{errors.taxRegNo}</span>}
          </div>
          <div className="form-group">
            <label>Company Registration No</label>
            <input name="companyReg" value={formData.companyRegNo} onChange={handleInputChange} readOnly />
            {errors.companyRegNo && <span className="error-text">{errors.companyRegNo}</span>}
          </div>
          <div className="form-group">
            <label>Currency</label>
            <Select
              options={currencies}
              value={currencies.find(c => c.value === formData.defaultCurrencyId)}
              onChange={(opt) => {
                setFormData(prev => ({
                  ...prev,
                  defaultCurrencyId: opt.value,
                  companyRegNo: opt.fullData.id
                }));
              }}
            />
            {errors.defaultCurrencyId && <span className="error-text">{errors.defaultCurrencyId}</span>}
          </div>
        </div>

        <div className="card-section">
          <h5>Address Info</h5>
          <div className="form-group">
            <label>Address Line 1</label>
            <input name="address1" value={formData.address1} onChange={handleInputChange} />
            {errors.address1 && <span className="error-text">{errors.address1}</span>}
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
            {errors.country && <span className="error-text">{errors.country}</span>}
          </div>
          <div className="form-group">
            <label>City</label>
            <Select
              options={cities}
              value={cities.find(c => c.value === formData.city)}
              onChange={opt => setFormData(prev => ({ ...prev, city: opt.value }))}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
        </div>

        <div className="card-section">
          <h5>Bank Info</h5>
          <div className="form-group">
            <label>Account Name</label>
            <input name="bankAcctName" value={formData.bankAcctName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input name="bankAccountNum" type="number" value={formData.bankAccountNum} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <input name="bankName" value={formData.bankName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Branch</label>
            <input name="bankBranchName" value={formData.bankBranchName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>SWIFT Code</label>
            <input name="bankSwiftCode" value={formData.bankSwiftCode} onChange={handleInputChange} />
          </div>
        </div>

        <div className="contact-section">
          <h5>Contact Info</h5>
          <table className="contact-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Mobile</th><th>Is Default</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={index}>
                  <td>
                    <input
                      value={contact.name}
                      placeholder="Name"
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    />
                    {errors[`contact-${index}`] && <div className="error-text">{errors[`contact-${index}`]}</div>}
                  </td>
                  <td>
                    <input
                      value={contact.email}
                      placeholder="Email"
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    />
                    {errors[`contact-email-${index}`] && <div className="error-text">{errors[`contact-email-${index}`]}</div>}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={contact.mobile}
                      placeholder="Mobile"
                      onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                    />
                    {errors[`contact-mobile-${index}`] && <div className="error-text">{errors[`contact-mobile-${index}`]}</div>}
                  </td>
                  <td><select name="default">
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    </select></td>
                  <td>
                    {contacts.length > 1 && (
                      <button className="btn-delete" type="button" onClick={() => removeContact(index)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className='btn-add' type="button" onClick={addContact}> + Add Contact</button>
        </div>
        <div className='submit-form'>
          <button className="btn btn-submit" type="submit">Create Vendor</button>
          <button className="btn btn-back" type="button" onClick={() => { navigate('/dashboard'); toast.info('Fetched to vendors'); }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default VendorCreate;
