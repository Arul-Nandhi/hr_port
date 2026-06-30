import React from 'react';

const PasswordValidator = ({ password, confirmPassword }) => {
  const criteria = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'At least one uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'At least one lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'At least one number (0-9)', valid: /\d/.test(password) },
    { label: 'At least one special character (!@#$%^&*)', valid: /[@$!%*?&]/.test(password) },
  ];

  const matched = confirmPassword !== undefined ? password === confirmPassword && password.length > 0 : true;
  const validCount = criteria.filter((c) => c.valid).length;

  let strength = 'Weak';
  let progressColor = 'bg-danger';
  let progressWidth = '20%';

  if (validCount >= 5) {
    strength = 'Strong';
    progressColor = 'bg-success';
    progressWidth = '100%';
  } else if (validCount >= 3) {
    strength = 'Medium';
    progressColor = 'bg-warning';
    progressWidth = '60%';
  } else if (validCount > 0) {
    strength = 'Weak';
    progressColor = 'bg-danger';
    progressWidth = '30%';
  } else {
    strength = 'Very Weak';
    progressColor = 'bg-danger';
    progressWidth = '5%';
  }

  return (
    <div className="p-3 bg-light border rounded mb-3" style={{ fontSize: '0.82rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-muted fw-600">Password Strength:</span>
        <span className={`fw-bold ${validCount >= 5 ? 'text-success' : validCount >= 3 ? 'text-warning' : 'text-danger'}`}>
          {strength}
        </span>
      </div>

      <div className="progress mb-3" style={{ height: '6px' }}>
        <div
          className={`progress-bar ${progressColor}`}
          role="progressbar"
          style={{ width: progressWidth, transition: 'width 0.3s ease' }}
          aria-valuenow={validCount * 20}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      <div className="row g-2">
        {criteria.map((c, i) => (
          <div key={i} className="col-12 d-flex align-items-center">
            <span className={`me-2 ${c.valid ? 'text-success' : 'text-danger'}`}>
              {c.valid ? '●' : '○'}
            </span>
            <span className={c.valid ? 'text-success fw-500' : 'text-muted'}>
              {c.label}
            </span>
          </div>
        ))}
        {confirmPassword !== undefined && (
          <div className="col-12 d-flex align-items-center mt-2 border-top pt-2">
            <span className={`me-2 ${matched ? 'text-success' : 'text-danger'}`}>
              {matched ? '✓' : '✗'}
            </span>
            <span className={matched ? 'text-success fw-600' : 'text-danger fw-600'}>
              {matched ? 'Passwords match' : 'Passwords do not match'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordValidator;
