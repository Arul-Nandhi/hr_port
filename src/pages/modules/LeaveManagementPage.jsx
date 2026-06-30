import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';
import { useAuth } from '../../context/AuthContext';

const LeaveManagementPage = () => {
  const { leaveRequests, approveLeave, rejectLeave, applyLeave, leaveBalance } = useHRData();
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    employee_id: currentUser?.role === 'Employee' ? currentUser?.email?.split('@')[0] || 'EMP001' : 'EMP001',
    employee_name: currentUser?.name || '',
    leave_type: 'Casual Leave',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const filteredLeaves = leaveRequests.filter((leave) => {
    if (currentUser?.role === 'Employee') {
      return (!filterStatus || leave.status === filterStatus);
    }
    return !filterStatus || leave.status === filterStatus;
  });

  const handleApplyLeave = (e) => {
    e.preventDefault();
    applyLeave(formData);
    setFormData({
      employee_id: 'EMP001',
      employee_name: currentUser?.name || '',
      leave_type: 'Casual Leave',
      start_date: '',
      end_date: '',
      reason: '',
    });
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Leave Management</h1>
          {currentUser?.role === 'Employee' && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ Apply Leave'}
            </button>
          )}
        </div>

        {/* Apply Leave Form - for employees */}
        {showForm && currentUser?.role === 'Employee' && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Apply for Leave</h5>
              <form onSubmit={handleApplyLeave}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Leave Type</label>
                    <select
                      className="form-control"
                      value={formData.leave_type}
                      onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                    >
                      <option>Casual Leave</option>
                      <option>Sick Leave</option>
                      <option>Earned Leave</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  Submit Leave Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Leave Balance - for employees */}
        {currentUser?.role === 'Employee' && (
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-muted small mb-1">Casual Leave Balance</p>
                  <h3 className="fw-bold text-info">8</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-muted small mb-1">Sick Leave Balance</p>
                  <h3 className="fw-bold text-warning">8</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-muted small mb-1">Earned Leave Balance</p>
                  <h3 className="fw-bold text-success">20</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        {(currentUser?.role === 'Admin' || currentUser?.role === 'HR') && (
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Filter by Status</label>
              <select
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}

        {/* Leave Requests Table */}
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {(currentUser?.role === 'Admin' || currentUser?.role === 'HR') && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.leave_id}>
                    <td className="fw-500">{leave.employee_name}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td className="text-muted small">{leave.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === 'Approved'
                            ? 'bg-success'
                            : leave.status === 'Pending'
                            ? 'bg-warning'
                            : 'bg-danger'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    {(currentUser?.role === 'Admin' || currentUser?.role === 'HR') && leave.status === 'Pending' && (
                      <td>
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => approveLeave(leave.leave_id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => rejectLeave(leave.leave_id)}
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLeaves.length === 0 && (
          <div className="alert alert-info mt-3">No leave requests found.</div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagementPage;
