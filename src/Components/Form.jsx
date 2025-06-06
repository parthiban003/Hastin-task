import React, { useState } from 'react';
import './Form.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Redux/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(LoginPage(form));
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="your-illustration.svg" alt="Team Work" />
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
          <div className="captcha-placeholder">
            <input type="checkbox" required /> I am human
          </div>
          <a href="/" className="forgot-link">🔒 Forgot password?</a>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
