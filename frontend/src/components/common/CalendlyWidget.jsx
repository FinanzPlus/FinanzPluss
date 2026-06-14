/**
 * Calendly Widget Component
 * Composant pour intégrer Calendly pour la prise de rendez-vous
 */

import React, { useState, useEffect } from 'react';
import './CalendlyWidget.css';

const CalendlyWidget = ({ 
  calendlyUrl = "https://calendly.com/finanzplus-austria",
  prefillData = {},
  showInline = true,
  height = "700px"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Charger le script Calendly
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setIsLoading(false);
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Construire l'URL avec les données pré-remplies
  const buildCalendlyUrl = () => {
    let url = calendlyUrl;
    const params = new URLSearchParams();

    if (prefillData.name) params.append('name', prefillData.name);
    if (prefillData.email) params.append('email', prefillData.email);
    if (prefillData.phone) params.append('a1', prefillData.phone);
    if (prefillData.loanAmount) params.append('a2', prefillData.loanAmount);
    if (prefillData.loanPurpose) params.append('a3', prefillData.loanPurpose);

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  const openCalendlyPopup = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: buildCalendlyUrl() });
    }
    return false;
  };

  const appointmentTypes = [
    {
      icon: '💼',
      title: 'Erstberatung',
      duration: '30 Min.',
      description: 'Kostenlose Erstberatung zu Ihren Finanzierungsmöglichkeiten',
      type: 'consultation'
    },
    {
      icon: '📊',
      title: 'Detailberatung',
      duration: '60 Min.',
      description: 'Ausführliche Analyse Ihrer finanziellen Situation',
      type: 'detailed'
    },
    {
      icon: '📝',
      title: 'Vertragsabschluss',
      duration: '45 Min.',
      description: 'Finalisierung und Unterzeichnung der Kreditverträge',
      type: 'signing'
    },
    {
      icon: '🤝',
      title: 'Follow-up Termin',
      duration: '20 Min.',
      description: 'Nachbesprechung und Klärung offener Fragen',
      type: 'followup'
    }
  ];

  return (
    <div className="calendly-widget-container">
      <div className="calendly-header">
        <h2>📅 Termin vereinbaren</h2>
        <p>Buchen Sie jetzt Ihren persönlichen Beratungstermin</p>
      </div>

      {/* Types de rendez-vous */}
      <div className="appointment-types">
        <h3>Wählen Sie Ihren Termin-Typ:</h3>
        <div className="types-grid">
          {appointmentTypes.map((type, index) => (
            <div key={index} className="type-card">
              <div className="type-icon">{type.icon}</div>
              <h4>{type.title}</h4>
              <div className="type-duration">{type.duration}</div>
              <p>{type.description}</p>
              <button 
                className="book-button"
                onClick={() => setShowModal(true)}
              >
                Jetzt buchen
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Avantages */}
      <div className="calendly-benefits">
        <h3>Vorteile unserer Beratung:</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">✅</span>
            <span>Kostenlose Erstberatung</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🏆</span>
            <span>Erfahrene Finanzexperten</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🔒</span>
            <span>100% vertraulich</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">💻</span>
            <span>Online oder vor Ort</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⚡</span>
            <span>Schnelle Terminvergabe</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📱</span>
            <span>Erinnerung per SMS/Email</span>
          </div>
        </div>
      </div>

      {/* Widget inline ou bouton */}
      {showInline ? (
        <div className="calendly-inline-widget">
          {isLoading && (
            <div className="calendly-loading">
              <div className="loading-spinner"></div>
              <p>Kalender wird geladen...</p>
            </div>
          )}
          <div 
            className="calendly-inline-widget-embed"
            data-url={buildCalendlyUrl()}
            style={{ minWidth: '320px', height: height }}
          ></div>
        </div>
      ) : (
        <div className="calendly-button-wrapper">
          <button 
            className="calendly-popup-button"
            onClick={openCalendlyPopup}
          >
            <span className="icon">📅</span>
            Termin jetzt buchen
          </button>
        </div>
      )}

      {/* Modal pour sélection de type */}
      {showModal && (
        <div className="calendly-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <h3>Termin buchen</h3>
            <p>Wählen Sie einen verfügbaren Termin aus unserem Kalender:</p>
            <div 
              className="calendly-inline-widget-embed"
              data-url={buildCalendlyUrl()}
              style={{ minWidth: '320px', height: '600px' }}
            ></div>
          </div>
        </div>
      )}

      {/* Informations supplémentaires */}
      <div className="calendly-info">
        <div className="info-box">
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <h4>Wichtige Hinweise:</h4>
            <ul>
              <li>Termine können bis zu 24 Stunden vorher kostenlos storniert werden</li>
              <li>Sie erhalten eine Bestätigung per E-Mail und SMS</li>
              <li>Für Online-Termine erhalten Sie einen Video-Call Link</li>
              <li>Bitte halten Sie relevante Dokumente bereit</li>
            </ul>
          </div>
        </div>

        <div className="contact-alternative">
          <h4>Lieber telefonisch?</h4>
          <p>Rufen Sie uns an unter:</p>
          <a href="tel:+49 155 652367949" className="phone-link">
            📞 +49 155 65236794
          </a>
          <p className="contact-hours">Mo-Fr: 09:00 - 18:00 Uhr</p>
        </div>
      </div>

      {/* FAQ rapide */}
      <div className="calendly-faq">
        <h3>Häufig gestellte Fragen:</h3>
        <div className="faq-items">
          <details className="faq-item">
            <summary>Wie lange dauert ein Beratungsgespräch?</summary>
            <p>Eine Erstberatung dauert ca. 30 Minuten. Für eine detaillierte Analyse planen Sie bitte 60 Minuten ein.</p>
          </details>
          <details className="faq-item">
            <summary>Kann ich den Termin verschieben?</summary>
            <p>Ja, Sie können Ihren Termin bis zu 24 Stunden vorher kostenlos verschieben oder stornieren.</p>
          </details>
          <details className="faq-item">
            <summary>Welche Dokumente soll ich mitbringen?</summary>
            <p>Bitte bringen Sie Ihren Ausweis, Einkommensnachweise und Kontoauszüge mit.</p>
          </details>
          <details className="faq-item">
            <summary>Ist die Beratung wirklich kostenlos?</summary>
            <p>Ja, die Erstberatung ist für Sie völlig kostenlos und unverbindlich.</p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default CalendlyWidget;

// Made with Bob
