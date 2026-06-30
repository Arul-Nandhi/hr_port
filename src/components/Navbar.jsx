import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { currentUser, logout } = useAuth();
  const [showModules, setShowModules] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const modulesRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (modulesRef.current && !modulesRef.current.contains(e.target)) setShowModules(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid px-4">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <span className="navbar-brand-logo">HR</span>
          HR Portal
        </Link>

        {/* Mobile toggle */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
          data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navMenu">
          {currentUser && (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-1">
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard" end>Dashboard</NavLink>
              </li>

              {(currentUser.role === 'Admin' || currentUser.role === 'HR') && (
                <li className="nav-item dropdown" ref={modulesRef}>
                  <button className="nav-link dropdown-toggle border-0 bg-transparent"
                    onClick={() => { setShowModules(!showModules); setShowUserMenu(false); }}
                    style={{ cursor: 'pointer' }}>
                    Modules
                  </button>
                  <div className={`dropdown-menu ${showModules ? 'show' : ''}`} style={{ minWidth: '200px' }}>
                    <h6 className="dropdown-header">Core HR</h6>
                    <Link className="dropdown-item" to="/employees" onClick={() => setShowModules(false)}>👥 Employees</Link>
                    <Link className="dropdown-item" to="/departments" onClick={() => setShowModules(false)}>🏢 Departments</Link>
                    <Link className="dropdown-item" to="/attendance" onClick={() => setShowModules(false)}>📋 Attendance</Link>
                    <Link className="dropdown-item" to="/leaves" onClick={() => setShowModules(false)}>📝 Leave Management</Link>
                    <div className="dropdown-divider"></div>
                    <h6 className="dropdown-header">Talent & Pay</h6>
                    <Link className="dropdown-item" to="/recruitment" onClick={() => setShowModules(false)}>💼 Recruitment</Link>
                    <Link className="dropdown-item" to="/payroll" onClick={() => setShowModules(false)}>💰 Payroll</Link>
                    <Link className="dropdown-item" to="/performance" onClick={() => setShowModules(false)}>📈 Performance</Link>
                    <div className="dropdown-divider"></div>
                    <h6 className="dropdown-header">Others</h6>
                    <Link className="dropdown-item" to="/training" onClick={() => setShowModules(false)}>🎓 Training</Link>
                    <Link className="dropdown-item" to="/holidays" onClick={() => setShowModules(false)}>📅 Holidays</Link>
                    <Link className="dropdown-item" to="/reports" onClick={() => setShowModules(false)}>📊 Reports</Link>
                  </div>
                </li>
              )}

              {/* Dark Mode Toggle */}
              <li className="nav-item">
                <button className="nav-link border-0 bg-transparent" onClick={() => setDarkMode && setDarkMode(!darkMode)}
                  title={darkMode ? 'Light Mode' : 'Dark Mode'} style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </li>

              {/* User Menu */}
              <li className="nav-item dropdown position-relative" ref={userRef}>
                <button className="nav-link dropdown-toggle border-0 bg-transparent d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowModules(false); }}>
                  👤 {currentUser.name || currentUser.username}
                </button>
                <div className={`dropdown-menu dropdown-menu-end ${showUserMenu ? 'show' : ''}`}>
                  <Link className="dropdown-item" to="/profile" onClick={() => setShowUserMenu(false)}>Profile</Link>
                  <Link className="dropdown-item" to="/change-password" onClick={() => setShowUserMenu(false)}>Change Password</Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item text-danger" onClick={handleLogout}
                    style={{ border: 'none', background: 'none', textAlign: 'left' }}>
                    Logout
                  </button>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
