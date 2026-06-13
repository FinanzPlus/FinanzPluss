import React, { useState, useEffect } from 'react';
import './CookieBanner.css';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setIsVisible(false);
  };

  const handlePreferenceChange = (key) => {
    if (key === 'necessary') return; // Necessary cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-header">
          <div className="cookie-icon">
            <i className="fas fa-cookie-bite"></i>
          </div>
          <h3>Cookie-Einstellungen</h3>
        </div>

        {!showSettings ? (
          <>
            <div className="cookie-content">
              <p>
                Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                Einige Cookies sind notwendig für den Betrieb der Website, während andere uns helfen, 
                die Website und Ihre Erfahrung zu verbessern.
              </p>
              <p>
                Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung aller Cookies zu. 
                Sie können Ihre Einstellungen jederzeit in den Cookie-Einstellungen ändern.
              </p>
            </div>

            <div className="cookie-actions">
              <button onClick={() => setShowSettings(true)} className="btn btn-outline">
                <i className="fas fa-cog"></i>
                Einstellungen
              </button>
              <button onClick={handleRejectAll} className="btn btn-secondary">
                Nur notwendige
              </button>
              <button onClick={handleAcceptAll} className="btn btn-primary">
                <i className="fas fa-check"></i>
                Alle akzeptieren
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cookie-settings">
              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>
                      <i className="fas fa-shield-alt"></i>
                      Notwendige Cookies
                    </h4>
                    <p>Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.</p>
                  </div>
                  <label className="toggle-switch disabled">
                    <input type="checkbox" checked disabled />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>
                      <i className="fas fa-sliders-h"></i>
                      Funktionale Cookies
                    </h4>
                    <p>Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.functional}
                      onChange={() => handlePreferenceChange('functional')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>
                      <i className="fas fa-chart-line"></i>
                      Analyse-Cookies
                    </h4>
                    <p>Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.analytics}
                      onChange={() => handlePreferenceChange('analytics')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>
                      <i className="fas fa-bullhorn"></i>
                      Marketing-Cookies
                    </h4>
                    <p>Diese Cookies werden verwendet, um Ihnen relevante Werbung anzuzeigen.</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="cookie-actions">
              <button onClick={() => setShowSettings(false)} className="btn btn-outline">
                <i className="fas fa-arrow-left"></i>
                Zurück
              </button>
              <button onClick={handleSavePreferences} className="btn btn-primary">
                <i className="fas fa-save"></i>
                Einstellungen speichern
              </button>
            </div>
          </>
        )}

        <div className="cookie-links">
          <a href="/privacy-policy">Datenschutzerklärung</a>
          <span>•</span>
          <a href="/legal-notice">Impressum</a>
          <span>•</span>
          <a href="/terms">AGB</a>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

// Made with Bob
