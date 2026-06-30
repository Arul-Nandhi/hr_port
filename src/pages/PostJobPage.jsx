import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// PostJobPage — Let employers post a new job listing.
// BACKEND INTEGRATION: On submit, POST to 'https://your-api.com/api/jobs'
// with the form payload. Then redirect to "/" or the new job's details page.

const INITIAL_FORM = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  salary: '',
  shortDescription: '',
  description: '',
  requirements: '',
};

const INITIAL_ERRORS = {
  title: '',
  company: '',
  location: '',
  type: '',
  shortDescription: '',
  description: '',
  requirements: '',
};

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const PostJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim().length < 3 ? 'Job title must be at least 3 characters.' : '';
      case 'company':
        return value.trim().length < 2 ? 'Company name is required.' : '';
      case 'location':
        return value.trim().length < 2 ? 'Location is required.' : '';
      case 'shortDescription':
        return value.trim().length < 20 ? 'Short description must be at least 20 characters.' : '';
      case 'description':
        return value.trim().length < 50 ? 'Full description must be at least 50 characters.' : '';
      case 'requirements':
        return value.trim().length < 10 ? 'Please list at least one requirement.' : '';
      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    ['title', 'company', 'location', 'shortDescription', 'description', 'requirements'].forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);

    try {
      // BACKEND INTEGRATION: Replace timeout with API call:
      // const payload = {
      //   ...formData,
      //   requirements: formData.requirements.split('\n').filter(Boolean),
      //   posted: new Date().toISOString().split('T')[0],
      // };
      // await axios.post('https://your-api.com/api/jobs', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err) {
      console.error('Post job error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success State ──
  if (submitted) {
    return (
      <>
        <section className="page-hero">
          <div className="container position-relative" style={{ zIndex: 1 }}>
            <h1>Job Posted Successfully! 🎉</h1>
            <p>Your listing is now live and visible to thousands of candidates.</p>
          </div>
        </section>
        <div className="container py-5" style={{ maxWidth: 560 }}>
          <div className="success-alert text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontWeight: 800, color: '#059669' }}>Listing Published!</h3>
            <p style={{ color: '#064e3b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <strong>{formData.title}</strong> at <strong>{formData.company}</strong> has been posted successfully.
            </p>
            <p style={{ color: '#047857', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Candidates can now search and apply for your role.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button className="btn-primary-custom border-0" onClick={() => navigate('/')}>
                Browse All Jobs
              </button>
              <button className="btn-outline-custom border" onClick={() => { setSubmitted(false); setFormData(INITIAL_FORM); }}>
                Post Another Job
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="page-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <button className="btn-back mb-3 bg-white bg-opacity-10 border-0 text-white"
            onClick={() => navigate('/')}
            style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
            ← Back to Jobs
          </button>
          <h1 style={{ fontSize: '2rem' }}>Post a New Job 📢</h1>
          <p style={{ marginBottom: 0 }}>Fill in the details below to publish your listing.</p>
        </div>
      </section>

      {/* ── Form ── */}
      <div className="container py-4" style={{ maxWidth: 800 }}>
        <div className="apply-form-card">
          <h2 className="section-title mb-1">Job Details</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '2rem' }}>
            Fields marked with <span style={{ color: '#ef4444' }}>*</span> are required.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Row: Title + Company */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label-custom" htmlFor="title">
                  Job Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="title" name="title" type="text"
                  className={`form-control form-control-custom${errors.title ? ' is-invalid' : ''}`}
                  placeholder="e.g. Frontend Developer"
                  value={formData.title} onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>⚠️ {errors.title}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label-custom" htmlFor="company">
                  Company Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="company" name="company" type="text"
                  className={`form-control form-control-custom${errors.company ? ' is-invalid' : ''}`}
                  placeholder="e.g. TechNova Solutions"
                  value={formData.company} onChange={handleChange}
                />
                {errors.company && <div className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>⚠️ {errors.company}</div>}
              </div>
            </div>

            {/* Row: Location + Type + Salary */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <label className="form-label-custom" htmlFor="location">
                  Location <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="location" name="location" type="text"
                  className={`form-control form-control-custom${errors.location ? ' is-invalid' : ''}`}
                  placeholder="e.g. Coimbatore"
                  value={formData.location} onChange={handleChange}
                />
                {errors.location && <div className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>⚠️ {errors.location}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label-custom" htmlFor="type">Job Type</label>
                <select
                  id="type" name="type"
                  className="form-select form-control-custom"
                  value={formData.type} onChange={handleChange}
                >
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label-custom" htmlFor="salary">
                  Salary Range <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  id="salary" name="salary" type="text"
                  className="form-control form-control-custom"
                  placeholder="e.g. ₹8 – 12 LPA"
                  value={formData.salary} onChange={handleChange}
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="shortDescription">
                Short Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="shortDescription" name="shortDescription" type="text"
                className={`form-control form-control-custom${errors.shortDescription ? ' is-invalid' : ''}`}
                placeholder="One-line summary shown on the job card (max 120 chars)"
                maxLength={120}
                value={formData.shortDescription} onChange={handleChange}
              />
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>
                {formData.shortDescription.length}/120 characters
              </p>
              {errors.shortDescription && <div className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>⚠️ {errors.shortDescription}</div>}
            </div>

            {/* Full Description */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="description">
                Full Job Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="description" name="description" rows={5}
                className={`form-control form-control-custom${errors.description ? ' is-invalid' : ''}`}
                placeholder="Describe the role, responsibilities, and what makes your company great..."
                value={formData.description} onChange={handleChange}
              />
              {errors.description && <div className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>⚠️ {errors.description}</div>}
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="requirements">
                Requirements <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="requirements" name="requirements" rows={4}
                className={`form-control form-control-custom${errors.requirements ? ' is-invalid' : ''}`}
                placeholder={'Enter each requirement on a new line:\n3+ years with React.js\nStrong CSS skills\nFamiliarity with Git'}
                value={formData.requirements} onChange={handleChange}
              />
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>Each line = one requirement bullet point.</p>
              {errors.requirements && <div className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>⚠️ {errors.requirements}</div>}
            </div>

            {/* Submit */}
            <div className="d-flex gap-3 flex-wrap align-items-center">
              <button type="submit" className="btn-apply" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Publishing...</>
                ) : 'Publish Job Listing 🚀'}
              </button>
              <button type="button" className="btn-outline-custom border" onClick={() => navigate('/')} disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJobPage;
