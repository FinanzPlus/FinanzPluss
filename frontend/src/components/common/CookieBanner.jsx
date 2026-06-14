import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours actif
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Attendre 1 seconde avant d'afficher le bandeau
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Charger les préférences sauvegardées
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
    }
  }, []);

  const savePreferences = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    
    // Appliquer les préférences
    applyPreferences(prefs);
  };

  const applyPreferences = (prefs) => {
    // Désactiver les cookies analytiques si refusés
    if (!prefs.analytics) {
      // Supprimer les cookies Google Analytics si présents
      document.cookie.split(";").forEach((c) => {
        if (c.trim().startsWith('_ga') || c.trim().startsWith('_gid')) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        }
      });
    }
    
    // Désactiver les cookies marketing si refusés
    if (!prefs.marketing) {
      // Supprimer les cookies marketing si présents
      document.cookie.split(";").forEach((c) => {
        if (c.trim().startsWith('_fbp') || c.trim().startsWith('_gcl')) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        }
      });
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    };
    savePreferences(allAccepted);
  };

  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false
    };
    savePreferences(onlyEssential);
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  const handleToggle = (category) => {
    if (category === 'essential') return; // Ne peut pas être désactivé
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Fonction pour rouvrir les paramètres (appelée depuis le footer)
  useEffect(() => {
    window.openCookieSettings = () => {
      const savedPreferences = localStorage.getItem('cookieConsent');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      setShowBanner(true);
      setShowSettings(true);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <>
      <div className="cookie-banner-overlay" onClick={() => !showSettings && setShowBanner(false)} />
      <div className={`cookie-banner ${showSettings ? 'cookie-banner-expanded' : ''}`}>
        <div className="cookie-banner-content">
          {!showSettings ? (
            <>
              {/* Vue simple */}
              <div className="cookie-banner-header">
                <span className="cookie-icon">🍪</span>
                <h3>Wir verwenden Cookies</h3>
              </div>
              
              <p className="cookie-banner-text">
                Wir verwenden Cookies und ähnliche Technologien, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
                Einige Cookies sind für den Betrieb der Website unerlässlich, während andere uns helfen, die Website zu verbessern 
                und Ihnen personalisierte Inhalte anzubieten.
              </p>

              <div className="cookie-banner-actions">
                <button onClick={acceptAll} className="cookie-btn cookie-btn-accept">
                  Alle akzeptieren
                </button>
                <button onClick={rejectAll} className="cookie-btn cookie-btn-reject">
                  Alle ablehnen
                </button>
                <button onClick={() => setShowSettings(true)} className="cookie-btn cookie-btn-settings">
                  Einstellungen
                </button>
              </div>

              <div className="cookie-banner-footer">
                <Link to="/datenschutz" className="cookie-link">
                  Datenschutzerklärung
                </Link>
                <span className="cookie-separator">•</span>
                <Link to="/impressum" className="cookie-link">
                  Impressum
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Vue détaillée avec paramètres */}
              <div className="cookie-settings-header">
                <h3>Cookie-Einstellungen</h3>
                <button onClick={() => setShowSettings(false)} className="cookie-close">
                  ✕
                </button>
              </div>

              <p className="cookie-settings-intro">
                Wir respektieren Ihre Privatsphäre. Wählen Sie, welche Cookies Sie zulassen möchten:
              </p>

              <div className="cookie-categories">
                {/* Cookies essentiels */}
                <div className="cookie-category">
                  <div className="cookie-category-header">
                    <div className="cookie-category-info">
                      <h4>Notwendige Cookies</h4>
                      <span className="cookie-badge cookie-badge-required">Immer aktiv</span>
                    </div>
                    <label className="cookie-toggle">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                      />
                      <span className="cookie-toggle-slider"></span>
                    </label>
                  </div>
                  <p className="cookie-category-description">
                    Diese Cookies sind für den Betrieb der Website unerlässlich und können nicht deaktiviert werden. 
                    Sie speichern Ihre Cookie-Präferenzen und ermöglichen grundlegende Funktionen wie Seitennavigation.
                  </p>
                </div>

                {/* Cookies analytiques */}
                <div className="cookie-category">
                  <div className="cookie-category-header">
                    <div className="cookie-category-info">
                      <h4>Analytische Cookies</h4>
                      <span className="cookie-badge">Optional</span>
                    </div>
                    <label className="cookie-toggle">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handleToggle('analytics')}
                      />
                      <span className="cookie-toggle-slider"></span>
                    </label>
                  </div>
                  <p className="cookie-category-description">
                    Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                    indem sie Informationen anonym sammeln und melden. Dies hilft uns, die Website zu verbessern.
                  </p>
                </div>

                {/* Cookies marketing */}
                <div className="cookie-category">
                  <div className="cookie-category-header">
                    <div className="cookie-category-info">
                      <h4>Marketing-Cookies</h4>
                      <span className="cookie-badge">Optional</span>
                    </div>
                    <label className="cookie-toggle">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handleToggle('marketing')}
                      />
                      <span className="cookie-toggle-slider"></span>
                    </label>
                  </div>
                  <p className="cookie-category-description">
                    Diese Cookies werden verwendet, um Ihnen relevante Werbung anzuzeigen. 
                    Sie können auch verwendet werden, um die Anzahl der Anzeigen zu begrenzen und die Effektivität von Werbekampagnen zu messen.
                  </p>
                </div>
              </div>

              <div className="cookie-settings-actions">
                <button onClick={saveCustom} className="cookie-btn cookie-btn-save">
                  Auswahl speichern
                </button>
                <button onClick={acceptAll} className="cookie-btn cookie-btn-accept-all">
                  Alle akzeptieren
                </button>
              </div>

              <div className="cookie-settings-footer">
                <p>
                  Weitere Informationen finden Sie in unserer{' '}
                  <Link to="/datenschutz" className="cookie-link">Datenschutzerklärung</Link>
                  {' '}und in unseren{' '}
                  <Link to="/cookies" className="cookie-link">Cookie-Richtlinien</Link>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CookieBanner;

// Made with Bob
