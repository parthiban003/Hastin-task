// VendorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorsByStatus } from '../Redux/Vendors/vendorActions'; // custom action
import './Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const VendorDashboard = () => {
  const dispatch = useDispatch();
  const { vendors, loading } = useSelector(state => state.vendor);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchVendorsByStatus(activeTab));
    toast.success(`Switched to ${activeTab.toUpperCase()} vendors`);
  }, [activeTab, dispatch]);

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="vendor-dashboard">
      <ToastContainer />
      <div className="vendor-header">
        <h2>HASTIN</h2>
        <div className="profile-icon">👤</div>
      </div>

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
        <button className="new-vendor-btn">+ New Vendor</button>
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="vendor-table">
        <table>
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
            {filteredVendors.length === 0 && !loading && (
              <tr><td colSpan="8">No vendors found.</td></tr>
            )}
            {filteredVendors.map((vendor, index) => (
              <tr key={vendor.id}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.vendorCode}</td>
                <td>{vendor.vendorType}</td>
                <td>{vendor.address}</td>
                <td>{vendor.country}</td>
                <td>
                  <span className={`status-badge ${vendor.status.toLowerCase()}`}>
                    {vendor.status.toUpperCase()}
                  </span>
                </td>
                <td><span className="action-dots">⋯</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorDashboard;
