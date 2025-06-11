import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import OTPModal from './OTPModal';
import Loader from './Loader';
import pic1 from '../assets/pic1.avif';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isOTPTimerActive, setIsOTPTimerActive] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`https://hastin-container.com/staging/app/auth/login`);
      const user = res.data.find(
        (u) => u.username === form.username && u.password === form.password
      );

      if (user) {
        setIsLoading(true);
        setLoginError('');
        setTimeout(() => {
          setIsLoading(false);
          setShowOTPModal(true);
          setIsOTPTimerActive(true);
          setTimer(60);
        }, 2000); // simulate loader time
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Login failed');
    }
  };

  const handleOTPSubmit = () => {
    if (otp === '123456') {
      alert('✅ Login successful with OTP!');
      setShowOTPModal(false);
    } else {
      alert('❌ Invalid OTP');
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    setTimer(60);
    setIsOTPTimerActive(true);
  };

  useEffect(() => {
    let countdown;
    if (isOTPTimerActive && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isOTPTimerActive, timer]);

  return (
    <div className="login-container">
      {isLoading && <Loader />}
      {showOTPModal && (
        <OTPModal
          otp={otp}
          setOtp={setOtp}
          timer={timer}
          onVerify={handleOTPSubmit}
          onResend={handleResendOTP}
        />
      )}
      <div className="login-left">
        <img src={pic1} alt="Illustration" />
      </div>
      <div className="login-right">
        <h2>Welcome! Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="User Name"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {loginError && <p className="error">{loginError}</p>}
          <a href="/" className="forgot-link">🔒 Forgot password?</a><br /><br />
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
