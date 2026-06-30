import React, { useState } from 'react';
import { useHRData } from '../../context/HRDataContext';
import api from '../../utils/api';

const RecruitmentPage = () => {
  const { candidates, jobOpenings, addCandidate, updateCandidateStatus, departments } = useHRData();
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
  });
  const [jobForm, setJobForm] = useState({
    position: '',
    department: '',
    deadline: '',
    description: '',
  });

  const filteredCandidates = candidates.filter((candidate) =>
    !filterStatus || candidate.status === filterStatus
  );

  const handleAddCandidate = (e) => {
    e.preventDefault();
    addCandidate(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
    });
    setShowForm(false);
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('job-openings/', {
        position: jobForm.position,
        department: parseInt(jobForm.department),
        deadline: jobForm.deadline,
        description: jobForm.description,
        status: 'Open'
      });
      setJobForm({ position: '', department: '', deadline: '', description: '' });
      setShowJobForm(false);
      window.location.reload();
    } catch (err) {
      alert('Failed to add job opening');
    }
  };

  const statusColors = {
    'Applied': 'bg-info',
    'Shortlisted': 'bg-primary',
    'Interview Scheduled': 'bg-warning',
    'Selected': 'bg-success',
    'Rejected': 'bg-danger',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Recruitment Management</h1>
          <div>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => { setShowJobForm(!showJobForm); setShowForm(false); }}
            >
              {showJobForm ? '✕ Close' : '+ Add Position'}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => { setShowForm(!showForm); setShowJobForm(false); }}
            >
              {showForm ? '✕ Close' : '+ Add Candidate'}
            </button>
          </div>
        </div>

        {/* Job Openings */}
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="fw-bold mb-3">Open Positions</h5>
          </div>
          {jobOpenings.map((job) => (
            <div key={job.job_id} className="col-md-6 col-lg-4 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title fw-bold">{job.position}</h6>
                  <p className="text-muted small mb-2">
                    📅 Deadline: {job.deadline}
                  </p>
                  <span className="badge bg-success">Open</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Job Form */}
        {showJobForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Add Open Position</h5>
              <form onSubmit={handleAddJob}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Position Title</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={jobForm.position}
                      onChange={(e) => setJobForm({ ...jobForm, position: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Department</label>
                    <select
                      className="form-control"
                      required
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      {departments?.map((dept) => (
                        <option key={dept.department_id} value={dept.department_id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      required
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  Post Position
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add Candidate Form */}
        {showForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Add New Candidate</h5>
              <form onSubmit={handleAddCandidate}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Position</label>
                    <select
                      className="form-control"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    >
                      <option value="">Select Position</option>
                      {jobOpenings.map((job) => (
                        <option key={job.job_id} value={job.position}>
                          {job.position}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  Add Candidate
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">Filter by Status</label>
            <select
              className="form-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Candidate Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.candidate_id}>
                    <td className="fw-500">{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>{candidate.position}</td>
                    <td>{candidate.applied_date}</td>
                    <td>
                      <span className={`badge ${statusColors[candidate.status] || 'bg-secondary'}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={candidate.status}
                        onChange={(e) => updateCandidateStatus(candidate.candidate_id, e.target.value)}
                        style={{ maxWidth: '150px' }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="alert alert-info mt-3">No candidates found.</div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentPage;
