import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobs from '../data/jobs';

// BACKEND INTEGRATION: Replace the import with:
// import { fetchJobById } from '../data/jobs';
// Then: const data = await fetchJobById(id); setJob(data);

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Simulate async fetch (mimic API call)
    const timer = setTimeout(() => {
      const found = jobs.find(j => j.id === parseInt(id, 10));
      if (found) {
        setJob(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [id]);

  const handleApply = () => {
    navigate(`/apply/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="container py-5">
        <div className="spinner-wrapper">
          <div className="spinner-border" style={{ color: '#4f46e5', width: 42, height: 42 }} role="status">
            <span className="visually-hidden">Loading job details...</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Not Found ──
  if (notFound) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: '4rem' }}>😔</div>
        <h2 style={{ fontWeight: 800 }}>Job Not Found</h2>
        <p style={{ color: '#64748b' }}>The job you are looking for does not exist or has been removed.</p>
        <button className="btn-primary-custom border-0 mt-3" onClick={() => navigate('/')}>
          ← Back to All Jobs
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <button className="btn-back mb-3 bg-white bg-opacity-10 border-0 text-white" onClick={handleBack}
            style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
            ← Back
          </button>
          <h1 style={{ fontSize: '1.9rem' }}>{job.title}</h1>
          <p style={{ marginBottom: 0, opacity: 0.9 }}>{job.company} · {job.location}</p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container py-4" style={{ maxWidth: 860 }}>
        <div className="job-details-card">

          {/* ── Header ── */}
          <div className="details-header">
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
              <div>
                <h2 className="details-title">{job.title}</h2>
                <div className="details-company">{job.company}</div>
              </div>
              {job.salary && (
                <div className="salary-badge flex-shrink-0">
                  💰 {job.salary}
                </div>
              )}
            </div>

            {/* Meta chips */}
            <div className="details-meta-row">
              <span className="meta-chip"><span>📍</span> {job.location}</span>
              <span className="meta-chip"><span>💼</span> {job.type}</span>
              {job.posted && (
                <span className="meta-chip">
                  <span>📅</span> Posted on{' '}
                  {new Date(job.posted).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>

          {/* ── About the Role ── */}
          <section className="mb-4">
            <h3 className="form-section-title mb-2">About the Role</h3>
            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.75 }}>
              {job.description}
            </p>
          </section>

          <hr className="divider mb-4" />

          {/* ── Requirements ── */}
          <section className="mb-4">
            <h3 className="form-section-title mb-3">Requirements</h3>
            {job.requirements && job.requirements.length > 0 ? (
              <ul className="requirements-list">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No specific requirements listed.</p>
            )}
          </section>

          <hr className="divider mb-4" />

          {/* ── CTA ── */}
          <div className="d-flex flex-wrap align-items-center gap-3 justify-content-between">
            <div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                Ready to take the next step in your career?
              </p>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                Applications are reviewed within 3–5 business days.
              </p>
            </div>
            <button className="btn-apply" onClick={handleApply}
              aria-label={`Apply for ${job.title} at ${job.company}`}>
              Apply Now ✨
            </button>
          </div>
        </div>

        {/* ── Similar Jobs hint ── */}
        {/* BACKEND INTEGRATION: Fetch related jobs here via:
            const related = await fetchJobs({ location: job.location, limit: 3 });
            Then render them below as a mini job list */}
      </div>
    </>
  );
};

export default JobDetailsPage;
