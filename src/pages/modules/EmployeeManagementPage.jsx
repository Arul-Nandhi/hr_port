import React, { useState, useMemo } from 'react';
import { useHRData } from '../../context/HRDataContext';
import SearchableSelect from '../../components/SearchableSelect';

const ITEMS_PER_PAGE = 8;

const EmployeeManagementPage = () => {
  const { employees, departments, addEmployee, deleteEmployee, updateEmployee, attendance, leaveRequests, payroll } = useHRData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('employee_id');
  const [sortDir, setSortDir] = useState('asc');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department_id: '', designation: '', joining_date: '', address: ''
  });

  // Sub-tab form states
  const [contactForm, setContactForm] = useState({ name: '', relation: '', phone: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: 3 });
  const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '' });
  const [assetForm, setAssetForm] = useState({ type: 'Laptop', serial: '', assigned_date: '' });
  const [docForm, setDocForm] = useState({ name: '', type: 'ID Proof', expiry: '' });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    addEmployee(formData);
    setFormData({ name: '', email: '', phone: '', department_id: '', designation: '', joining_date: '', address: '' });
    setShowForm(false);
  };

  // Filtering, sorting, pagination
  const filteredEmployees = useMemo(() => {
    let result = employees.filter((emp) => {
      const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !filterDept || String(emp.department) === String(filterDept);
      return matchesSearch && matchesDept;
    });
    result.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDir === 'asc') return String(aVal).localeCompare(String(bVal));
      return String(bVal).localeCompare(String(aVal));
    });
    return result;
  }, [employees, searchTerm, filterDept, sortField, sortDir]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sortIcon = (field) => sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  // CSV Export
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date'];
    const rows = filteredEmployees.map(emp => [
      emp.employee_id, emp.name, emp.email, emp.phone,
      departments.find(d => d.department_id === emp.department)?.department_name || '',
      emp.designation, emp.joining_date
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'employees_report.csv'; a.click();
  };

  // Sub-tab JSON field helpers
  const parseJSON = (str) => { try { return JSON.parse(str || '[]'); } catch { return []; } };

  const addSubItem = (emp, field, item) => {
    const list = parseJSON(emp[field]);
    list.push({ ...item, id: Date.now() });
    updateEmployee(emp.employee_id, { [field]: JSON.stringify(list) });
    setSelectedEmployee({ ...emp, [field]: JSON.stringify(list) });
  };

  const removeSubItem = (emp, field, id) => {
    const list = parseJSON(emp[field]).filter(i => i.id !== id);
    updateEmployee(emp.employee_id, { [field]: JSON.stringify(list) });
    setSelectedEmployee({ ...emp, [field]: JSON.stringify(list) });
  };

  const deptOptions = departments.map(d => ({ value: d.department_id, label: d.department_name }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0">Employee Management</h1>
          <div>
            <button className="btn btn-outline-success me-2" onClick={exportCSV}>📊 Export CSV</button>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Close' : '+ Add Employee'}
            </button>
          </div>
        </div>

        {/* Add Employee Form */}
        {showForm && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add New Employee</h5>
              <form onSubmit={handleAddEmployee}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-600 small">Full Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-600 small">Email <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" required value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-600 small">Phone <span className="text-danger">*</span></label>
                    <input type="tel" className="form-control" required value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <SearchableSelect
                      label="Department" required
                      options={deptOptions}
                      value={formData.department_id}
                      onChange={(val) => setFormData({ ...formData, department_id: val })}
                      placeholder="Select department..."
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-600 small">Designation <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-600 small">Joining Date <span className="text-danger">*</span></label>
                    <input type="date" className="form-control" required value={formData.joining_date}
                      onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })} />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-600 small">Address <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" required value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">Add Employee</button>
              </form>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="row mb-4">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="🔍 Search by name or ID..."
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="col-md-6">
            <select className="form-select" value={filterDept}
              onChange={(e) => { setFilterDept(e.target.value); setCurrentPage(1); }}>
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('employee_id')}>ID{sortIcon('employee_id')}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Name{sortIcon('name')}</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('department')}>Department{sortIcon('department')}</th>
                  <th>Designation</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('joining_date')}>Joining Date{sortIcon('joining_date')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td><span className="badge bg-primary">{emp.employee_id}</span></td>
                    <td className="fw-500" style={{ cursor: 'pointer', color: '#4f46e5' }}
                      onClick={() => { setSelectedEmployee(emp); setActiveTab('details'); }}>
                      {emp.name}
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{departments.find(d => d.department_id === emp.department)?.department_name || 'N/A'}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.joining_date}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => { setSelectedEmployee(emp); setActiveTab('details'); }}>View</button>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteEmployee(emp.employee_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h5 className="text-muted">No employees found</h5>
            <p className="text-muted small">Try adjusting your search or filter criteria</p>
          </div>
        )}

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

        {/* Employee Detail Drawer */}
        {selectedEmployee && (
          <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="fw-bold mb-0">👤 {selectedEmployee.name} — Employee Profile</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedEmployee(null)}>✕ Close</button>
            </div>
            
            {/* Sub-module tabs */}
            <ul className="nav nav-tabs px-3 pt-2">
              {['details', 'contacts', 'skills', 'certifications', 'assets', 'documents', 'history', 'attendance', 'leaves', 'payroll', 'performance'].map(tab => (
                <li className="nav-item" key={tab}>
                  <button className={`nav-link ${activeTab === tab ? 'active fw-bold' : ''}`}
                    onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
                    {tab === 'contacts' ? 'Emergency Contacts' : tab === 'leaves' ? 'Leave Requests' : tab}
                  </button>
                </li>
              ))}
            </ul>

            <div className="card-body p-4">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="row g-3">
                  <div className="col-md-6"><strong>Employee ID:</strong> {selectedEmployee.employee_id}</div>
                  <div className="col-md-6"><strong>Email:</strong> {selectedEmployee.email}</div>
                  <div className="col-md-6"><strong>Phone:</strong> {selectedEmployee.phone}</div>
                  <div className="col-md-6"><strong>Department:</strong> {departments.find(d => d.department_id === selectedEmployee.department)?.department_name || 'N/A'}</div>
                  <div className="col-md-6"><strong>Designation:</strong> {selectedEmployee.designation}</div>
                  <div className="col-md-6"><strong>Joining Date:</strong> {selectedEmployee.joining_date}</div>
                  <div className="col-12"><strong>Address:</strong> {selectedEmployee.address}</div>
                  <div className="col-md-6"><strong>Status:</strong> <span className={`badge ${selectedEmployee.is_active ? 'bg-success' : 'bg-secondary'}`}>{selectedEmployee.is_active ? 'Active' : 'Inactive'}</span></div>
                </div>
              )}

              {/* Emergency Contacts Tab */}
              {activeTab === 'contacts' && (
                <div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-4">
                      <input type="text" className="form-control form-control-sm" placeholder="Contact Name *"
                        value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="text" className="form-control form-control-sm" placeholder="Relation *"
                        value={contactForm.relation} onChange={e => setContactForm({ ...contactForm, relation: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="tel" className="form-control form-control-sm" placeholder="Phone *"
                        value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-sm btn-success w-100" disabled={!contactForm.name || !contactForm.phone}
                        onClick={() => { addSubItem(selectedEmployee, 'emergency_contacts', contactForm); setContactForm({ name: '', relation: '', phone: '' }); }}>
                        + Add
                      </button>
                    </div>
                  </div>
                  <table className="table table-sm table-bordered">
                    <thead className="table-light"><tr><th>Name</th><th>Relation</th><th>Phone</th><th>Action</th></tr></thead>
                    <tbody>
                      {parseJSON(selectedEmployee.emergency_contacts).map(c => (
                        <tr key={c.id}><td>{c.name}</td><td>{c.relation}</td><td>{c.phone}</td>
                          <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(selectedEmployee, 'emergency_contacts', c.id)}>Remove</button></td></tr>
                      ))}
                      {parseJSON(selectedEmployee.emergency_contacts).length === 0 && <tr><td colSpan="4" className="text-center text-muted">No emergency contacts added</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-5">
                      <input type="text" className="form-control form-control-sm" placeholder="Skill Name *"
                        value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <select className="form-select form-select-sm" value={skillForm.level}
                        onChange={e => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}>
                        {[1, 2, 3, 4, 5].map(l => <option key={l} value={l}>{l} {'★'.repeat(l)}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-sm btn-success w-100" disabled={!skillForm.name}
                        onClick={() => { addSubItem(selectedEmployee, 'skills_tracking', skillForm); setSkillForm({ name: '', level: 3 }); }}>
                        + Add
                      </button>
                    </div>
                  </div>
                  <div className="row g-2">
                    {parseJSON(selectedEmployee.skills_tracking).map(s => (
                      <div key={s.id} className="col-md-4">
                        <div className="card border shadow-sm p-2 d-flex flex-row justify-content-between align-items-center">
                          <div><strong>{s.name}</strong><br /><span className="text-warning">{'★'.repeat(s.level)}{'☆'.repeat(5 - s.level)}</span></div>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(selectedEmployee, 'skills_tracking', s.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                    {parseJSON(selectedEmployee.skills_tracking).length === 0 && <p className="text-muted">No skills tracked yet</p>}
                  </div>
                </div>
              )}

              {/* Certifications Tab */}
              {activeTab === 'certifications' && (
                <div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-4">
                      <input type="text" className="form-control form-control-sm" placeholder="Certification Name *"
                        value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="text" className="form-control form-control-sm" placeholder="Issuer"
                        value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="date" className="form-control form-control-sm"
                        value={certForm.date} onChange={e => setCertForm({ ...certForm, date: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-sm btn-success w-100" disabled={!certForm.name}
                        onClick={() => { addSubItem(selectedEmployee, 'certifications', certForm); setCertForm({ name: '', issuer: '', date: '' }); }}>
                        + Add
                      </button>
                    </div>
                  </div>
                  <table className="table table-sm table-bordered">
                    <thead className="table-light"><tr><th>Certificate</th><th>Issuer</th><th>Date</th><th>Action</th></tr></thead>
                    <tbody>
                      {parseJSON(selectedEmployee.certifications).map(c => (
                        <tr key={c.id}><td>{c.name}</td><td>{c.issuer}</td><td>{c.date}</td>
                          <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(selectedEmployee, 'certifications', c.id)}>Remove</button></td></tr>
                      ))}
                      {parseJSON(selectedEmployee.certifications).length === 0 && <tr><td colSpan="4" className="text-center text-muted">No certifications added</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Assets Tab */}
              {activeTab === 'assets' && (
                <div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-3">
                      <select className="form-select form-select-sm" value={assetForm.type}
                        onChange={e => setAssetForm({ ...assetForm, type: e.target.value })}>
                        <option>Laptop</option><option>Mobile</option><option>ID Card</option><option>Access Card</option><option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control form-control-sm" placeholder="Serial/Asset ID *"
                        value={assetForm.serial} onChange={e => setAssetForm({ ...assetForm, serial: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="date" className="form-control form-control-sm"
                        value={assetForm.assigned_date} onChange={e => setAssetForm({ ...assetForm, assigned_date: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-sm btn-success w-100" disabled={!assetForm.serial}
                        onClick={() => { addSubItem(selectedEmployee, 'assigned_assets', assetForm); setAssetForm({ type: 'Laptop', serial: '', assigned_date: '' }); }}>
                        + Add
                      </button>
                    </div>
                  </div>
                  <table className="table table-sm table-bordered">
                    <thead className="table-light"><tr><th>Type</th><th>Serial/ID</th><th>Assigned Date</th><th>Action</th></tr></thead>
                    <tbody>
                      {parseJSON(selectedEmployee.assigned_assets).map(a => (
                        <tr key={a.id}><td><span className="badge bg-info">{a.type}</span></td><td>{a.serial}</td><td>{a.assigned_date}</td>
                          <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(selectedEmployee, 'assigned_assets', a.id)}>Return</button></td></tr>
                      ))}
                      {parseJSON(selectedEmployee.assigned_assets).length === 0 && <tr><td colSpan="4" className="text-center text-muted">No assets assigned</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-4">
                      <input type="text" className="form-control form-control-sm" placeholder="Document Name *"
                        value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <select className="form-select form-select-sm" value={docForm.type}
                        onChange={e => setDocForm({ ...docForm, type: e.target.value })}>
                        <option>ID Proof</option><option>Address Proof</option><option>Contract</option><option>Offer Letter</option><option>Certificate</option><option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input type="date" className="form-control form-control-sm" placeholder="Expiry Date"
                        value={docForm.expiry} onChange={e => setDocForm({ ...docForm, expiry: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-sm btn-success w-100" disabled={!docForm.name}
                        onClick={() => { addSubItem(selectedEmployee, 'documents', docForm); setDocForm({ name: '', type: 'ID Proof', expiry: '' }); }}>
                        + Add
                      </button>
                    </div>
                  </div>
                  <table className="table table-sm table-bordered">
                    <thead className="table-light"><tr><th>Document</th><th>Type</th><th>Expiry</th><th>Action</th></tr></thead>
                    <tbody>
                      {parseJSON(selectedEmployee.documents).map(d => (
                        <tr key={d.id}><td>{d.name}</td><td><span className="badge bg-secondary">{d.type}</span></td>
                          <td>{d.expiry ? <span className={new Date(d.expiry) < new Date() ? 'text-danger fw-bold' : ''}>{d.expiry}{new Date(d.expiry) < new Date() ? ' ⚠️ Expired' : ''}</span> : '—'}</td>
                          <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeSubItem(selectedEmployee, 'documents', d.id)}>Remove</button></td></tr>
                      ))}
                      {parseJSON(selectedEmployee.documents).length === 0 && <tr><td colSpan="4" className="text-center text-muted">No documents uploaded</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  {parseJSON(selectedEmployee.history).length === 0 ? (
                    <p className="text-muted text-center py-3">No history records available</p>
                  ) : (
                    <div className="list-group">
                      {parseJSON(selectedEmployee.history).map(h => (
                        <div key={h.id} className="list-group-item border-0 border-start border-3 border-primary mb-2">
                          <strong>{h.action}</strong>
                          <p className="text-muted small mb-0">{h.date} — {h.details}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === 'attendance' && (
                <div>
                  <h6 className="fw-bold mb-3">Attendance History</h6>
                  <div className="table-responsive">
                    <table className="table table-hover table-sm">
                      <thead className="table-light">
                        <tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {attendance.filter(a => (a.employee_id || a.employee) === selectedEmployee.employee_id).map(a => (
                          <tr key={a.attendance_id}>
                            <td>{a.date}</td>
                            <td>{a.check_in || '—'}</td>
                            <td>{a.check_out || '—'}</td>
                            <td>
                              <span className={`badge ${a.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>{a.status}</span>
                            </td>
                          </tr>
                        ))}
                        {attendance.filter(a => (a.employee_id || a.employee) === selectedEmployee.employee_id).length === 0 && (
                          <tr><td colSpan="4" className="text-center text-muted py-2">No attendance records found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Leaves Tab */}
              {activeTab === 'leaves' && (
                <div>
                  <h6 className="fw-bold mb-3">Leave History & Requests</h6>
                  <div className="table-responsive">
                    <table className="table table-hover table-sm">
                      <thead className="table-light">
                        <tr><th>Leave Type</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {leaveRequests.filter(l => (l.employee_id || l.employee) === selectedEmployee.employee_id).map(l => (
                          <tr key={l.leave_id}>
                            <td>{l.leave_type}</td>
                            <td>{l.start_date}</td>
                            <td>{l.end_date}</td>
                            <td>{l.reason}</td>
                            <td>
                              <span className={`badge ${l.status === 'Approved' ? 'bg-success' : l.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>{l.status}</span>
                            </td>
                          </tr>
                        ))}
                        {leaveRequests.filter(l => (l.employee_id || l.employee) === selectedEmployee.employee_id).length === 0 && (
                          <tr><td colSpan="5" className="text-center text-muted py-2">No leave requests found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payroll Tab */}
              {activeTab === 'payroll' && (
                <div>
                  <h6 className="fw-bold mb-3">Salary & Payroll History</h6>
                  <div className="table-responsive">
                    <table className="table table-hover table-sm">
                      <thead className="table-light">
                        <tr><th>Month</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Salary</th></tr>
                      </thead>
                      <tbody>
                        {payroll.filter(p => (p.employee_id || p.employee) === selectedEmployee.employee_id).map(p => (
                          <tr key={p.salary_id}>
                            <td>{p.month} {p.year}</td>
                            <td>₹{parseFloat(p.basic_salary).toLocaleString()}</td>
                            <td>₹{parseFloat(p.allowances).toLocaleString()}</td>
                            <td>₹{parseFloat(p.deductions).toLocaleString()}</td>
                            <td className="fw-bold text-success">₹{parseFloat(p.net_salary).toLocaleString()}</td>
                          </tr>
                        ))}
                        {payroll.filter(p => (p.employee_id || p.employee) === selectedEmployee.employee_id).length === 0 && (
                          <tr><td colSpan="5" className="text-center text-muted py-2">No payroll records found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div>
                  <h6 className="fw-bold mb-3">Performance Goals</h6>
                  <div className="table-responsive">
                    <table className="table table-hover table-sm">
                      <thead className="table-light">
                        <tr><th>Goal</th><th>KPI</th><th>Target</th><th>Progress</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 1, employee_id: 'EMP001', goal: 'Complete React Training', kpi: 'Skill Development', target: '100%', progress: 75, status: 'In Progress' },
                          { id: 2, employee_id: 'EMP002', goal: 'Reduce Bug Count by 30%', kpi: 'Code Quality', target: '30% reduction', progress: 90, status: 'On Track' },
                          { id: 3, employee_id: 'EMP003', goal: 'Lead 2 Client Presentations', kpi: 'Leadership', target: '2 presentations', progress: 50, status: 'In Progress' },
                        ].filter(g => g.employee_id === selectedEmployee.employee_id).map(g => (
                          <tr key={g.id}>
                            <td>{g.goal}</td>
                            <td><span className="badge bg-primary bg-opacity-10 text-primary">{g.kpi}</span></td>
                            <td>{g.target}</td>
                            <td>{g.progress}%</td>
                            <td><span className={`badge ${g.status === 'Completed' ? 'bg-success' : g.status === 'On Track' ? 'bg-info' : 'bg-warning'}`}>{g.status}</span></td>
                          </tr>
                        ))}
                        {[
                          { id: 1, employee_id: 'EMP001', goal: 'Complete React Training', kpi: 'Skill Development', target: '100%', progress: 75, status: 'In Progress' },
                          { id: 2, employee_id: 'EMP002', goal: 'Reduce Bug Count by 30%', kpi: 'Code Quality', target: '30% reduction', progress: 90, status: 'On Track' },
                          { id: 3, employee_id: 'EMP003', goal: 'Lead 2 Client Presentations', kpi: 'Leadership', target: '2 presentations', progress: 50, status: 'In Progress' },
                        ].filter(g => g.employee_id === selectedEmployee.employee_id).length === 0 && (
                          <tr><td colSpan="5" className="text-center text-muted py-2">No goals configured for this employee</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
