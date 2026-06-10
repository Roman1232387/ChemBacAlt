import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ options, value, onChange, label, placeholder = 'Selectează...', className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${className}`} ref={containerRef}>
      {label && <label className="form-label">{label}</label>}
      <div 
        className={`custom-select-trigger ${isOpen ? 'is-open' : ''} ${!selectedOption ? 'is-placeholder' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg 
          className={`custom-select-arrow-svg ${isOpen ? 'up' : ''}`} 
          width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {isOpen && (
        <div className="custom-select-options shadow-xl">
          {options.length === 0 && (
            <div className="custom-select-empty">Nicio opțiune disponibilă</div>
          )}
          <div className="custom-select-scroll">
            {options.map((option) => (
              <div
                key={option.value}
                className={`custom-select-option ${option.value === value ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <div className="custom-select-option-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
