import React from 'react';
import './FinancialDisclaimer.css';

const FinancialDisclaimer = ({ variant = 'default' }) => {
  return (
    <div className={`financial-disclaimer financial-disclaimer-${variant}`}>
      <div className="disclaimer-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor" opacity="0.2"/>
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
      </div>
      <div className="disclaimer-content">
        <h4 className="disclaimer-title">Wichtiger Hinweis</h4>
        <div className="disclaimer-text">
          <p>
            <strong>Unverbindliche Simulation:</strong> Der Kreditrechner dient ausschließlich zu Informationszwecken 
            und stellt keine verbindliche Kreditofferte dar. Die angezeigten Zinssätze und Konditionen sind Richtwerte 
            und können je nach individueller Bonität, Kreditbetrag und Laufzeit variieren.
          </p>
          <p>
            <strong>Kreditvergabe:</strong> Jeder Kreditantrag unterliegt einer individuellen Bonitätsprüfung durch 
            unsere Partnerbanken. Die endgültige Kreditentscheidung und die konkreten Konditionen werden von der 
            jeweiligen Bank nach Prüfung Ihrer Unterlagen festgelegt.
          </p>
          <p>
            <strong>Keine Garantie:</strong> Wir übernehmen keine Gewähr für die Richtigkeit, Vollständigkeit oder 
            Aktualität der bereitgestellten Informationen. Die Nutzung des Simulators erfolgt auf eigene Verantwortung.
          </p>
          <p className="disclaimer-warning">
            <strong>⚠️ Achtung:</strong> Ein Kredit ist eine finanzielle Verpflichtung und muss zurückgezahlt werden. 
            Prüfen Sie vor Abschluss sorgfältig Ihre finanzielle Situation und Rückzahlungsfähigkeit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialDisclaimer;

// Made with Bob
