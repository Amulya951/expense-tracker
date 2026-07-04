import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function CustomSelect({ value, options, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      {label && <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>{label}</label>}
      
      <div 
        className={`custom-select-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <FaChevronDown className={`select-arrow ${isOpen ? 'open' : ''}`} />
      </div>

      <div className={`custom-select-list ${isOpen ? 'open' : ''}`}>
        {options.map((option) => (
          <div 
            key={option} 
            className={`custom-select-option ${value === option ? 'selected' : ''}`}
            onClick={() => {
              onChange(option);
              setIsOpen(false);
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}
