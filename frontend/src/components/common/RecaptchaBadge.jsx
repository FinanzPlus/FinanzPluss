/**
 * RECAPTCHA BADGE COMPONENT
 * Affiche le badge reCAPTCHA v3 et gère l'état de chargement
 * FinanzPlus Austria
 */

import React from 'react';
import './RecaptchaBadge.css';

/**
 * Composant pour afficher le badge reCAPTCHA
 * @param {boolean} isReady - Indique si reCAPTCHA est prêt
 * @param {string} error - Message d'erreur éventuel
 */
const RecaptchaBadge = ({ isReady = false, error = null }) => {
  if (error) {
    return (
      <div className="recaptcha-badge error">
        <span className="recaptcha-icon">⚠️</span>
        <span className="recaptcha-text">{error}</span>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="recaptcha-badge loading">
        <span className="recaptcha-spinner"></span>
        <span className="recaptcha-text">reCAPTCHA wird geladen...</span>
      </div>
    );
  }

  return (
    <div className="recaptcha-badge ready">
      <span className="recaptcha-icon">🛡️</span>
      <span className="recaptcha-text">
        Geschützt durch reCAPTCHA
      </span>
      <a 
        href="https://policies.google.com/privacy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="recaptcha-link"
      >
        Datenschutz
      </a>
      <span className="recaptcha-separator">•</span>
      <a 
        href="https://policies.google.com/terms" 
        target="_blank" 
        rel="noopener noreferrer"
        className="recaptcha-link"
      >
        Nutzungsbedingungen
      </a>
    </div>
  );
};

export default RecaptchaBadge;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
