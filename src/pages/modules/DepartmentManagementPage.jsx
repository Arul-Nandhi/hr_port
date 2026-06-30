import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';

const DepartmentManagementPage = () => {
  const { departments, employees } = useHRData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);

  const filteredDepartments = departments.filter((dept) =>
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDepartmentEmployees = (deptId) => {
    return employees.filter((emp) => emp.department === deptId).length;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <h1 className="fw-bold mb-4">Department Management</h1>

        {/* Search */}
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Departments Grid */}
        <div className="row">
          {filteredDepartments.map((dept) => (
            <div key={dept.department_id} className="col-md-6 col-lg-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">{dept.department_name}</h5>
                  <div className="mb-3">
                    <p className="text-muted small mb-2">Department Head</p>
                    <p className="fw-500">{dept.department_head}</p>
                  </div>
                  <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-muted small mb-2">Total Employees</p>
                    <p className="fw-bold" style={{ fontSize: '1.5rem', color: '#667eea' }}>
                      {getDepartmentEmployees(dept.department_id)}
                    </p>
                  </div>
                  <button className="btn btn-outline-primary w-100 btn-sm" onClick={() => setSelectedDept(dept)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="alert alert-info">No departments found.</div>
        )}

        {/* Department Employees List */}
        {selectedDept && (
          <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="fw-bold mb-0">👥 Employees in {selectedDept.department_name}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedDept(null)}>✕ Close</button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.filter(emp => emp.department === selectedDept.department_id).map(emp => (
                    <tr key={emp.employee_id}>
                      <td><span className="badge bg-primary">{emp.employee_id}</span></td>
                      <td className="fw-500">{emp.name}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.email}</td>
                    </tr>
                  ))}
                  {employees.filter(emp => emp.department === selectedDept.department_id).length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">No employees in this department</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagementPage;
