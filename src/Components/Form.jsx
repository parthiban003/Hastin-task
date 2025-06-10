import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha'; // 🆕
import './Form.css';
import pic1 from '../assets/pic1.avif';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isOTPTimerActive, setIsOTPTimerActive] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false); // 🆕

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setLoginError('Please verify the captcha.');
      return;
    }

    try {
      const res = await axios.get(`https://682c6773d29df7a95be6e6ee.mockapi.io/RegisterUsers`);
      const user = res.data.find(
        (u) => u.username === form.username && u.password === form.password
      );

      if (user) {
        setShowOTP(true);
        setIsOTPTimerActive(true);
        setLoginError('');
        setTimer(60);
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
      setOtpMessage('✅ Login successful with OTP!');
    } else {
      setOtpMessage('❌ Invalid OTP. Please try again.');
    }
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
      <div className="login-left">
        <img src={pic1} alt="Illustration" />
      </div>
      <div className="login-right">
        <h2>Welcome! Log In</h2>
        {!showOTP ? (
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

            {/* reCAPTCHA Checkbox */}
            <ReCAPTCHA
              sitekey="6LdhYVsrAAAAAOol5pu8IA1RnM3e3OiYeKoI8lhe" 
              onChange={handleCaptchaChange}
            />

            {loginError && <p className="error">{loginError}</p>}
            <a href="/" className="forgot-link">🔒 Forgot password?</a>
            <button type="submit" className="login-btn">Login</button>
          </form>
        ) : (
          <div>
            <h4>Enter OTP (sent to your email/mobile)</h4>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setOtpMessage('');
              }}
              placeholder="Enter OTP"
              maxLength={6}
            />
            <p>⏳ Time remaining: {timer}s</p>
            <button onClick={handleOTPSubmit} disabled={timer === 0}>
              Verify OTP
            </button>
            {otpMessage && (
              <p className={otpMessage.includes('success') ? 'success' : 'error'}>
                {otpMessage}
              </p>
            )}
            {timer === 0 && (
              <p className="error">OTP expired. Please refresh and try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
