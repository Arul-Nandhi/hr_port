import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';

const TrainingPage = () => {
  const { employees } = useHRData();
  const [programs, setPrograms] = useState([
    { id: 1, title: 'React Advanced Patterns', category: 'Technical', duration: '40 hours', instructor: 'Online - Udemy', status: 'Active', enrolled: ['EMP001', 'EMP003'] },
    { id: 2, title: 'Leadership & Management', category: 'Soft Skills', duration: '20 hours', instructor: 'HR Department', status: 'Active', enrolled: ['EMP002'] },
    { id: 3, title: 'Data Security Awareness', category: 'Compliance', duration: '8 hours', instructor: 'IT Security Team', status: 'Completed', enrolled: ['EMP001', 'EMP002', 'EMP003', 'EMP004'] },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Technical', duration: '', instructor: '' });
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [enrollId, setEnrollId] = useState('');

  const addProgram = (e) => {
    e.preventDefault();
    setPrograms([...programs, { ...form, id: Date.now(), status: 'Active', enrolled: [] }]);
    setForm({ title: '', category: 'Technical', duration: '', instructor: '' });
    setShowForm(false);
  };

  const enrollEmployee = (programId) => {
    if (!enrollId) return;
    setPrograms(programs.map(p => p.id === programId ? { ...p, enrolled: [...new Set([...p.enrolled, enrollId])] } : p));
    setEnrollId('');
  };

  const removeEnrollment = (programId, empId) => {
    setPrograms(programs.map(p => p.id === programId ? { ...p, enrolled: p.enrolled.filter(e => e !== empId) } : p));
  };

  const toggleStatus = (id) => {
    setPrograms(programs.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Completed' : 'Active' } : p));
  };

  const generateCertificate = (program, empId) => {
    const emp = employees.find(e => e.employee_id === empId);
    const certWindow = window.open('', '_blank', 'width=800,height=600');
    certWindow.document.write(`
      <html><head><title>Training Certificate</title>
      <style>body{font-family:Georgia,serif;text-align:center;padding:60px;background:#fafafa;}
      .cert{border:4px double #4f46e5;padding:60px;max-width:700px;margin:0 auto;background:#fff;}
      h1{color:#4f46e5;font-size:2rem;margin-bottom:0.5rem;}h2{color:#333;font-size:1.5rem;}
      .line{border-bottom:2px solid #4f46e5;width:300px;margin:20px auto;}
      p{font-size:1.1rem;color:#555;}</style></head>
      <body><div class="cert">
      <h1>🏆 Certificate of Completion</h1><div class="line"></div>
      <p>This certifies that</p><h2>${emp?.name || empId}</h2>
      <p>has successfully completed the training program</p><h2>"${program.title}"</h2>
      <p>Duration: ${program.duration} | Category: ${program.category}</p>
      <p>Instructor: ${program.instructor}</p>
      <div class="line"></div><p style="margin-top:30px;">Date: ${new Date().toLocaleDateString()}</p>
      <p><em>HR Management Portal</em></p>
      </div><script>setTimeout(()=>window.print(),500)</script></body></html>
    `);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Training Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ Add Program'}
          </button>
        </div>

        {/* Summary */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Total Programs</p>
              <h2 className="fw-bold text-primary">{programs.length}</h2>
            </div></div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Active</p>
              <h2 className="fw-bold text-success">{programs.filter(p => p.status === 'Active').length}</h2>
            </div></div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm"><div className="card-body text-center">
              <p className="text-muted small mb-1">Total Enrollments</p>
              <h2 className="fw-bold text-info">{programs.reduce((a, p) => a + p.enrolled.length, 0)}</h2>
            </div></div>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Create Training Program</h5>
              <form onSubmit={addProgram}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-600">Program Title <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-600">Category <span className="text-danger">*</span></label>
                    <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      <option>Technical</option><option>Soft Skills</option><option>Compliance</option><option>Leadership</option><option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-600">Duration <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required placeholder="e.g. 40 hours" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-600">Instructor <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-success mt-3">Create Program</button>
              </form>
            </div>
          </div>
        )}

        {/* Programs List */}
        {programs.map(prog => (
          <div key={prog.id} className="card border-0 shadow-sm mb-3" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold mb-1">{prog.title}</h5>
                  <div className="d-flex gap-2 mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary">{prog.category}</span>
                    <span className="badge bg-secondary">{prog.duration}</span>
                    <span className={`badge ${prog.status === 'Active' ? 'bg-success' : 'bg-info'}`}>{prog.status}</span>
                  </div>
                  <p className="text-muted small mb-0">Instructor: {prog.instructor} | Enrolled: {prog.enrolled.length} employees</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedProgram(selectedProgram === prog.id ? null : prog.id)}>
                    {selectedProgram === prog.id ? 'Hide Details' : 'Manage'}
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleStatus(prog.id)}>
                    {prog.status === 'Active' ? 'Mark Complete' : 'Reactivate'}
                  </button>
                </div>
              </div>

              {selectedProgram === prog.id && (
                <div className="mt-3 pt-3 border-top">
                  <div className="row g-2 mb-3">
                    <div className="col-md-8">
                      <select className="form-select form-select-sm" value={enrollId} onChange={e => setEnrollId(e.target.value)}>
                        <option value="">Select employee to enroll...</option>
                        {employees.filter(e => !prog.enrolled.includes(e.employee_id)).map(e => (
                          <option key={e.employee_id} value={e.employee_id}>{e.name} ({e.employee_id})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <button className="btn btn-sm btn-success w-100" disabled={!enrollId} onClick={() => enrollEmployee(prog.id)}>+ Enroll</button>
                    </div>
                  </div>
                  <table className="table table-sm table-bordered">
                    <thead className="table-light"><tr><th>Employee</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {prog.enrolled.map(empId => {
                        const emp = employees.find(e => e.employee_id === empId);
                        return (
                          <tr key={empId}>
                            <td>{emp?.name || empId} ({empId})</td>
                            <td><span className={`badge ${prog.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>{prog.status === 'Completed' ? 'Completed' : 'In Progress'}</span></td>
                            <td>
                              {prog.status === 'Completed' && (
                                <button className="btn btn-sm btn-outline-success me-1" onClick={() => generateCertificate(prog, empId)}>🏆 Certificate</button>
                              )}
                              <button className="btn btn-sm btn-outline-danger" onClick={() => removeEnrollment(prog.id, empId)}>Remove</button>
                            </td>
                          </tr>
                        );
                      })}
                      {prog.enrolled.length === 0 && <tr><td colSpan="3" className="text-center text-muted">No employees enrolled</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPage;
