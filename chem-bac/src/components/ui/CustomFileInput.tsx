import React, { useRef } from 'react';

interface CustomFileInputProps {
  onChange: (file: File) => void;
  accept?: string;
  className?: string;
  label?: string;
}

export function CustomFileInput({ onChange, accept, className, label = 'Alege fișierul' }: CustomFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
    // Reset value so the same file can be selected again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`custom-file-input ${className || ''}`} style={{ display: 'inline-block' }}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />
      <button type="button" className="btn btn-secondary" onClick={handleClick}>
        <span style={{ marginRight: 8 }}>📁</span>
        {label}
      </button>
    </div>
  );
}
