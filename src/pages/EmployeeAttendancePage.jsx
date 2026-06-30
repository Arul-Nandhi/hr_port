import React from 'react';
import { useHRData } from '../context/HRDataContext';
import { useAuth } from '../context/AuthContext';

const EmployeeAttendancePage = () => {
  const { attendance } = useHRData();
  const { currentUser } = useAuth();

  const myAttendance = attendance.filter((att) => att.employee_id === currentUser?.email?.split('@')[0] || att.employee_id === 'EMP001');

  const presentDays = myAttendance.filter((a) => a.status === 'Present').length;
  const absentDays = myAttendance.filter((a) => a.status === 'Absent').length;
  const attendancePercentage = myAttendance.length > 0 
    ? Math.round((presentDays / myAttendance.length) * 100) 
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <h1 className="fw-bold mb-4">My Attendance</h1>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <p className="text-muted small mb-1">Present Days</p>
                <h2 className="fw-bold text-success">{presentDays}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <p className="text-muted small mb-1">Absent Days</p>
                <h2 className="fw-bold text-danger">{absentDays}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <p className="text-muted small mb-1">Total Days</p>
                <h2 className="fw-bold text-info">{myAttendance.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <p className="text-muted small mb-1">Attendance %</p>
                <h2 className="fw-bold text-primary">{attendancePercentage}%</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myAttendance.map((att) => (
                  <tr key={att.attendance_id}>
                    <td>{att.date}</td>
                    <td>{att.check_in || '—'}</td>
                    <td>{att.check_out || '—'}</td>
                    <td>
                      <span className={`badge ${att.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {myAttendance.length === 0 && (
          <div className="alert alert-info mt-3">No attendance records found.</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendancePage;
