import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordValidator from '../components/PasswordValidator';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('HR Manager');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Secure Password Regex validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordRegex.test(password)) {
      setError('Password does not satisfy policy requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, email, password, role);
      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if signup criteria is fully met
  const isSignUpValid = 
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password) &&
    password === confirmPassword;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
        padding: '1.5rem',
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: '450px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              style={{
                width: 55,
                height: 55,
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 'bold',
                color: '#fff',
                margin: '0 auto 1rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              HR
            </div>
            <h3 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
              {isSignUp ? 'Create Account' : 'HR Management Portal'}
            </h3>
            <p className="text-muted small">
              {isSignUp ? 'Sign up to manage resources' : 'Sign in to access your portal'}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show small py-2 fw-500" role="alert" style={{ borderRadius: '8px' }}>
              {error}
              <button
                type="button"
                className="btn-close py-2"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success small py-2 fw-500" role="alert" style={{ borderRadius: '8px' }}>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp && (
              <div className="mb-3">
                <label className="form-label text-muted small fw-600">Username <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '8px', fontSize: '0.9rem', padding: '0.6rem 0.85rem' }}
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-muted small fw-600">Email Address <span className="text-danger">*</span></label>
              <input
                type="email"
                className="form-control"
                style={{ borderRadius: '8px', fontSize: '0.9rem', padding: '0.6rem 0.85rem' }}
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-600">Password <span className="text-danger">*</span></label>
              <input
                type="password"
                className="form-control"
                style={{ borderRadius: '8px', fontSize: '0.9rem', padding: '0.6rem 0.85rem' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-600">Confirm Password <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    style={{ borderRadius: '8px', fontSize: '0.9rem', padding: '0.6rem 0.85rem' }}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Real-time policy checklist */}
                <PasswordValidator password={password} confirmPassword={confirmPassword} />

              </>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 fw-600 py-2"
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5, #3730a3)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
              disabled={loading || (isSignUp && !isSignUpValid)}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : isSignUp ? (
                'Sign Up'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="text-center mt-4">
            <p className="small text-muted mb-0">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                className="btn btn-link p-0 fw-600 align-baseline"
                style={{ textDecoration: 'none', color: '#4f46e5', fontSize: '0.875rem' }}
                onClick={handleToggleMode}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
