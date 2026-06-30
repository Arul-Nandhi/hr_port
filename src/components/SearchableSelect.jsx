import React, { useState, useRef, useEffect } from 'react';

const SearchableSelect = ({ options, value, onChange, placeholder, label, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="mb-3 position-relative" ref={containerRef}>
      {label && (
        <label className="form-label fw-600 text-muted small">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div
        className="form-select d-flex align-items-center justify-content-between"
        style={{ cursor: 'pointer', borderRadius: '8px', minHeight: '38px', fontSize: '0.9rem' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder || 'Select option...'}</span>
      </div>

      {isOpen && (
        <div
          className="position-absolute bg-white border shadow rounded mt-1 p-2 w-100"
          style={{ zIndex: 1050, maxHeight: '250px', overflowY: 'auto' }}
        >
          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="list-group list-group-flush" style={{ fontSize: '0.85rem' }}>
            {filteredOptions.length === 0 ? (
              <div className="text-muted text-center py-2">No options found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`list-group-item list-group-item-action border-0 py-2 text-start rounded ${
                    opt.value === value ? 'active text-white' : ''
                  }`}
                  style={{ fontSize: '0.88rem' }}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
