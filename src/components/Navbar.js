import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ connected }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="brand-name"><span>TRADE</span></span>
      </div>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
          <span className="nav-icon">⬡</span> Dashboard
        </NavLink>
        <NavLink to="/market" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
          <span className="nav-icon">◈</span> Market
        </NavLink>
        <NavLink to="/portfolio" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
          <span className="nav-icon">◉</span> Portfolio
        </NavLink>
      </div>

      <div className="navbar-right">
        <div className="connection-status">
          <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
          <span className="status-text hide-mobile">{connected ? 'Live' : 'Connecting'}</span>
        </div>

        {user && (
          <div className="user-menu">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-info hide-mobile">
              <span className="user-name">{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
