import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHRData } from '../context/HRDataContext';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { getDashboardStats, employees, leaveRequests, attendance, candidates, payroll } = useHRData();
  const { currentUser } = useAuth();
  const stats = getDashboardStats();

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const recentEmployees = employees.slice(0, 5);
  const presentToday = attendance.filter(a => a.status === 'Present').length;
  const absentToday = attendance.filter(a => a.status === 'Absent').length;
  const selectedCandidates = candidates.filter(c => c.status === 'Selected').length;
  const totalPayrollAmount = payroll.reduce((sum, p) => sum + parseFloat(p.net_salary || 0), 0);

  // Late arrivals
  const lateArrivals = useMemo(() => {
    return attendance.filter(a => {
      if (a.check_in && a.status === 'Present') {
        const [h, m] = a.check_in.split(':').map(Number);
        return h > 9 || (h === 9 && m > 15);
      }
      return false;
    }).length;
  }, [attendance]);

  const StatCard = ({ icon, label, value, color, link }) => (
    <div className="col-md-6 col-lg-4 col-xl-3 mb-3">
      <Link to={link || '#'} style={{ textDecoration: 'none' }}>
        <div className="card border-0 shadow-sm h-100" style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
          borderLeft: `4px solid ${color}`, transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">{label}</p>
                <h3 className="fw-bold mb-0" style={{ color }}>{value}</h3>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.7 }}>{icon}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="fw-bold mb-1">Dashboard</h1>
          <p className="text-muted">Welcome back, <em className="fw-500">{currentUser?.name || currentUser?.username || 'User'}</em>! ({currentUser?.role})</p>
        </div>

        {/* Main KPI Cards */}
        <div className="row">
          <StatCard icon="👥" label="Total Employees" value={stats.totalEmployees || employees.length} color="#4f46e5" link="/employees" />
          <StatCard icon="✓" label="Active Employees" value={stats.activeEmployees || employees.filter(e => e.is_active).length} color="#059669" link="/employees" />
          <StatCard icon="🏢" label="Departments" value={stats.departmentsCount || 0} color="#7c3aed" link="/departments" />
          <StatCard icon="📋" label="Pending Leaves" value={stats.pendingLeaves || pendingLeaves.length} color="#d97706" link="/leaves" />
          <StatCard icon="💼" label="Open Jobs" value={stats.openJobs || 0} color="#0891b2" link="/recruitment" />
          <StatCard icon="📊" label="Present Today" value={presentToday} color="#16a34a" link="/attendance" />
          <StatCard icon="⏰" label="Late Arrivals" value={lateArrivals} color="#ea580c" link="/attendance" />
          <StatCard icon="💰" label="Total Payroll" value={`₹${totalPayrollAmount.toLocaleString()}`} color="#be185d" link="/payroll" />
        </div>

        {/* Second Row: Quick Actions & Recruitment */}
        <div className="row g-4 mt-2">
          {/* Quick Actions */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white py-3 border-0"><h5 className="fw-bold mb-0">⚡ Quick Actions</h5></div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/employees" className="btn btn-outline-primary text-start">👥 Manage Employees</Link>
                  <Link to="/leaves" className="btn btn-outline-warning text-start">✓ Approve Leaves</Link>
                  <Link to="/attendance" className="btn btn-outline-success text-start">📋 Mark Attendance</Link>
                  <Link to="/payroll" className="btn btn-outline-danger text-start">💰 Process Payroll</Link>
                  <Link to="/performance" className="btn btn-outline-info text-start">📈 Performance Reviews</Link>
                  <Link to="/training" className="btn btn-outline-secondary text-start">🎓 Training Programs</Link>
                  <Link to="/holidays" className="btn btn-outline-primary text-start">📅 Holiday Calendar</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recruitment Pipeline */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white py-3 border-0"><h5 className="fw-bold mb-0">🎯 Recruitment Pipeline</h5></div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-center">
                    <h3 className="fw-bold text-primary mb-0">{candidates.length}</h3>
                    <small className="text-muted">Total</small>
                  </div>
                  <div className="text-center">
                    <h3 className="fw-bold text-warning mb-0">{candidates.filter(c => c.status === 'Shortlisted' || c.status === 'Interview Scheduled').length}</h3>
                    <small className="text-muted">In Process</small>
                  </div>
                  <div className="text-center">
                    <h3 className="fw-bold text-success mb-0">{selectedCandidates}</h3>
                    <small className="text-muted">Selected</small>
                  </div>
                  <div className="text-center">
                    <h3 className="fw-bold text-danger mb-0">{candidates.filter(c => c.status === 'Rejected').length}</h3>
                    <small className="text-muted">Rejected</small>
                  </div>
                </div>
                <div className="progress mb-3" style={{ height: '8px' }}>
                  {candidates.length > 0 && (
                    <>
                      <div className="progress-bar bg-success" style={{ width: `${(selectedCandidates / candidates.length) * 100}%` }} />
                      <div className="progress-bar bg-warning" style={{ width: `${(candidates.filter(c => c.status === 'Shortlisted').length / candidates.length) * 100}%` }} />
                      <div className="progress-bar bg-danger" style={{ width: `${(candidates.filter(c => c.status === 'Rejected').length / candidates.length) * 100}%` }} />
                    </>
                  )}
                </div>
                <Link to="/recruitment" className="btn btn-sm btn-outline-primary w-100">View All Candidates →</Link>
              </div>
            </div>
          </div>

          {/* Pending Leave Approvals */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">📝 Pending Approvals</h5>
                <span className="badge bg-warning">{pendingLeaves.length}</span>
              </div>
              <div className="card-body p-0">
                {pendingLeaves.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <div style={{ fontSize: '2rem' }}>✅</div>
                    <p className="small mt-2">No pending approvals</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {pendingLeaves.slice(0, 5).map(leave => (
                      <div key={leave.leave_id} className="list-group-item px-3 py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong className="small">{leave.employee_name}</strong>
                            <br /><span className="text-muted" style={{ fontSize: '0.75rem' }}>{leave.leave_type} • {leave.start_date} to {leave.end_date}</span>
                          </div>
                          <span className="badge bg-warning">Pending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-2">
                  <Link to="/leaves" className="btn btn-sm btn-outline-warning w-100">Manage Leaves →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row: Recent Employees & Attendance Overview */}
        <div className="row g-4 mt-2">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white py-3 border-0"><h5 className="fw-bold mb-0">👤 Recent Employees</h5></div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light"><tr><th>ID</th><th>Name</th><th>Designation</th><th>Status</th></tr></thead>
                  <tbody>
                    {recentEmployees.map(emp => (
                      <tr key={emp.employee_id}>
                        <td><span className="badge bg-primary">{emp.employee_id}</span></td>
                        <td className="fw-500">{emp.name}</td>
                        <td className="text-muted small">{emp.designation}</td>
                        <td><span className={`badge ${emp.is_active ? 'bg-success' : 'bg-secondary'}`}>{emp.is_active ? 'Active' : 'Inactive'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white py-3 border-0"><h5 className="fw-bold mb-0">📊 Today's Attendance</h5></div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="p-3 rounded" style={{ background: 'var(--success-bg, #dcfce7)' }}>
                      <h2 className="fw-bold text-success mb-0">{presentToday}</h2>
                      <small className="text-muted">Present</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded" style={{ background: 'var(--danger-bg, #fef2f2)' }}>
                      <h2 className="fw-bold text-danger mb-0">{absentToday}</h2>
                      <small className="text-muted">Absent</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded" style={{ background: 'var(--warning-bg, #fff7ed)' }}>
                      <h2 className="fw-bold text-warning mb-0">{lateArrivals}</h2>
                      <small className="text-muted">Late</small>
                    </div>
                  </div>
                </div>
                <div className="progress mt-3" style={{ height: '10px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${attendance.length ? (presentToday / attendance.length) * 100 : 0}%` }} />
                  <div className="progress-bar bg-danger" style={{ width: `${attendance.length ? (absentToday / attendance.length) * 100 : 0}%` }} />
                </div>
                <p className="text-muted small mt-2 mb-0">Attendance Rate: {attendance.length ? Math.round((presentToday / attendance.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
