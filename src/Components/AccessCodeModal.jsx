import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accesscodeRequest, resendOtpRequest, clearAccessCodeData } from '../Redux/AccessCode/accessCodeActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './OTP.css';

const AccessCodeModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accessCodeStatus, loading, error } = useSelector(state => state.accessCode || {});
  const finalOpaque = localStorage.getItem('opaque') || '';
  const finalAccessCode = localStorage.getItem('accessCode') || '';

  const [countdown, setCountdown] = useState(90);
  const [showResend, setShowResend] = useState(false);
  const [submitted, setSubmitted] = useState(false); 

  
  useEffect(() => {
    if (isOpen) {
      setCountdown(90);
      setShowResend(false);
      setSubmitted(false);
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
      setSubmitted(true); 
      toast.success('Login Successfull')
      navigate('/dashboard')
    }
  };

  
  useEffect(() => {
    if (submitted && accessCodeStatus?.status === 200) {
      toast.success('OTP Verified. Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [accessCodeStatus, submitted, navigate]);

  
  const handleResend = () => {
    dispatch(resendOtpRequest());
    setCountdown(90);
    setShowResend(false);
    toast.info('OTP resent!');
  };

  if (!isOpen) return null;

  return (
    <div className="custom-backdrop">
      <div className="otp-modal rounded">
        <button className="btn-close float-end" onClick={onClose}></button>
        <h5 className="text-center fw-bold mb-3">OTP Verification</h5>
        <p className="text-center text-muted">Please enter the OTP sent to your registered number.</p>

        <div className="d-flex justify-content-center gap-2 my-3">
          <input className="form-control text-center" value={finalOpaque} readOnly style={{ width: 150 }} />
          <input className="form-control text-center" value={finalAccessCode} readOnly style={{ width: 100 }} />
        </div>

        <div className="text-center text-muted mb-3">
          ⏳ {countdown > 0 ? `0${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : '00:00'}
        </div>

        <div className="otp-actions d-flex justify-content-between gap-3 px-2 mt-3">
          <button
            className="btn btn-primary flex-fill"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : 'Submit' }
          </button>

          <button
            className="btn btn-danger flex-fill"
            onClick={handleResend}
            disabled={countdown > 0}
            style={{ opacity: countdown > 0 ? 0.6 : 1, cursor: countdown > 0 ? 'not-allowed' : 'pointer' }}
          >
            Resend OTP
          </button>
        </div>

        {accessCodeStatus?.data?.message && (
          <div className="alert alert-success mt-3 text-center">{accessCodeStatus.data.message}</div>
        )}

        {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default AccessCodeModal;
