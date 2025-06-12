import React from 'react';
import './Form.css';


const OTPModal = ({ otp, setOtp, timer, onResend, onVerify }) => (
  <div className="otp-modal">
    <div className="otp-box">
      <h4>OTP VERIFICATION</h4>
      <p>Enter the OTP sent to your registered mobile</p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        placeholder="Enter OTP"
      />
      <p>⏳ Time remaining: {timer}s</p>
      <button onClick={onVerify}>Verify OTP</button>
      {timer === 0 && (
        <button className="resend-btn" onClick={onResend}>
          Resend OTP
        </button>
      )}
    </div>
  </div>
);

export default OTPModal;
