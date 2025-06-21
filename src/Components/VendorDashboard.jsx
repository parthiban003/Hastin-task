import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors } from '../Redux/Vendors/vendorSlice';
import './Vendor.css';
import { toast } from 'react-toastify';

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const { vendors, loading, error } = useSelector((state) => state.vendor || {});
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  

  useEffect(() => {
    dispatch(fetchVendors({ status: activeTab }));
  }, [dispatch, activeTab]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSwitchVendor = () => {
    toast.success('Switched to vendors');
  };

  return (
    <div className="vendor-dashboard">
      <div className="vendor-header">
        <h2>HASTIN</h2>
        <div className="tabs">
          <button
            className={activeTab === 'active' ? 'active' : ''}
            onClick={() => setActiveTab('active')}
          >
            ACTIVE
          </button>
          <button
            className={activeTab === 'inactive' ? 'active' : ''}
            onClick={() => setActiveTab('inactive')}
          >
            INACTIVE
          </button>
        </div>
        <div className="vendor-controls">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
            value={searchTerm}
          />
          <button className="vendor-btn" onClick={handleSwitchVendor}>+ New Vendor</button>
        </div>
      </div>

      <div className="vendor-table-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="vendor-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>NAME</th>
                <th>VENDOR CODE</th>
                <th>TYPE</th>
                <th>ADDRESS</th>
                <th>COUNTRY</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor, index) => (
                <tr key={vendor.id}>
                  <td>{index + 1}</td>
                  <td>{vendor.name}</td>
                  <td>{vendor.vendorCode}</td>
                  <td>{vendor.vendorType}</td>
                  <td>{vendor.address}</td>
                  <td>{vendor.country}</td>
                  <td>
                    <span className={`status ${vendor.status.toLowerCase()}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
