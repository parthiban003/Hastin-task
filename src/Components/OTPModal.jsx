import React from 'react';
import './OTP.css';
import Loader from './Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OTPModal = ({ captcha, otp, timer, onVerify, onResend, onClose, loading }) => {
  return (
    <div className="otp-overlay">
      <div className="otp-modal">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2>OTP Verification</h2>
            <button className="otp-close" onClick={onClose}>×</button>
            <p>Please enter the OTP sent to your registered number.</p>
            <div className="otp-inputs">
              <input type="text" value={captcha} readOnly />
              <input type="text" value={otp} readOnly />
            </div>
            <div className="otp-timer">
              ⏳ {`1:${timer < 10 ? `0${timer}` : timer}`}
            </div>
            <div className="otp-actions">
              <button
                className="otp-submit"
                onClick={() => {
                  toast.success("OTP Submitted");
                  toast.success("Login Successfully");
                  onVerify();
                }}
              >
                Submit
              </button>
              <button
                className="otp-resend"
                onClick={onResend}
                disabled={timer > 0}
                style={{
                  opacity: timer > 0 ? 0.6 : 1,
                  cursor: timer > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Resend OTP
              </button>

            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default OTPModal;
