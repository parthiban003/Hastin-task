import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors } from '../Redux/Vendors/vendorSlice';

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const { vendors, loading } = useSelector((state) => state.vendor);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const filteredVendors = vendors?.filter((vendor) =>
    vendor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Vendor Master</h3>
        <button className="btn btn-success">+ New Vendor</button>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: '300px' }}
      />

      {loading ? (
        <p>Loading vendors...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
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
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor, index) => (
                  <tr key={vendor.id}>
                    <td>{index + 1}</td>
                    <td>{vendor.name}</td>
                    <td>{vendor.vendor_code}</td>
                    <td>{vendor.type}</td>
                    <td>{vendor.address}</td>
                    <td>{vendor.country}</td>
                    <td>{vendor.status}</td>
                    <td>
                      <span className="text-muted">...</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No vendors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
