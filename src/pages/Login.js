import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from '../components/GoogleLoginButton'; // adjust path if needed

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, form);

      // Save user data in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Redirecting to your dashboard...',
        confirmButtonColor: '#1cd6eb',
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid email or password.',
        confirmButtonColor: '#f512c0',
      });
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
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

          <button type="submit">Login</button>

          <GoogleLoginButton /> {/* <- Google Button */}

          <div className="register-redirect">
            Don't have an account?{' '}
            <span onClick={() => navigate('/')}>Register</span>
          </div>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
