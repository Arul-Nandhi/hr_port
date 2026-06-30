import React, { useState, useEffect, useMemo } from 'react';
import JobCard from '../components/JobCard';
import jobs from '../data/jobs';

// BACKEND INTEGRATION: Replace the `jobs` import with an API call.
// import { fetchJobs } from '../data/jobs';
// Then inside useEffect: const data = await fetchJobs(); setAllJobs(data);

const JOBS_PER_PAGE = 5;

// Get unique locations from job data
const getLocations = (data) => ['All Locations', ...new Set(data.map(j => j.location))];

const JobListPage = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Simulate data load (replace this with API fetch when backend is ready)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllJobs(jobs);  // BACKEND: replace with: const data = await fetchJobs(); setAllJobs(data);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Derived: filtered jobs
  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allJobs.filter(job => {
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q);
      const matchesLocation =
        locationFilter === 'All Locations' || job.location === locationFilter;
      return matchesSearch && matchesLocation;
    });
  }, [allJobs, search, locationFilter]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, locationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const locations = getLocations(allJobs);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleLocationChange = (e) => setLocationFilter(e.target.value);
  const handleClearFilters = () => {
    setSearch('');
    setLocationFilter('All Locations');
  };

  const hasFilters = search || locationFilter !== 'All Locations';

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="page-hero">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <h1>Find Your Dream Job 🚀</h1>
          <p>
            Browse {allJobs.length}+ opportunities from top companies across India.
            Your next career move starts here.
          </p>
        </div>
      </section>

      {/* ── Search & Filter Bar ── */}
      <div className="container">
        <div className="search-filter-bar">
          <div className="row g-3 align-items-end">
            {/* Search */}
            <div className="col-md-6">
              <label className="form-label-custom d-block mb-1" htmlFor="jobSearch">
                🔍 Search Jobs
              </label>
              <input
                id="jobSearch"
                type="text"
                className="form-control search-input"
                placeholder="Search by job title or company..."
                value={search}
                onChange={handleSearchChange}
                aria-label="Search jobs by title or company"
              />
            </div>

            {/* Location filter */}
            <div className="col-md-4">
              <label className="form-label-custom d-block mb-1" htmlFor="locationFilter">
                📍 Filter by Location
              </label>
              <select
                id="locationFilter"
                className="form-select search-input"
                value={locationFilter}
                onChange={handleLocationChange}
                aria-label="Filter jobs by location"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Clear button */}
            <div className="col-md-2 d-flex align-items-end">
              {hasFilters && (
                <button
                  className="btn-outline-custom w-100 border"
                  onClick={handleClearFilters}
                  aria-label="Clear all filters"
                >
                  Clear ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Job Cards Grid ── */}
      <section className="container py-5">
        {/* Results header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h2 className="section-title mb-0">
            {loading ? 'Loading Jobs...' : (
              <>
                {filteredJobs.length === 0
                  ? 'No jobs found'
                  : `${filteredJobs.length} Job${filteredJobs.length !== 1 ? 's' : ''} Found`}
              </>
            )}
          </h2>
          {!loading && filteredJobs.length > 0 && (
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {((currentPage - 1) * JOBS_PER_PAGE) + 1}–
              {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="spinner-wrapper">
            <div className="spinner-border" style={{ color: '#4f46e5', width: 42, height: 42 }} role="status">
              <span className="visually-hidden">Loading jobs...</span>
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && filteredJobs.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h4 style={{ fontWeight: 700, color: '#1e293b' }}>No jobs match your search</h4>
            <p style={{ fontSize: '0.93rem' }}>
              Try adjusting your search or clearing filters.
            </p>
            <button className="btn-primary-custom border-0" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Job cards */}
        {!loading && filteredJobs.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {paginatedJobs.map(job => (
              <div className="col" key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="pagination-container">
            {/* Previous */}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ← Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-page${currentPage === page ? ' active' : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default JobListPage;
