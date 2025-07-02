import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accesscodeRequest, resendOtpRequest, clearAccessCodeData } from '../Redux/AccessCode/accessCodeActions';
import { useNavigate } from 'react-router-dom';
import './OTP.css';
import { toast } from 'react-toastify';


const AccessCodeModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const { accessCodeStatus, loading, error } = useSelector(state => state.accessCode || {});
  const finalOpaque = localStorage.getItem('opaque') || '';
  const finalAccessCode = localStorage.getItem('accessCode') || '';

  const navigate = useNavigate();

useEffect(() => {
  if (accessCodeStatus?.status === 200 && accessCodeStatus?.data?.otpVerified) {
    toast.success('OTP Verified Successfully!');
    onClose(); 
    navigate('/dashboard'); 
  }
}, [accessCodeStatus, navigate, onClose]);

  const [countdown, setCountdown] = useState(90);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(6);
      setShowResend(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResend(true);
      dispatch(clearAccessCodeData());
    }
  }, [countdown, isOpen, dispatch]);

  const handleSubmit = () => {
    if (finalOpaque && finalAccessCode) {
      dispatch(accesscodeRequest({ opaque: finalOpaque, accessCode: Number(finalAccessCode) }));
    }
  };

  const handleResend = () => {
    dispatch(resendOtpRequest());
    setCountdown(6);
    setShowResend(false);
  };

  if (!isOpen) return null;

  return (
    <div className="custom-backdrop">
      <div className="otp-modal rounded">
        <button className="btn-close float-end" onClick={onClose}></button>
        <h5 className="text-center fw-bold mb-3">OTP Verification</h5>

        <p className="text-center text-muted">
          Please enter the OTP sent to your registered number.
        </p>

        <div className="d-flex justify-content-center gap-2 my-3">
          <input className="form-control text-center" value={finalOpaque} readOnly style={{ width: 150 }} />
          <input className="form-control text-center" value={finalAccessCode} readOnly style={{ width: 100 }} />
        </div>

        <div className="text-center text-muted mb-3">
          ⏳ {showResend ? '00:00' : `0${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
        </div>

        <button
          className={`btn w-100 ${showResend ? 'btn-danger' : 'btn-primary'}`}
          onClick={showResend ? handleResend : handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="spinner-border spinner-border-sm me-2" /> : showResend ? 'Resend OTP' : 'Submit'}
        </button>

        {accessCodeStatus?.data?.message && (
          <div className="alert alert-success mt-3 text-center">{accessCodeStatus.data.message}</div>
        )}

        {error && (
          <div className="alert alert-danger mt-3 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default AccessCodeModal;
