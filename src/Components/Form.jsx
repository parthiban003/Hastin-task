import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
import Loader from './Loader';
import pic1 from '../assets/pic1.avif';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessCodeModal from './AccessCodeModal';
import API_BASE_URL from './axiosInstance';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
     const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  
  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.username.trim()) {
      newErrors.username = 'required';
    }
    if (!form.password.trim()) {
      newErrors.password = 'required';
    }

    setErrors(newErrors);
    setIsLoading(true);

    try {
      const res = await API_BASE_URL.post(
        'https://hastin-container.com/staging/app/auth/login',
        {
          userName: form.username,
          password: form.password,
          origin: 'AGENT',
          recaptcha: ''
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.status === 200) {
        const { jwt, opaque, accessCode } = res.data.data;

        localStorage.setItem('authToken', jwt);
        localStorage.setItem('opaque', opaque);
        localStorage.setItem('accessCode', accessCode);

        toast.success('OTP sent successfully!');
        setModalVisible(true);
      }

    } catch (error) {
      console.error(error);
      toast.error('Invalid Name or Password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
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
          />
          {errors.username && (
            <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.username}</div>
          )}

          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div style={{ color: 'red', fontSize: '0.875rem' }}>{errors.password}</div>
          )}

          <label className="show-password-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            /> Show Password
          </label>

          <br />
          <a href="/" className="forgot-link">🔒 Forgot password?</a><br /><br />

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? <Loader size="md" /> : 'Login'}
          </button>

          <AccessCodeModal
            isOpen={isModalVisible}
            onClose={() => setModalVisible(false)}
          />
        </form>

      </div>
    </div>
  );
};

export default LoginPage;