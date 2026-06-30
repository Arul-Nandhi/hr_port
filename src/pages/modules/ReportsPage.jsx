import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';

const ReportsPage = () => {
  const { employees, attendance, leaveRequests, payroll, candidates } = useHRData();
  const [reportType, setReportType] = useState('employees');

  const employeeReport = () => (
    <div className="row">
      <div className="col-12">
        <h5 className="fw-bold mb-3">Employee Report</h5>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Total Employees</p>
            <h2 className="fw-bold text-primary">{employees.length}</h2>
          </div>
        </div>
      </div>
      <div className="col-12 mt-3">
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td>{emp.employee_id}</td>
                    <td className="fw-500">{emp.name}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.department_id}</td>
                    <td>{emp.joining_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const attendanceReport = () => (
    <div className="row">
      <div className="col-12">
        <h5 className="fw-bold mb-3">Attendance Report</h5>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Present</p>
            <h2 className="fw-bold text-success">{attendance.filter(a => a.status === 'Present').length}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Absent</p>
            <h2 className="fw-bold text-danger">{attendance.filter(a => a.status === 'Absent').length}</h2>
          </div>
        </div>
      </div>
      <div className="col-12 mt-3">
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Employee ID</th>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((att) => (
                  <tr key={att.attendance_id}>
                    <td>{att.employee_id}</td>
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
      </div>
    </div>
  );

  const leaveReport = () => (
    <div className="row">
      <div className="col-12">
        <h5 className="fw-bold mb-3">Leave Report</h5>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Approved</p>
            <h2 className="fw-bold text-success">{leaveRequests.filter(l => l.status === 'Approved').length}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Pending</p>
            <h2 className="fw-bold text-warning">{leaveRequests.filter(l => l.status === 'Pending').length}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Rejected</p>
            <h2 className="fw-bold text-danger">{leaveRequests.filter(l => l.status === 'Rejected').length}</h2>
          </div>
        </div>
      </div>
      <div className="col-12 mt-3">
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.leave_id}>
                    <td className="fw-500">{leave.employee_name}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>
                      <span className={`badge ${leave.status === 'Approved' ? 'bg-success' : leave.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const recruitmentReport = () => (
    <div className="row">
      <div className="col-12">
        <h5 className="fw-bold mb-3">Recruitment Report</h5>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Total Candidates</p>
            <h2 className="fw-bold text-info">{candidates.length}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <p className="text-muted small mb-1">Selected</p>
            <h2 className="fw-bold text-success">{candidates.filter(c => c.status === 'Selected').length}</h2>
          </div>
        </div>
      </div>
      <div className="col-12 mt-3">
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Candidate Name</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.candidate_id}>
                    <td className="fw-500">{candidate.name}</td>
                    <td>{candidate.position}</td>
                    <td>
                      <span className="badge bg-info">{candidate.status}</span>
                    </td>
                    <td>{candidate.applied_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <h1 className="fw-bold mb-4">Reports</h1>

        {/* Report Type Selection */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${reportType === 'employees' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setReportType('employees')}
              >
                Employee Report
              </button>
              <button
                type="button"
                className={`btn ${reportType === 'attendance' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setReportType('attendance')}
              >
                Attendance Report
              </button>
              <button
                type="button"
                className={`btn ${reportType === 'leave' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setReportType('leave')}
              >
                Leave Report
              </button>
              <button
                type="button"
                className={`btn ${reportType === 'recruitment' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setReportType('recruitment')}
              >
                Recruitment Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="row">
          <div className="col-12">
            {reportType === 'employees' && employeeReport()}
            {reportType === 'attendance' && attendanceReport()}
            {reportType === 'leave' && leaveReport()}
            {reportType === 'recruitment' && recruitmentReport()}
          </div>
        </div>

        {/* Export Options */}
        <div className="row mt-4">
          <div className="col-12">
            <button className="btn btn-success me-2">📄 Download PDF</button>
            <button className="btn btn-info">📊 Download Excel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
