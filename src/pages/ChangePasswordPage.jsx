import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordValidator from '../components/PasswordValidator';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const isFormValid =
    oldPassword.length > 0 &&
    passwordRegex.test(newPassword) &&
    newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordRegex.test(newPassword)) {
      setError('New password does not meet security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(oldPassword, newPassword);
      if (result.success) {
        setSuccess(result.message || 'Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="card border-0 shadow-sm"
        style={{
          maxWidth: '450px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Sleek Gradient Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              width: 55,
              height: 55,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '1rem',
            }}
          >
            🔒
          </div>
          <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.5px' }}>
            Change Password
          </h3>
          <p className="small text-white-50 m-0 mt-1">
            Update your account security credentials
          </p>
        </div>

        <div className="card-body p-4 p-md-5">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ borderRadius: '10px' }}>
              <span className="me-2">⚠️</span>
              <div className="small fw-500">{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center" role="alert" style={{ borderRadius: '10px' }}>
              <span className="me-2">✅</span>
              <div className="small fw-500">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Old Password */}
            <div className="mb-3">
              <label className="form-label text-muted small fw-600">
                Current Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                style={{ padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="form-label text-muted small fw-600">
                New Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                style={{ padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label text-muted small fw-600">
                Confirm New Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                style={{ padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Password Policy Validator */}
            {newPassword.length > 0 && (
              <PasswordValidator password={newPassword} confirmPassword={confirmPassword} />
            )}

            {/* Submit & Cancel */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-600 py-2 mb-2"
              style={{
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5, #3730a3)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>

            <button
              type="button"
              className="btn btn-light w-100 fw-600 py-2 text-muted"
              style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
