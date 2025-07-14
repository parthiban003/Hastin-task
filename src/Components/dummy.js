import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import API_BASE_URL from './axiosInstance';
import { CREATE_VENDOR_REQUEST } from '../Redux/Vendors/vendorTypes';
import { createVendorRequest, createVendorSuccess } from '../Redux/Vendors/vendorActions';

const VendorCreate = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch('https://hastin-container.com/staging/api/meta/country')
      .then(res => res.json())
      .then(data => setCountries(data?.data?.map(c => ({ value: c.name, label: c.name })) || []));

    fetch('https://hastin-container.com/staging/api/meta/currencies')
      .then(res => res.json())
      .then(data => setCurrencies(
        data?.data?.map(c => ({ value: c.id, label: c.name, fullData: c })) || []
      ));
  }, []);

  const fetchCities = async (country) => {
    try {
      const res = await API_BASE_URL.get('/countryCities/get', { country });
      const cityList = res?.data?.data || [];
      setCities(cityList?.filter(city => city.countryName === country).map(city => ({ value: city.name, label: city.name })));
    } catch (err) {
      toast.error('Failed to fetch cities');
    }
  };

  const initialValues = {
    vendorName: '', vendorCode: '', vendorType: '',
    taxRegNo: '', companyRegNo: '', defaultCurrencyId: '',
    address1: '', address2: '', postalCode: '', country: '', city: '',
    bankAcctName: '', bankAccountNum: '', bankName: '', bankBranchName: '', bankSwiftCode: '',
    contacts: [{ name: '', email: '', mobile: '', isDefault: 'no' }]
  };

  const validationSchema = Yup.object().shape({
    vendorName: Yup.string().required('Required'),
    vendorCode: Yup.string().required('Required'),
    vendorType: Yup.string().required('Required'),
    taxRegNo: Yup.string().required('Required'),
    companyRegNo: Yup.string().required('Required'),
    defaultCurrencyId: Yup.string().required('Required'),
    address1: Yup.string().required('Required'),
    postalCode: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    contacts: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        mobile: Yup.string().matches(/^\d{10}$/, 'Mobile must be 10 digits').required('Required'),
        isDefault: Yup.string().required('Required')
      })
    )
  });
 

 const dispatch = useDispatch();

const onSubmit = (values, { setSubmitting }) => {
  
  const contacts = values.contacts.map(c => ({
    name: c.name,
    email: c.email,
    phoneNo: c.mobile,
    isDefault: c.isDefault || false,
  }));

  
  const formData = {
    vendorName: values.vendorName,
    vendorCode: values.vendorCode,
    vendorType: values.vendorType,
    companyRegNo: values.companyRegNo,
    taxRegNo: values.taxRegNo,
    address1: values.address1,
    address2: values.address2,
    postalCode: values.postalCode,
    country: values.country, 
    cityId: values.city,    
    createdBy: values.createdBy || null, 
  };

  dispatch(createVendorRequest({
    formData,
    contacts,
  }));

  setSubmitting(false);
};




  return (
    <div className="edit-vendor-container">
      <h2>Create New Vendor</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="edit-vendor-form">
           
            <div className="card-section">
              <h5>Vendor Details</h5>
              <div className="form-group">
                <Field name="vendorName" placeholder="Vendor Name" />
                <ErrorMessage name="vendorName" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Field name="vendorCode" placeholder="Vendor Code" />
                <ErrorMessage name="vendorCode" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Field as="select" name="vendorType">
                  <option value="">Select Type</option>
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                </Field>
                <ErrorMessage name="vendorType" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Field name="taxRegNo" placeholder="Tax Reg No" />
                <ErrorMessage name="taxRegNo" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Field name="companyRegNo" placeholder="Company Reg No" readOnly />
                <ErrorMessage name="companyRegNo" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Select
                  options={currencies}
                  value={currencies.find(c => c.value === values.defaultCurrencyId)}
                  onChange={(opt) => {
                    setFieldValue('defaultCurrencyId', opt.value);
                    setFieldValue('companyRegNo', opt.fullData.id);
                  }}
                />
                <ErrorMessage name="defaultCurrencyId" component="div" className="error-text" />
              </div>
            </div>

           
            <div className="card-section">
              <h5>Address</h5>
              <div className="form-group">
                <Field name="address1" placeholder="Address Line 1" />
                <ErrorMessage name="address1" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Field name="address2" placeholder="Address Line 2" />
              </div>
              <div className="form-group">
                <Field name="postalCode" placeholder="Postal Code" />
                 <ErrorMessage name="postalCode" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Select
                  placeholder="Country"
                  options={countries}
                  value={countries.find(c => c.value === values.country)}
                  onChange={(opt) => {
                    setFieldValue('country', opt.value);
                    setFieldValue('city', '');
                    fetchCities(opt.value);
                  }}
                />
                <ErrorMessage name="country" component="div" className="error-text" />
              </div>
              <div className="form-group">
                <Select
                  placeholder="city"
                  options={cities}
                  value={cities.find(c => c.value === values.city)}
                  onChange={(opt) => setFieldValue('city', opt.value)}
                />
                <ErrorMessage name="city" component="div" className="error-text" />
              </div>
            </div>

            {/* BANK INFO */}
            <div className="card-section">
              <h5>Bank Info</h5>
              <div className="form-group"><Field name="bankAcctName" placeholder="Account Name" /></div>
              <div className="form-group"><Field name="bankAccountNum" placeholder="Account Number" /></div>
              <div className="form-group"><Field name="bankName" placeholder="Bank Name" /></div>
              <div className="form-group"><Field name="bankBranchName" placeholder="Branch Name" /></div>
              <div className="form-group"><Field name="bankSwiftCode" placeholder="SWIFT Code" /></div>
            </div>

            {/* CONTACT INFO */}
            <div className="contact-section">
              <h5>Contact Info</h5>
              <FieldArray name="contacts">
                {({ push, remove }) => (
                  <table className="contact-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Mobile</th><th>Is Default</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {values.contacts.map((contact, i) => (
                        <tr key={i}>
                          <td>
                            <Field name={`contacts[${i}].name`} placeholder="Name" />
                            <ErrorMessage name={`contacts[${i}].name`} component="div" className="error-text" />
                          </td>
                          <td>
                            <Field name={`contacts[${i}].email`} placeholder="Email" />
                            <ErrorMessage name={`contacts[${i}].email`} component="div" className="error-text" />
                          </td>
                          <td>
                            <Field name={`contacts[${i}].mobile`} placeholder="Mobile" />
                            <ErrorMessage name={`contacts[${i}].mobile`} component="div" className="error-text" />
                          </td>
                          <td>
                            <Field as="select" name={`contacts[${i}].isDefault`}>
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </Field>
                          </td>
                          <td>
                            {values.contacts.length > 1 && (
                              <button type="button" className="btn-delete" onClick={() => remove(i)}>
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5}>
                          <button type="button" className="btn-add" onClick={() => push({ name: '', email: '', mobile: '', isDefault: 'no' })}>+ Add Contact</button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </FieldArray>
            </div>

            <div className="submit-form">
              <button type="submit" className="btn btn-submit" disabled={isSubmitting}>Create Vendor</button>
              <button type="button" className="btn btn-back" onClick={() => navigate('/dashboard')}>Cancel</button>
             
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VendorCreate;
