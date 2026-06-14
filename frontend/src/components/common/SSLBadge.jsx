import React from 'react';
import './SSLBadge.css';

const SSLBadge = () => {
  return (
    <div className="ssl-badge" title="Diese Website ist durch SSL/TLS verschlüsselt">
      <svg className="ssl-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z" fill="currentColor" opacity="0.2"/>
        <path d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="ssl-text">
        <span className="ssl-title">Sicher</span>
        <span className="ssl-subtitle">SSL</span>
      </div>
    </div>
  );
};

export default SSLBadge;

// Made with Bob
