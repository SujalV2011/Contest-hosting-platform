import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ additionalLinks = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setUserName(data.user.fullName);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserName('');
        });
    } else {
      setUserName('');
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLoginClick = () => navigate('/login');

  const handleUserIconClick = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
    setDropdownOpen(false);
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className={`navbar-container ${isLoggedIn ? 'logged-in' : ''}`}>
        <div className="navbar-brand">
          <div className="logo">
            <div className="logo-circle"></div>
            <span className="brand-text">EventSphere</span>
          </div>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to={isLoggedIn ? "/home" : "/"} className="navbar-item active">Home</Link>
          <a href="#features" className="navbar-item">Features</a>
          <a href="#events" className="navbar-item">Events</a>
          <a href="#contact" className="navbar-item">Contact</a>
          {additionalLinks.map((link, index) => (
            <Link key={index} to={link.to} className="navbar-item">{link.text}</Link>
          ))}
        </div>

        <div className="navbar-auth" style={{ position: 'relative' }}>
          {!isLoggedIn ? (
            <button className="signup-btn" onClick={handleLoginClick}>Login</button>
          ) : (
            <>
              <button
                className="user-icon-btn"
                onClick={handleUserIconClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px', // Match login button height
                  width: '100%',  // Match login button width if needed
                  outline: 'none', // Remove the focus outline
                }}
                aria-label="User menu"
              >
                <div
                  style={{
                    background: '#FFF',
                    borderRadius: '0.5rem',
                    width: '100px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={24} color='#8B5CF6' />
                </div>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown" style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  borderRadius: '0.5rem',
                  minWidth: '180px',
                  zIndex: 2000,
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    fontWeight: 600,
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    fontSize: '1rem',
                    paddingLeft: '0.5rem'
                  }}>{userName}</div>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: '#F3F4F6',
                      color: '#8B5CF6',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;