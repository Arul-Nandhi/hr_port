import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRDataProvider } from './context/HRDataContext';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

// Dashboard
import DashboardPage from './pages/DashboardPage';

// Module Pages
import EmployeeManagementPage from './pages/modules/EmployeeManagementPage';
import DepartmentManagementPage from './pages/modules/DepartmentManagementPage';
import AttendancePage from './pages/modules/AttendancePage';
import LeaveManagementPage from './pages/modules/LeaveManagementPage';
import RecruitmentPage from './pages/modules/RecruitmentPage';
import PayrollPage from './pages/modules/PayrollPage';
import ReportsPage from './pages/modules/ReportsPage';
import PerformancePage from './pages/modules/PerformancePage';
import TrainingPage from './pages/modules/TrainingPage';
import HolidayManagementPage from './pages/modules/HolidayManagementPage';

// Employee Pages
import EmployeeAttendancePage from './pages/EmployeeAttendancePage';
import ProfilePage from './pages/ProfilePage';

// Styles — Bootstrap 5 + custom
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

/**
 * Session Timeout Wrapper — logs out after 15 minutes of inactivity
 */
function SessionTimeoutWrapper({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const TIMEOUT = 15 * 60 * 1000; // 15 minutes

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;
    localStorage.setItem('lastActivity', Date.now().toString());
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTimeout = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || Date.now());
      if (Date.now() - lastActivity > TIMEOUT) {
        alert('Session expired due to inactivity. Please log in again.');
        logout();
      }
    }, 30000); // Check every 30 seconds

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearInterval(checkTimeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, logout, resetTimer, TIMEOUT]);

  return children;
}

/**
 * AppRoutes — Inner component that uses useAuth hook
 */
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      {isAuthenticated && (
        <>
          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* HR/Admin Modules */}
          <Route path="/employees" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><EmployeeManagementPage /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><DepartmentManagementPage /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><AttendancePage /></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><LeaveManagementPage /></ProtectedRoute>} />
          <Route path="/leave-management" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><LeaveManagementPage /></ProtectedRoute>} />
          <Route path="/recruitment" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><RecruitmentPage /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><PayrollPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><PerformancePage /></ProtectedRoute>} />
          <Route path="/training" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><TrainingPage /></ProtectedRoute>} />
          <Route path="/holidays" element={<ProtectedRoute allowedRoles={['Admin', 'HR']}><HolidayManagementPage /></ProtectedRoute>} />


          {/* Profile & Settings */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </>
      )}

      {/* Redirect to login if not authenticated */}
      {!isAuthenticated && <Route path="/" element={<Navigate to="/login" replace />} />}

      {/* 404 */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <div className="container py-5 text-center">
              <div style={{ fontSize: '5rem' }}>🔍</div>
              <h2 style={{ fontWeight: 800 }}>404 — Page Not Found</h2>
              <p style={{ color: '#64748b' }}>The page you're looking for doesn't exist.</p>
              <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

/**
 * App — Root component with Providers, Dark Mode, and Session Timeout
 */
function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <HRDataProvider>
          <SessionTimeoutWrapper>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className={darkMode ? 'dark-mode' : ''}>
              <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
              <main style={{ flex: 1 }}>
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </SessionTimeoutWrapper>
        </HRDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
