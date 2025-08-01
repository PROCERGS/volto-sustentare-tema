import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

const options = [
  { value: 'all', label: 'EM QUALQUER DATA' },
  { value: 'custom', label: 'INTERVALO PERSONALIZADO' },
];

export default function CustomSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <button
        className="custom-select-trigger"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {options.find((opt) => opt.value === value)?.label}
        <span className="custom-select-arrow" />
      </button>
      {open && (
        <div className="custom-select-options">
          {options.map((opt, idx) => (
            <div
              key={opt.value}
              className={`custom-select-option${value === opt.value ? ' selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange(opt.value);
                  setOpen(false);
                }
              }}
              aria-selected={value === opt.value}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
