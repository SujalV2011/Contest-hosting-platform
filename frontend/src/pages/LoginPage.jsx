import React, { useState } from 'react';
import { Eye, EyeOff, User, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';
import '../styles/LoginPage.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('attendee');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: ''
    };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType })
      });

      const data = await response.json();

      if (response.ok) {
        // Check if the selected user type matches the user's role from database
        if (data.user.role.toLowerCase() !== userType.toLowerCase()) {
          toast.error(`Please select the correct user type. You are registered as an ${data.user.role}.`);
          return;
        }

        toast.success('Login successful! Redirecting...');
        console.log('User:', data.user);

        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);

        setTimeout(() => {
          const userRole = data.user.role;
          const dashboardPath = userRole === 'organizer' ? '/organizer-dashboard' : '/attendee-dashboard';
          navigate(dashboardPath);
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <ParticlesBackground />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />

      {/* Left Side */}
      <div className="login-left">
        <div className="login-overlay">
          <div className="testimonial">
            <h2>Your gateway to seamless event experiences.</h2>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h1>Login to EventSphere</h1>
            <p>Your gateway to seamless event experiences.</p>
          </div>

          <div className="user-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${userType === 'attendee' ? 'active' : ''}`}
              onClick={() => setUserType('attendee')}
            >
              <User size={16} /> Attendee
            </button>
            <button
              type="button"
              className={`toggle-btn ${userType === 'organizer' ? 'active' : ''}`}
              onClick={() => setUserType('organizer')}
            >
              <Building size={16} /> Organizer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="name@example.com"
                required
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder="••••••••"
                  required
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-options">
              <a href="#forgot" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <div className="signup-link">
              Don't have an account? <Link to="/signup" className="navbar-item">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
