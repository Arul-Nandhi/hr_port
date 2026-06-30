import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';

const PerformancePage = () => {
  const { employees } = useHRData();
  const [goals, setGoals] = useState([
    { id: 1, employee_id: 'EMP001', employee_name: 'John Doe', goal: 'Complete React Training', kpi: 'Skill Development', target: '100%', progress: 75, status: 'In Progress', review: '' },
    { id: 2, employee_id: 'EMP002', employee_name: 'Jane Smith', goal: 'Reduce Bug Count by 30%', kpi: 'Code Quality', target: '30% reduction', progress: 90, status: 'On Track', review: '' },
    { id: 3, employee_id: 'EMP003', employee_name: 'Bob Wilson', goal: 'Lead 2 Client Presentations', kpi: 'Leadership', target: '2 presentations', progress: 50, status: 'In Progress', review: '' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [form, setForm] = useState({ employee_id: '', goal: '', kpi: '', target: '' });

  const addGoal = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.employee_id === form.employee_id);
    setGoals([...goals, {
      id: Date.now(), employee_id: form.employee_id,
      employee_name: emp?.name || form.employee_id,
      goal: form.goal, kpi: form.kpi, target: form.target,
      progress: 0, status: 'Not Started', review: ''
    }]);
    setForm({ employee_id: '', goal: '', kpi: '', target: '' });
    setShowForm(false);
  };

  const updateProgress = (id, progress) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: parseInt(progress), status: progress >= 100 ? 'Completed' : progress >= 50 ? 'On Track' : 'In Progress' } : g));
  };

  const submitReview = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, review: reviewText } : g));
    setReviewModal(null);
    setReviewText('');
  };

  const statusColor = (status) => {
    if (status === 'Completed') return 'bg-success';
    if (status === 'On Track') return 'bg-info';
    if (status === 'In Progress') return 'bg-warning';
    return 'bg-secondary';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Performance Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ Set Goal'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Total Goals</p>
              <h2 className="fw-bold text-primary">{goals.length}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Completed</p>
              <h2 className="fw-bold text-success">{goals.filter(g => g.status === 'Completed').length}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">On Track</p>
              <h2 className="fw-bold text-info">{goals.filter(g => g.status === 'On Track').length}</h2>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Avg Progress</p>
              <h2 className="fw-bold text-warning">{goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0}%</h2>
            </div></div>
          </div>
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Set New Goal</h5>
              <form onSubmit={addGoal}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-600">Employee <span className="text-danger">*</span></label>
                    <select className="form-select" required value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })}>
                      <option value="">Select employee...</option>
                      {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-600">KPI Category <span className="text-danger">*</span></label>
                    <select className="form-select" required value={form.kpi} onChange={e => setForm({ ...form, kpi: e.target.value })}>
                      <option value="">Select KPI...</option>
                      <option>Skill Development</option><option>Code Quality</option><option>Leadership</option>
                      <option>Productivity</option><option>Communication</option><option>Innovation</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-600">Goal Description <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-600">Target <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-success mt-3">Save Goal</button>
              </form>
            </div>
          </div>
        )}

        {/* Goals Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Employee</th><th>Goal</th><th>KPI</th><th>Target</th><th>Progress</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {goals.map(g => (
                  <tr key={g.id}>
                    <td className="fw-500">{g.employee_name}</td>
                    <td>{g.goal}</td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{g.kpi}</span></td>
                    <td>{g.target}</td>
                    <td style={{ minWidth: '150px' }}>
                      <div className="d-flex align-items-center">
                        <input type="range" className="form-range me-2" min="0" max="100" value={g.progress}
                          onChange={e => updateProgress(g.id, e.target.value)} style={{ width: '100px' }} />
                        <span className="small fw-bold">{g.progress}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${statusColor(g.status)}`}>{g.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => { setReviewModal(g.id); setReviewText(g.review); }}>
                        {g.review ? '📝 Edit Review' : '+ Review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {reviewModal && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setReviewModal(null)}>
            <div className="modal-dialog" onClick={e => e.stopPropagation()}>
              <div className="modal-content" style={{ borderRadius: '12px' }}>
                <div className="modal-header"><h5 className="modal-title fw-bold">Performance Review</h5>
                  <button className="btn-close" onClick={() => setReviewModal(null)} /></div>
                <div className="modal-body">
                  <label className="form-label small fw-600">Manager Feedback <span className="text-danger">*</span></label>
                  <textarea className="form-control" rows="4" value={reviewText} onChange={e => setReviewText(e.target.value)}
                    placeholder="Write detailed feedback about the employee's performance..." />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
                  <button className="btn btn-primary" disabled={!reviewText} onClick={() => submitReview(reviewModal)}>Save Review</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;
