import React from 'react';
import { useNavigate } from 'react-router-dom';

// Emoji / icon map based on job title keywords
const getJobIcon = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('frontend') || t.includes('ui') || t.includes('react')) return '🖥️';
  if (t.includes('backend') || t.includes('node') || t.includes('api')) return '⚙️';
  if (t.includes('design') || t.includes('ux')) return '🎨';
  if (t.includes('data') || t.includes('ml') || t.includes('ai')) return '📊';
  if (t.includes('devops') || t.includes('cloud') || t.includes('infra')) return '☁️';
  if (t.includes('mobile') || t.includes('app')) return '📱';
  if (t.includes('security') || t.includes('cyber')) return '🔐';
  if (t.includes('product') || t.includes('manager')) return '🚀';
  if (t.includes('qa') || t.includes('test')) return '🧪';
  if (t.includes('scrum') || t.includes('agile')) return '🏃';
  if (t.includes('content') || t.includes('writer')) return '✍️';
  if (t.includes('database') || t.includes('dba')) return '🗃️';
  return '💼';
};

// Format date to human readable
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * JobCard — Reusable card component for displaying job summary.
 *
 * Props:
 *   job: { id, title, company, location, type, shortDescription, salary, posted }
 */
const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Navigate to job details page
    // BACKEND INTEGRATION: The job data is already available; details page will use same jobs array.
    // When connected to API, you can pass just the job.id and let the details page fetch from API.
    navigate(`/job/${job.id}`);
  };

  return (
    <div className="job-card h-100" onClick={handleViewDetails} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleViewDetails()}>

      {/* Card top: icon + badges */}
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="job-card-icon">{getJobIcon(job.title)}</div>
        <div className="d-flex flex-wrap gap-1 justify-content-end">
          <span className="badge-type">{job.type || 'Full-time'}</span>
        </div>
      </div>

      {/* Title & Company */}
      <div className="job-title">{job.title}</div>
      <div className="company-name">{job.company}</div>

      {/* Meta info */}
      <div className="job-meta d-flex align-items-center gap-2 flex-wrap">
        <span>📍 {job.location}</span>
        {job.salary && <span>💰 {job.salary}</span>}
      </div>

      {/* Short description */}
      <p className="job-desc">{job.shortDescription}</p>

      {/* Footer: date + CTA button */}
      <div className="d-flex align-items-center justify-content-between mt-auto">
        <span className="posted-date">📅 {formatDate(job.posted)}</span>
        <button
          className="btn-primary-custom"
          onClick={e => { e.stopPropagation(); handleViewDetails(); }}
          aria-label={`View details for ${job.title} at ${job.company}`}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default JobCard;
