import React from 'react';
import './Form.css';

const Loader = () => (
  <div className="loader-overlay">
    <div className="spinner"></div><br />
    <div><h5 style={{color:'black', display:'block'}}>Loading...</h5></div>
  </div>
);

export default Loader;
