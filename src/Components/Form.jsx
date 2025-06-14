import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import OTPModal from './OTPModal';
import Loader from './Loader';
import pic1 from '../assets/pic1.avif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isOTPTimerActive, setIsOTPTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://hastin-container.com/staging/app/auth/login',
        {
          userName: form.username,
          password: form.password,
          origin: "AGENT",
          recaptcha: ""
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 200) {
        toast.success('OTP sended successful!');
        setTimeout(() => {
          setIsLoading(false);
          setShowOTPModal(true);
          setIsOTPTimerActive(true);
          setTimer(60);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error('Login failed. Please try again later.');
    }
  };

  const handleOTPSubmit = () => {
    if (otp === '1234') {
      toast.success('Login successful!');
      localStorage.setItem('authToken', 'some-token'); // ✅ Save token
      setShowOTPModal(false);
      navigate('/dashboard'); // ✅ Redirect after success
    } else {
      toast.error('Invalid OTP');
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
      <ToastContainer />
      {isLoading && <Loader />}
      {showOTPModal && (
        <OTPModal
          otp={otp}
          setOtp={setOtp}
          timer={timer}
          onVerify={handleOTPSubmit}
          onResend={handleResendOTP}
          onClose={() => setShowOTPModal(false)}
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
          </label>
          <br />
          <a href="/" className="forgot-link">🔒 Forgot password?</a><br /><br />
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
