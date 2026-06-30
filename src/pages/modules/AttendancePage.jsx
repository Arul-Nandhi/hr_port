import React, { useState, useMemo } from 'react';
import { useHRData } from '../../context/HRDataContext';

const ITEMS_PER_PAGE = 10;

const AttendancePage = () => {
  const { attendance, employees, markAttendance } = useHRData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: '', date: new Date().toISOString().split('T')[0], check_in: '09:00', check_out: '18:00', status: 'Present' });

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    markAttendance(form);
    setForm({ employee_id: '', date: new Date().toISOString().split('T')[0], check_in: '09:00', check_out: '18:00', status: 'Present' });
    setShowForm(false);
  };

  // Calculate late arrival and overtime
  const enrichedAttendance = useMemo(() => {
    return attendance.map(att => {
      let isLate = false;
      let overtimeHours = 0;
      if (att.check_in && att.status === 'Present') {
        const [h, m] = att.check_in.split(':').map(Number);
        isLate = h > 9 || (h === 9 && m > 15);
      }
      if (att.check_in && att.check_out && att.status === 'Present') {
        const [inH, inM] = att.check_in.split(':').map(Number);
        const [outH, outM] = att.check_out.split(':').map(Number);
        const worked = (outH + outM / 60) - (inH + inM / 60);
        overtimeHours = worked > 9 ? Math.round((worked - 9) * 10) / 10 : 0;
      }
      const emp = employees.find(e => e.employee_id === att.employee_id);
      return { ...att, isLate, overtimeHours, employee_name: emp?.name || att.employee_id };
    });
  }, [attendance, employees]);

  const filtered = useMemo(() => {
    return enrichedAttendance.filter(att => {
      const matchSearch = att.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !filterStatus || att.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [enrichedAttendance, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Summary stats
  const presentCount = enrichedAttendance.filter(a => a.status === 'Present').length;
  const absentCount = enrichedAttendance.filter(a => a.status === 'Absent').length;
  const lateCount = enrichedAttendance.filter(a => a.isLate).length;
  const totalOT = enrichedAttendance.reduce((sum, a) => sum + a.overtimeHours, 0);

  // Calendar view helpers
  const calendarDates = useMemo(() => {
    const dates = {};
    enrichedAttendance.forEach(att => {
      if (!dates[att.date]) dates[att.date] = [];
      dates[att.date].push(att);
    });
    return dates;
  }, [enrichedAttendance]);

  const exportCSV = () => {
    const headers = ['Employee ID', 'Employee', 'Date', 'Check-In', 'Check-Out', 'Status', 'Late', 'OT Hours'];
    const rows = filtered.map(a => [a.employee_id, a.employee_name, a.date, a.check_in || '', a.check_out || '', a.status, a.isLate ? 'Yes' : 'No', a.overtimeHours]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'attendance_report.csv'; a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Attendance Management</h1>
          <div>
            <button className="btn btn-outline-success me-2" onClick={exportCSV}>📊 Export CSV</button>
            <div className="btn-group me-2">
              <button className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('table')}>Table</button>
              <button className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('calendar')}>Calendar</button>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Close' : '+ Mark Attendance'}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Present</p>
              <h2 className="fw-bold text-success">{presentCount}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Absent</p>
              <h2 className="fw-bold text-danger">{absentCount}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Late Arrivals</p>
              <h2 className="fw-bold text-warning">{lateCount}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Total Overtime</p>
              <h2 className="fw-bold text-info">{totalOT}h</h2>
            </div></div>
          </div>
        </div>

        {/* Mark Attendance Form */}
        {showForm && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Mark Attendance</h5>
              <form onSubmit={handleMarkAttendance}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-600">Employee <span className="text-danger">*</span></label>
                    <select className="form-select" required value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })}>
                      <option value="">Select employee...</option>
                      {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-600">Date <span className="text-danger">*</span></label>
                    <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-600">Check-In</label>
                    <input type="time" className="form-control" value={form.check_in} onChange={e => setForm({ ...form, check_in: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-600">Check-Out</label>
                    <input type="time" className="form-control" value={form.check_out} onChange={e => setForm({ ...form, check_out: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-600">Status <span className="text-danger">*</span></label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option>Present</option><option>Absent</option><option>Half Day</option><option>On Leave</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-success mt-3">Save Attendance</button>
              </form>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="🔍 Search employee..." value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="col-md-6">
            <select className="form-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
              <option value="">All Status</option>
              <option>Present</option><option>Absent</option><option>Half Day</option><option>On Leave</option>
            </select>
          </div>
        </div>

        {viewMode === 'table' ? (
          <>
            {/* Table View */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr><th>Employee</th><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Late</th><th>Overtime</th></tr>
                  </thead>
                  <tbody>
                    {paginated.map(att => (
                      <tr key={att.attendance_id}>
                        <td className="fw-500">{att.employee_name}</td>
                        <td>{att.date}</td>
                        <td>{att.check_in || '—'}</td>
                        <td>{att.check_out || '—'}</td>
                        <td><span className={`badge ${att.status === 'Present' ? 'bg-success' : att.status === 'Absent' ? 'bg-danger' : 'bg-warning'}`}>{att.status}</span></td>
                        <td>{att.isLate ? <span className="badge bg-warning text-dark">⏰ Late</span> : '—'}</td>
                        <td>{att.overtimeHours > 0 ? <span className="badge bg-info">{att.overtimeHours}h OT</span> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        ) : (
          /* Calendar View */
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h5 className="fw-bold mb-3">Attendance Calendar</h5>
              <div className="row g-2">
                {Object.entries(calendarDates).sort(([a], [b]) => b.localeCompare(a)).slice(0, 14).map(([date, records]) => (
                  <div key={date} className="col-md-3 col-lg-2">
                    <div className="card border p-2 text-center">
                      <small className="text-muted">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</small>
                      <div className="mt-1">
                        <span className="badge bg-success me-1">{records.filter(r => r.status === 'Present').length}P</span>
                        <span className="badge bg-danger">{records.filter(r => r.status === 'Absent').length}A</span>
                      </div>
                      {records.some(r => r.isLate) && <span className="badge bg-warning mt-1" style={{ fontSize: '0.65rem' }}>⏰ {records.filter(r => r.isLate).length} Late</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>📋</div>
            <h5 className="text-muted mt-2">No attendance records found</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
