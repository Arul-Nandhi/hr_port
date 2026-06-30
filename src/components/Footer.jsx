import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="custom-footer mt-5">
      <div className="container-fluid px-4">
        <div className="row g-4 pb-4">
          {/* Brand */}
          <div className="col-lg-4">
            <div className="footer-brand d-flex align-items-center gap-2 mb-2">
              <span
                style={{
                  width: 30,
                  height: 30,
                  background: 'linear-gradient(135deg,#4f46e5,#06b6d4)',
                  borderRadius: 7,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 14,
                  color: '#fff',
                }}
              >
                HR
              </span>
              HR Management Portal
            </div>
            <p style={{ fontSize: '0.87rem', color: '#94a3b8', maxWidth: 280 }}>
              Streamlining HR operations with efficient employee management, attendance tracking, and recruitment solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-sm-6 col-lg-2">
            <h6 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.9rem' }}>
              Modules
            </h6>
            <ul className="list-unstyled mb-0" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><Link to="/employees" className="footer-link">Employees</Link></li>
              <li><Link to="/attendance" className="footer-link">Attendance</Link></li>
              <li><Link to="/leave-management" className="footer-link">Leaves</Link></li>
              <li><Link to="/recruitment" className="footer-link">Recruitment</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-sm-6 col-lg-2">
            <h6 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.9rem' }}>
              Support
            </h6>
            <ul className="list-unstyled mb-0" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><a href="#!" className="footer-link">Documentation</a></li>
              <li><a href="#!" className="footer-link">Help Center</a></li>
              <li><a href="#!" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-sm-6 col-lg-2">
            <h6 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.9rem' }}>
              Legal
            </h6>
            <ul className="list-unstyled mb-0" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><a href="#!" className="footer-link">Privacy Policy</a></li>
              <li><a href="#!" className="footer-link">Terms of Service</a></li>
              <li><a href="#!" className="footer-link">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #475569', paddingTop: '1.5rem', paddingBottom: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
          <p style={{ margin: 0 }}>© {year} HR Management Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
