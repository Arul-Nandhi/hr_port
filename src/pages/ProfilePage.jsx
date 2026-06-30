import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHRData } from '../context/HRDataContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { employees } = useHRData();

  const employeeData = employees.find((emp) => emp.email === currentUser?.email);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container px-4">
        {/* Header */}
        <h1 className="fw-bold mb-4">My Profile</h1>

        {/* Profile Card */}
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#fff',
                    margin: '0 auto 1rem',
                  }}
                >
                  {currentUser?.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold">{currentUser?.name}</h4>
                <p className="text-muted mb-3">{currentUser?.role}</p>
                <span className="badge bg-success">Active</span>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">User Information</h5>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Email</label>
                    <p className="fw-500">{currentUser?.email}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Role</label>
                    <p className="fw-500">{currentUser?.role}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Member Since</label>
                    <p className="fw-500">{currentUser?.created_at}</p>
                  </div>
                </div>

                {employeeData && (
                  <>
                    <hr />
                    <h5 className="fw-bold mb-3">Employment Information</h5>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Employee ID</label>
                        <p className="fw-500">{employeeData.employee_id}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Designation</label>
                        <p className="fw-500">{employeeData.designation}</p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Phone</label>
                        <p className="fw-500">{employeeData.phone}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Joining Date</label>
                        <p className="fw-500">{employeeData.joining_date}</p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label text-muted small">Address</label>
                        <p className="fw-500">{employeeData.address}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
