import React from 'react';
import './BankLogo.css';

/**
 * Composant BankLogo - Affiche le logo d'une banque autrichienne
 * Utilise des SVG ou des images selon disponibilité
 */
const BankLogo = ({ bankName, size = 'medium', variant = 'default' }) => {
  // Configuration des logos par banque
  const bankLogos = {
    'Erste Bank': {
      color: '#E2001A',
      initials: 'EB',
      fullName: 'Erste Bank',
      svg: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#E2001A" rx="8"/>
          <text x="50" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">EB</text>
        </svg>
      `
    },
    'Raiffeisen Bank': {
      color: '#FFED00',
      initials: 'RB',
      fullName: 'Raiffeisen',
      svg: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#FFED00" rx="8"/>
          <text x="50" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#000" text-anchor="middle">RB</text>
        </svg>
      `
    },
    'Bank Austria': {
      color: '#E2001A',
      initials: 'BA',
      fullName: 'Bank Austria',
      svg: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#E2001A" rx="8"/>
          <text x="50" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">BA</text>
        </svg>
      `
    },
    'BAWAG P.S.K.': {
      color: '#005CA9',
      initials: 'BP',
      fullName: 'BAWAG P.S.K.',
      svg: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#005CA9" rx="8"/>
          <text x="50" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">BP</text>
        </svg>
      `
    },
    'Volksbank': {
      color: '#009640',
      initials: 'VB',
      fullName: 'Volksbank',
      svg: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#009640" rx="8"/>
          <text x="50" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">VB</text>
        </svg>
      `
    }
  };

  const bank = bankLogos[bankName] || {
    color: '#0A1628',
    initials: '??',
    fullName: bankName,
    svg: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#0A1628" rx="8"/>
        <text x="50" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">??</text>
      </svg>
    `
  };

  const sizeClasses = {
    small: 'bank-logo-small',
    medium: 'bank-logo-medium',
    large: 'bank-logo-large',
    xlarge: 'bank-logo-xlarge'
  };

  const variantClasses = {
    default: 'bank-logo-default',
    circle: 'bank-logo-circle',
    square: 'bank-logo-square',
    minimal: 'bank-logo-minimal'
  };

  return (
    <div 
      className={`bank-logo ${sizeClasses[size]} ${variantClasses[variant]}`}
      title={bank.fullName}
      style={{ '--bank-color': bank.color }}
    >
      <div 
        className="bank-logo-svg"
        dangerouslySetInnerHTML={{ __html: bank.svg }}
      />
    </div>
  );
};

export default BankLogo;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
