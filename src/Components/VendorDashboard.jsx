// src/components/VendorDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVendors,
  selectVendor,
  fetchCountries,
  fetchCurrencies,
  fetchCities,
  createVendorRequest
} from '../redux/vendor/vendorSlice';
import VendorModal from './VendorModal';

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const { vendors, selectedVendor, countries, cities, currencies, loading } = useSelector((state) => state.vendor);

  useEffect(() => {
    dispatch(fetchVendors());
    dispatch(fetchCountries());
    dispatch(fetchCurrencies());
  }, [dispatch]);

  const handleSelect = (vendor) => {
    dispatch(selectVendor(vendor));
    dispatch(fetchCities(vendor.country));
  };

  const handleCreateOrUpdate = (vendorData) => {
    dispatch(createVendorRequest(vendorData));
  };

  return (
    <div className="vendor-dashboard">
      <h2>Vendors List</h2>
      {loading && <p>Loading...</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>City</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleSelect(vendor)}>
                {vendor.name}
              </td>
              <td>{vendor.email}</td>
              <td>{vendor.country}</td>
              <td>{vendor.city}</td>
              <td>{vendor.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVendor && (
        <VendorModal
          vendor={selectedVendor}
          countries={countries}
          cities={cities}
          currencies={currencies}
          onSave={handleCreateOrUpdate}
        />
      )}
    </div>
  );
};

export default VendorDashboard;
