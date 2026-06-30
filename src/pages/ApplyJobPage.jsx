import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobs from '../data/jobs';

// BACKEND INTEGRATION: On submit, replace the simulated success with:
// await axios.post('https://your-api.com/api/applications', formPayload);
// For resume upload: use FormData and multipart/form-data content type.

// Initial form state
const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  resume: null,
  coverLetter: '',
};

// Initial error state
const INITIAL_ERRORS = {
  fullName: '',
  email: '',
  phone: '',
  resume: '',
  coverLetter: '',
};

// Email regex validator
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Phone regex: 10 digits (with optional +91 prefix)
const isValidPhone = (phone) =>
  /^(\+91[-\s]?)?[0-9]{10}$/.test(phone.trim());

const ApplyJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load job info (to show which job user is applying for)
  useEffect(() => {
    const found = jobs.find(j => j.id === parseInt(id, 10));
    setJob(found || null);
  }, [id]);

  // ── Validate individual field ──
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.trim().length < 2 ? 'Full name must be at least 2 characters.' : '';
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        if (!isValidEmail(value)) return 'Please enter a valid email address.';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required.';
        if (!isValidPhone(value)) return 'Enter a valid 10-digit phone number.';
        return '';
      case 'resume':
        if (!value) return 'Please upload your resume.';
        if (value && !['application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type)) {
          return 'Resume must be a PDF or Word document.';
        }
        if (value && value.size > 5 * 1024 * 1024) {
          return 'Resume file size must be under 5 MB.';
        }
        return '';
      case 'coverLetter':
        if (value.trim() && value.trim().length < 30) {
          return 'Cover letter should be at least 30 characters.';
        }
        return '';
      default:
        return '';
    }
  };

  // ── Validate all fields ──
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(INITIAL_FORM).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    setErrors(newErrors);
    return isValid;
  };

  // ── Handle input change ──
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Validate on change (live feedback)
    const error = validateField(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // ── Handle form submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);

    try {
      // BACKEND INTEGRATION: Replace the timeout with a real API call:
      // const formPayload = new FormData();
      // formPayload.append('fullName', formData.fullName);
      // formPayload.append('email', formData.email);
      // formPayload.append('phone', formData.phone);
      // formPayload.append('resume', formData.resume);
      // formPayload.append('coverLetter', formData.coverLetter);
      // formPayload.append('jobId', id);
      // await axios.post('https://your-api.com/api/applications', formPayload);

      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulated API delay
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      // BACKEND: Show error toast/notification here
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
            <h1>Application Submitted! 🎉</h1>
            <p>We've received your application and will get back to you shortly.</p>
          </div>
        </section>

        <div className="container py-5" style={{ maxWidth: 600 }}>
          <div className="success-alert text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontWeight: 800, color: '#059669' }}>Application Successful!</h3>
            <p style={{ color: '#064e3b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <strong>Hi {formData.fullName}!</strong> Your application for{' '}
              <strong>{job?.title}</strong> at <strong>{job?.company}</strong> has been received.
            </p>
            <p style={{ color: '#047857', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              📧 A confirmation email will be sent to <strong>{formData.email}</strong> within a few minutes.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button className="btn-primary-custom border-0" onClick={() => navigate('/')}>
                Browse More Jobs
              </button>
              <button className="btn-outline-custom border" onClick={() => navigate(`/job/${id}`)}>
                View Job Details
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
            onClick={() => navigate(`/job/${id}`)}
            style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
            ← Back to Job Details
          </button>
          <h1 style={{ fontSize: '1.9rem' }}>Apply for: {job?.title || 'Job'}</h1>
          <p style={{ marginBottom: 0 }}>{job?.company} · {job?.location}</p>
        </div>
      </section>

      {/* ── Form ── */}
      <div className="container py-4" style={{ maxWidth: 720 }}>
        <div className="apply-form-card">
          <h2 className="section-title mb-1">Your Application</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '2rem' }}>
            All fields marked with * are required.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* ── Full Name ── */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="fullName">
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                className={`form-control form-control-custom${errors.fullName ? ' is-invalid' : ''}`}
                placeholder="e.g. Arjun Sharma"
                value={formData.fullName}
                onChange={handleChange}
                aria-describedby="fullNameError"
              />
              {errors.fullName && (
                <div id="fullNameError" className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>
                  ⚠️ {errors.fullName}
                </div>
              )}
            </div>

            {/* ── Email ── */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="email">
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-control form-control-custom${errors.email ? ' is-invalid' : ''}`}
                placeholder="e.g. arjun@gmail.com"
                value={formData.email}
                onChange={handleChange}
                aria-describedby="emailError"
              />
              {errors.email && (
                <div id="emailError" className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>
                  ⚠️ {errors.email}
                </div>
              )}
            </div>

            {/* ── Phone ── */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="phone">
                Phone Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className={`form-control form-control-custom${errors.phone ? ' is-invalid' : ''}`}
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                aria-describedby="phoneError"
              />
              {errors.phone && (
                <div id="phoneError" className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>
                  ⚠️ {errors.phone}
                </div>
              )}
            </div>

            {/* ── Resume Upload ── */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="resume">
                Resume / CV <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="resume"
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                className={`form-control form-control-custom${errors.resume ? ' is-invalid' : ''}`}
                onChange={handleChange}
                aria-describedby="resumeError"
              />
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                Accepted formats: PDF, DOC, DOCX · Max size: 5 MB
              </p>
              {errors.resume && (
                <div id="resumeError" className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>
                  ⚠️ {errors.resume}
                </div>
              )}
            </div>

            {/* ── Cover Letter ── */}
            <div className="mb-4">
              <label className="form-label-custom" htmlFor="coverLetter">
                Cover Letter{' '}
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={5}
                className={`form-control form-control-custom${errors.coverLetter ? ' is-invalid' : ''}`}
                placeholder="Tell us why you're a great fit for this role..."
                value={formData.coverLetter}
                onChange={handleChange}
                aria-describedby="coverLetterError"
              />
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                ({formData.coverLetter.length} characters)
              </p>
              {errors.coverLetter && (
                <div id="coverLetterError" className="invalid-feedback d-block" style={{ fontSize: '0.82rem' }}>
                  ⚠️ {errors.coverLetter}
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <button
                type="submit"
                className="btn-apply"
                disabled={isSubmitting}
                aria-label="Submit application"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application ✨'
                )}
              </button>
              <button
                type="button"
                className="btn-outline-custom border"
                onClick={() => navigate(`/job/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplyJobPage;
