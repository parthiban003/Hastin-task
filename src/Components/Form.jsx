import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import OTPModal from './OTPModal';
import Loader from './Loader';
import pic1 from '../assets/pic1.avif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
          toast.info('OTP sent to your registered number!');
        }, 2000);
      } else {
        setLoginError('Invalid username or password');
        toast.error('❌ Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Login failed');
      toast.error('❌ Login failed. Please try again later.');
    }
  };

  const handleOTPSubmit = () => {
    if (otp === '123456') {
      toast.success('✅ Login successful with OTP!');
      setShowOTPModal(false);
    } else {
      toast.error('❌ Invalid OTP');
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    setTimer(60);
    setIsOTPTimerActive(true);
    toast.info('📩 OTP resent!');
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
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label className="show-password-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            /> Show Password
          </label><br />

          {loginError && <p className="error">{loginError}</p>}
          <a href="/" className="forgot-link">🔒 Forgot password?</a><br /><br />
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default LoginPage;
