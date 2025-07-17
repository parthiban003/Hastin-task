import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  vendorUpdateRequest,
  fetchInactiveVendorsRequest,
  markInactiveRequest,
  markActiveRequest
} from '../Redux/Vendors/vendorActions';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEdit, faCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './Vendor.css';

const ROWS_PER_PAGE = 15;

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { vendors = [], inactiveVendors = [], loading, } = useSelector(
    state => state.vendor || {}
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [actionMenu, setActionMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (activeTab === 'ACTIVE') {
      dispatch(vendorUpdateRequest());
    } else {
      dispatch(fetchInactiveVendorsRequest());
    }
  }, [activeTab, dispatch]);

  const dataToDisplay = Array.isArray(activeTab === 'ACTIVE' ? vendors : inactiveVendors)
    ? (activeTab === 'ACTIVE' ? vendors : inactiveVendors)
    : [];

  const filteredVendors = dataToDisplay.filter(v =>
    v.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVendors.length / ROWS_PER_PAGE);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleConfirmAction = () => {
    if (!selectedVendorId) return;
    if (confirmAction === 'INACTIVE') {
      dispatch(markInactiveRequest(selectedVendorId));
      toast.success("Vendor marked as Inactive");
    } else {
      dispatch(markActiveRequest(selectedVendorId));
      toast.success("Vendor marked as Active");
    }
    setConfirmModal(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.btn-action') && !e.target.closest('.action-dropdown')) {
        setActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="vendor-container">
      
      <div className="topbar-wrapper">
        <h2>HASTIN</h2>
        <Dropdown align="end">
          <Dropdown.Toggle variant="white" className="icon-toggle" title='Logout'>
            <FontAwesomeIcon icon={faUserCircle} size="lg" title='Logout'/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout} className='logout-btn'>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

     
      <div className="vendor-header">
        <div className="tabs">
          {['ACTIVE', 'INACTIVE'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <button onClick={() => {navigate('/vendorcreate');
        }} className="btn-new">
          + New Vendor
        </button>
      </div>

      
      <div className="vendor-toolbar">
        <input
          type="text"
          id='vendor-search'
          name='search'
          placeholder="Search"
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

     
      <div className="table-scroll">
        {loading ? (
          <div className="status-msg">Loading...</div>
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
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No vendors found.</td>
                </tr>
              ) : (
                paginatedVendors.map((vendor, index) => (
                  <tr key={vendor.id}>
                    <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                    <td>{vendor.vendorName}</td>
                    <td>{vendor.vendorCode}</td>
                    <td>{vendor.vendorType}</td>
                    <td title={vendor.dispAddress} style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {vendor.dispAddress}
                    </td>
                    <td>{vendor.country}</td>
                    <td>
                      <span className={`badge badge-${vendor.status?.toLowerCase()}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td style={{ position: 'relative' }}>
                      <button
                        className="btn-action"
                        title='Edit & Action'
                        onClick={() => {
                          setActionMenu(actionMenu === vendor.id ? null : vendor.id);
                        }}
                      >
                        &#8942;
                      </button>
                      {actionMenu === vendor.id && (
                        <div className="action-dropdown">
                          <button
                            className="dropdown-btn edit-btn"
                            onClick={() => {
                              navigate(`/vendoredit/${vendor.id}`);
                              setActionMenu(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                          <button
                            className="dropdown-btn inactive-btn"
                            onClick={() => {
                              setSelectedVendorId(vendor.id);
                              setConfirmAction(vendor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
                              setConfirmModal(true);
                              setActionMenu(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faCircle} color= {vendor.status === 'ACTIVE' ? 'red' : 'green'} />
                            {vendor.status === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      
      {confirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to mark this vendor as <b>{confirmAction}</b>?</p>
            <div className="modal-buttons">
              <button className="btn-yes" onClick={handleConfirmAction}>Yes</button>
              <button className="btn-cancel" onClick={() => setConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      
      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          &lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={i + 1 === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default VendorDashboard;
