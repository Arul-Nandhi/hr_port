import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const HolidayManagementPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', is_public: true });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await api.get('holidays/');
      setHolidays(res.data.results || res.data || []);
    } catch (err) {
      console.error('Failed to fetch holidays:', err);
    } finally {
      setLoading(false);
    }
  };

  const addHoliday = async (e) => {
    e.preventDefault();
    try {
      await api.post('holidays/', form);
      fetchHolidays();
      setForm({ title: '', date: '', is_public: true });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.date?.[0] || 'Failed to add holiday');
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    try {
      await api.delete(`holidays/${id}/`);
      fetchHolidays();
    } catch (err) {
      alert('Failed to delete holiday');
    }
  };

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));

  const getHolidaysForMonth = (month) => {
    return holidays.filter(h => {
      const d = new Date(h.date);
      return d.getMonth() === month && d.getFullYear() === currentYear;
    });
  };

  const renderCalendar = () => {
    if (selectedMonth === null) return null;
    const monthName = months[selectedMonth].toLocaleString('default', { month: 'long' });
    const firstDayIndex = new Date(currentYear, selectedMonth, 1).getDay();
    const totalDays = new Date(currentYear, selectedMonth + 1, 0).getDate();
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const gridCells = [...blanks, ...days];

    const weeks = [];
    let currentWeek = [];
    gridCells.forEach((cell, i) => {
      currentWeek.push(cell);
      if (currentWeek.length === 7 || i === gridCells.length - 1) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return (
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">📅 {monthName} {currentYear} — Interactive Calendar View</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedMonth(null)}>✕ Close</button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered text-center" style={{ minWidth: '350px' }}>
              <thead>
                <tr className="table-light">
                  <th className="text-danger">Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th className="text-primary">Sat</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wIdx) => (
                  <tr key={wIdx}>
                    {week.map((day, dIdx) => {
                      if (!day) return <td key={dIdx} style={{ background: 'var(--surface)' }}></td>;

                      const dateStr = `${currentYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayHoliday = holidays.find(h => h.date === dateStr);

                      return (
                        <td
                          key={dIdx}
                          onClick={() => {
                            setForm({ title: dayHoliday?.title || '', date: dateStr, is_public: dayHoliday?.is_public ?? true });
                            setShowForm(true);
                          }}
                          style={{
                            cursor: 'pointer',
                            position: 'relative',
                            height: '80px',
                            verticalAlign: 'top',
                            background: dayHoliday ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface)'
                          }}
                        >
                          <div className="fw-bold text-start mb-1 text-dark">{day}</div>
                          {dayHoliday && (
                            <div
                              className={`badge ${dayHoliday.is_public ? 'bg-danger' : 'bg-secondary'} text-white small p-1 text-wrap`}
                              style={{ fontSize: '0.65rem', display: 'block' }}
                              title={dayHoliday.title}
                            >
                              🎉 {dayHoliday.title}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-muted small">
            💡 <em>Click on any date cell to quickly add or edit a holiday on that day.</em>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Holiday Calendar {currentYear}</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ Add Holiday'}
          </button>
        </div>

        {showForm && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add Holiday</h5>
              <form onSubmit={addHoliday}>
                <div className="row g-3">
                  <div className="col-md-5">
                    <label className="form-label small fw-600">Holiday Title <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-600">Date <span className="text-danger">*</span></label>
                    <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <div className="form-check me-3">
                      <input className="form-check-input" type="checkbox" checked={form.is_public} onChange={e => setForm({ ...form, is_public: e.target.checked })} />
                      <label className="form-check-label small">Public Holiday</label>
                    </div>
                    <button type="submit" className="btn btn-success">Add</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="row g-3 mb-4">
              {months.map((month, idx) => {
                const monthHolidays = getHolidaysForMonth(idx);
                return (
                  <div key={idx} className="col-md-4 col-lg-3" style={{ cursor: 'pointer' }} onClick={() => setSelectedMonth(idx)}>
                    <div className={`card border-0 shadow-sm h-100 ${monthHolidays.length > 0 ? '' : 'bg-light'}`} style={{ borderRadius: '12px' }}>
                      <div className="card-body p-3">
                        <h6 className="fw-bold text-primary mb-2 d-flex justify-content-between align-items-center">
                          <span>{month.toLocaleString('default', { month: 'long' })}</span>
                          <span className="badge bg-secondary rounded-pill" style={{ fontSize: '0.7rem' }}>{monthHolidays.length}</span>
                        </h6>
                        {monthHolidays.length > 0 ? (
                          monthHolidays.map(h => (
                            <div key={h.holiday_id} className="d-flex justify-content-between align-items-center py-1 border-bottom" onClick={(e) => e.stopPropagation()}>
                              <div>
                                <span className="small fw-500 text-dark">{h.title}</span>
                                <br />
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', weekday: 'short' })}
                                  {h.is_public && <span className="badge bg-success ms-1" style={{ fontSize: '0.6rem' }}>Public</span>}
                                </span>
                              </div>
                              <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => deleteHoliday(h.holiday_id)}>✕</button>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted small mb-0">No holidays</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Month Interactive Calendar */}
            {renderCalendar()}

            {/* List View */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white py-3"><h5 className="fw-bold mb-0">All Holidays ({holidays.length})</h5></div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light"><tr><th>Title</th><th>Date</th><th>Day</th><th>Type</th><th>Action</th></tr></thead>
                  <tbody>
                    {holidays.map(h => (
                      <tr key={h.holiday_id}>
                        <td className="fw-500">{h.title}</td>
                        <td>{h.date}</td>
                        <td>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                        <td><span className={`badge ${h.is_public ? 'bg-success' : 'bg-secondary'}`}>{h.is_public ? 'Public' : 'Optional'}</span></td>
                        <td><button className="btn btn-sm btn-outline-danger" onClick={() => deleteHoliday(h.holiday_id)}>Delete</button></td>
                      </tr>
                    ))}
                    {holidays.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-3">No holidays configured</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HolidayManagementPage;
