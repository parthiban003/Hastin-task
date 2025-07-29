import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API_BASE_URL from './axiosInstance';
import './VendorEdit.css';

const VendorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countryRes, currencyRes] = await Promise.all([
          API_BASE_URL.get('/meta/country'),
          API_BASE_URL.get('/meta/currencies'),
        ]);

        const countryList = countryRes.data.data.map(c => ({ value: c.id, label: c.name }));
        const currencyList = currencyRes.data.data.map(c => ({ value: c.id, label: c.name }));

        setCountries(countryList);
        setCurrencies(currencyList);

        if (id) {
          const response = await API_BASE_URL.get(`/vendor/get/${id}`);
          const v = response.data?.data;

          if (v?.country) {
            const cityOptions = await fetchCities(v.country);
            setCities(cityOptions);
          }

          setInitialValues({
            vendorName: v.vendorName || '',
            vendorCode: v.vendorCode || '',
            vendorType: v.vendorType || '',
            taxRegNo: v.taxRegNo || '',
            companyRegNo: v.companyRegNo || '',
            defaultCurrencyId: v.defaultCurrencyId || '',
            address1: v.address1 || '',
            address2: v.address2 || '',
            postalCode: v.postalCode || '',
            country: v.country || '',
            city: v.cityId || '',
            bankAcctName: v.bankAcctName || '',
            bankAccountNum: v.bankAccountNum || '',
            bankName: v.bankName || '',
            bankBranchName: v.bankBranchName || '',
            bankSwiftCode: v.bankSwiftCode || '',
            contacts: (v.contactList || []).map(c => ({
              id: c.id,
              name: c.name,
              email: c.email,
              phone: c.mobileNo,
              isDefault: c.isDefault ? 'YES' : 'NO',
            })),
          });
          setContacts((v.contactList || []).map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.mobileNo,
            isDefault: c.isDefault ? 'YES' : 'NO',
          })));
        }
      } catch (error) {
        toast.error('Error loading vendor or metadata');
      }
    };

    fetchData();
  }, [id]);

  const fetchCities = async (countryId) => {
    try {
      const res = await API_BASE_URL.get('/countryCities/get', {
        params: { country: countryId },
      });

      const data = res.data?.data || [];
      return data.map(c => ({ label: c.name, value: c.id, countryId: c.countryId }));
    } catch (error) {
      toast.error('Failed to fetch cities');
      return [];
    }
  };

  const validationSchema = Yup.object().shape({
    vendorName: Yup.string().required('Required'),
    vendorCode: Yup.string().required('Required'),
    vendorType: Yup.string().required('Required'),
    taxRegNo: Yup.string().required('Required'),
    companyRegNo: Yup.string().required('Required'),
    defaultCurrencyId: Yup.string().required('Required'),
    address1: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    contacts: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        phone: Yup.string().required('Required'),
        isDefault: Yup.string().oneOf(['YES', 'NO']).required('Required'),
      })
    ),
  });

  const handleSubmit = async (values) => {
    const formattedContacts = values.contacts.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      mobileNo: c.phone,
      isDefault: c.isDefault === 'YES',
    }));

    const defaultCount = formattedContacts.filter(c => c.isDefault).length;
    if (defaultCount !== 1) {
      toast.error("Exactly one contact must be marked as default.");
      return;
    }

    const payload = {
      id,
      vendorName: values.vendorName,
      vendorCode: values.vendorCode,
      vendorType: values.vendorType,
      taxRegNo: values.taxRegNo,
      companyRegNo: values.companyRegNo,
      defaultCurrencyId: values.defaultCurrencyId,
      address1: values.address1,
      address2: values.address2,
      postalCode: values.postalCode,
       country: values.country,
      cityId: values.city,
      bankAcctName: values.bankAcctName,
      bankAccountNum: values.bankAccountNum,
      bankName: values.bankName,
      bankBranchName: values.bankBranchName,
      bankSwiftCode: values.bankSwiftCode,
      contacts: formattedContacts,
    };

    try {
      const res = await API_BASE_URL.put('/vendor/update', payload);
      if (res.status === 200) {
        toast.success('Vendor updated successfully');
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Error occurred while updating vendor');
    }
  };

  if (!initialValues) return <p>Loading...</p>;

  return (
    <div className="edit-vendor-container">
      <div className='header'>
        <h2>Edit Vendor</h2>
      </div><br />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="edit-vendor-form">
            <div className="card-section">
              <h5>Basic Info</h5>
              <div className="form-group"><label>Vendor Name</label><Field name="vendorName" /><ErrorMessage name="vendorName" component="div" className="error" /></div>
              <div className="form-group"><label>Vendor Code</label><Field name="vendorCode" /><ErrorMessage name="vendorCode" component="div" className="error" /></div>
              <div className="form-group"><label>Vendor Type</label>
                <Field as="select" name="vendorType">
                  <option value="">Select</option>
                  <option>Company</option>
                  <option>Individual</option>
                </Field>
                <ErrorMessage name="vendorType" component="div" className="error" />
              </div>
              <div className="form-group"><label>Tax Reg. No</label><Field name="taxRegNo" /><ErrorMessage name="taxRegNo" component="div" className="error" /></div>
              <div className="form-group"><label>Company Reg No</label><Field name="companyRegNo" /><ErrorMessage name="companyRegNo" component="div" className="error" /></div>
              <div className="form-group"><label>Currency</label>
                <Field as="select" name="defaultCurrencyId">
                  <option value="">Select Currency</option>
                  {currencies.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Field>
                <ErrorMessage name="defaultCurrencyId" component="div" className="error" />
              </div>
            </div>

            <div className="card-section">
              <h5>Address</h5>
              <div className="form-group"><label>Address 1</label><Field name="address1" /><ErrorMessage name="address1" component="div" className="error" /></div>
              <div className="form-group"><label>Address 2</label><Field name="address2" /></div>
              <div className="form-group"><label>Postal Code</label><Field name="postalCode" /></div>
              <div className="form-group"><label>Country</label>
                <Field as="select" name="country" onChange={async (e) => {
                  const value = e.target.value;
                  setFieldValue('country', value);
                  setFieldValue('city', '');
                  const updatedCities = await fetchCities(value);
                  setCities(updatedCities);
                }}>
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Field>
                <ErrorMessage name="country" component="div" className="error" />
              </div>
              <div className="form-group"><label>City</label>
                <Field as="select" name="city">
                  <option value="">Select City</option>
                  {cities
                    .filter(city => city.countryId === values.country)
                    .map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </Field>
                <ErrorMessage name="city" component="div" className="error" />
              </div>
            </div>

            <div className="card-section">
              <h5>Bank Info</h5>
              <div className="form-group"><label>Account Name</label><Field name="bankAcctName" /></div>
              <div className="form-group"><label>Account Number</label><Field name="bankAccountNum" /></div>
              <div className="form-group"><label>Bank Name</label><Field name="bankName" /></div>
              <div className="form-group"><label>Branch</label><Field name="bankBranchName" /></div>
              <div className="form-group"><label>SWIFT Code</label><Field name="bankSwiftCode" /></div>
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
                  {values.contacts.map((contact, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><Field name={`contacts[${index}].name`} placeholder="Name" /></td>
                      <td><Field name={`contacts[${index}].email`} placeholder="Email" /></td>
                      <td><Field name={`contacts[${index}].phone`} placeholder="Phone" type="number"/></td>
                      <td>
                        <Field as="select" name={`contacts[${index}].isDefault`}>
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </Field>
                      </td>
                      <td>
                        <button type="button" className="btn-delete" onClick={() => {
                          const updated = [...contacts];
                          updated.splice(index, 1);
                          setContacts(updated);
                          setFieldValue('contacts', updated);
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="btn-add mt-2" onClick={() => {
                const updated = [...contacts, { name: '', email: '', phone: '', isDefault: 'NO' }];
                setContacts(updated);
                setFieldValue('contacts', updated);
              }}>+ Add Contact</button>
            </div>

            <div className="submit-form">
              <button type="submit" className="btn btn-submit">Update Vendor</button>
              <button type="button" className="btn btn-back" onClick={() => {
                navigate('/dashboard');
                toast.success('Fetched to Vendors');
              }}>Back</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VendorEdit;
