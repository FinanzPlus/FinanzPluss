import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const Cookies = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  const handleToggle = (category) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    setCookieSettings(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSaveSettings = () => {
    // Save cookie preferences to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify(cookieSettings));
    alert('Ihre Cookie-Einstellungen wurden gespeichert.');
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setCookieSettings(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    alert('Alle Cookies wurden akzeptiert.');
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setCookieSettings(onlyNecessary);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    alert('Nur notwendige Cookies wurden akzeptiert.');
  };

  return (
    <div className="legal-page">
      {/* Hero Section */}
      <section className="legal-hero">
        <div className="container">
          <div className="legal-hero-content">
            <h1 className="legal-title">Cookie-Richtlinie</h1>
            <p className="legal-subtitle">
              Erfahren Sie, wie wir Cookies verwenden und wie Sie Ihre Einstellungen verwalten können
            </p>
            <div className="legal-meta">
              <span className="legal-meta-item">
                📅 Letzte Aktualisierung: 12. Juni 2026
              </span>
              <span className="legal-meta-item">
                ⏱️ Lesezeit: 6 Minuten
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content">
        <div className="container">
          <div className="legal-grid">
            {/* Sidebar Navigation */}
            <aside className="legal-sidebar">
              <div className="legal-nav">
                <h3 className="legal-nav-title">Inhaltsverzeichnis</h3>
                <ul className="legal-nav-list">
                  <li><a href="#was-sind-cookies">1. Was sind Cookies?</a></li>
                  <li><a href="#warum-cookies">2. Warum verwenden wir Cookies?</a></li>
                  <li><a href="#cookie-arten">3. Arten von Cookies</a></li>
                  <li><a href="#cookie-liste">4. Cookie-Liste</a></li>
                  <li><a href="#verwaltung">5. Cookie-Verwaltung</a></li>
                  <li><a href="#drittanbieter">6. Drittanbieter-Cookies</a></li>
                  <li><a href="#ihre-rechte">7. Ihre Rechte</a></li>
                  <li><a href="#aenderungen">8. Änderungen</a></li>
                </ul>
              </div>

              {/* Cookie Settings Widget */}
              <div className="cookie-settings-widget">
                <h4>🍪 Cookie-Einstellungen</h4>
                <p className="cookie-widget-text">Verwalten Sie Ihre Cookie-Präferenzen</p>
                
                <div className="cookie-toggle-list">
                  <div className="cookie-toggle-item">
                    <div className="cookie-toggle-info">
                      <strong>Notwendig</strong>
                      <span className="cookie-toggle-required">Immer aktiv</span>
                    </div>
                    <div className={`cookie-toggle ${cookieSettings.necessary ? 'active' : ''}`}>
                      <div className="cookie-toggle-slider"></div>
                    </div>
                  </div>

                  <div className="cookie-toggle-item">
                    <div className="cookie-toggle-info">
                      <strong>Funktional</strong>
                    </div>
                    <div 
                      className={`cookie-toggle ${cookieSettings.functional ? 'active' : ''}`}
                      onClick={() => handleToggle('functional')}
                    >
                      <div className="cookie-toggle-slider"></div>
                    </div>
                  </div>

                  <div className="cookie-toggle-item">
                    <div className="cookie-toggle-info">
                      <strong>Analyse</strong>
                    </div>
                    <div 
                      className={`cookie-toggle ${cookieSettings.analytics ? 'active' : ''}`}
                      onClick={() => handleToggle('analytics')}
                    >
                      <div className="cookie-toggle-slider"></div>
                    </div>
                  </div>

                  <div className="cookie-toggle-item">
                    <div className="cookie-toggle-info">
                      <strong>Marketing</strong>
                    </div>
                    <div 
                      className={`cookie-toggle ${cookieSettings.marketing ? 'active' : ''}`}
                      onClick={() => handleToggle('marketing')}
                    >
                      <div className="cookie-toggle-slider"></div>
                    </div>
                  </div>
                </div>

                <div className="cookie-widget-buttons">
                  <button onClick={handleSaveSettings} className="btn btn-primary btn-sm">
                    Speichern
                  </button>
                  <button onClick={handleAcceptAll} className="btn btn-secondary btn-sm">
                    Alle akzeptieren
                  </button>
                  <button onClick={handleRejectAll} className="btn btn-outline btn-sm">
                    Alle ablehnen
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="legal-main">
              {/* Section 1 */}
              <div id="was-sind-cookies" className="legal-section">
                <h2 className="legal-section-title">1. Was sind Cookies?</h2>
                <div className="legal-text">
                  <p>
                    Cookies sind kleine Textdateien, die auf Ihrem Gerät (Computer, Smartphone, Tablet) 
                    gespeichert werden, wenn Sie eine Website besuchen. Sie ermöglichen es der Website, 
                    Ihr Gerät zu erkennen und bestimmte Informationen über Ihre Präferenzen zu speichern.
                  </p>

                  <h3>1.1 Arten von Cookies nach Lebensdauer</h3>
                  <ul>
                    <li>
                      <strong>Session-Cookies:</strong> Temporäre Cookies, die nach dem Schließen 
                      des Browsers automatisch gelöscht werden
                    </li>
                    <li>
                      <strong>Persistente Cookies:</strong> Cookies, die für einen bestimmten Zeitraum 
                      auf Ihrem Gerät gespeichert bleiben
                    </li>
                  </ul>

                  <h3>1.2 Arten von Cookies nach Herkunft</h3>
                  <ul>
                    <li>
                      <strong>First-Party-Cookies:</strong> Von unserer Website direkt gesetzte Cookies
                    </li>
                    <li>
                      <strong>Third-Party-Cookies:</strong> Von Drittanbietern gesetzte Cookies 
                      (z.B. Google Analytics)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div id="warum-cookies" className="legal-section">
                <h2 className="legal-section-title">2. Warum verwenden wir Cookies?</h2>
                <div className="legal-text">
                  <p>Wir verwenden Cookies aus verschiedenen Gründen:</p>

                  <div className="legal-purpose-grid">
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">🔐</div>
                      <h4>Sicherheit</h4>
                      <p>Schutz vor Betrug und unbefugtem Zugriff auf Ihr Konto</p>
                    </div>
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">⚙️</div>
                      <h4>Funktionalität</h4>
                      <p>Speicherung Ihrer Präferenzen und Einstellungen</p>
                    </div>
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">📊</div>
                      <h4>Analyse</h4>
                      <p>Verständnis, wie Besucher unsere Website nutzen</p>
                    </div>
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">🎯</div>
                      <h4>Personalisierung</h4>
                      <p>Anpassung von Inhalten an Ihre Interessen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div id="cookie-arten" className="legal-section">
                <h2 className="legal-section-title">3. Arten von Cookies, die wir verwenden</h2>
                <div className="legal-text">
                  
                  {/* Necessary Cookies */}
                  <div className="cookie-category-card">
                    <div className="cookie-category-header">
                      <h3>🔴 Notwendige Cookies</h3>
                      <span className="cookie-category-badge required">Immer aktiv</span>
                    </div>
                    <p>
                      Diese Cookies sind für die grundlegende Funktionalität der Website unerlässlich. 
                      Ohne diese Cookies kann die Website nicht ordnungsgemäß funktionieren.
                    </p>
                    <h4>Verwendungszwecke:</h4>
                    <ul>
                      <li>Authentifizierung und Sitzungsverwaltung</li>
                      <li>Sicherheitsfunktionen</li>
                      <li>Warenkorb-Funktionalität</li>
                      <li>Formular-Eingaben speichern</li>
                      <li>Cookie-Consent-Einstellungen</li>
                    </ul>
                    <p className="cookie-legal-basis">
                      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                    </p>
                  </div>

                  {/* Functional Cookies */}
                  <div className="cookie-category-card">
                    <div className="cookie-category-header">
                      <h3>🟡 Funktionale Cookies</h3>
                      <span className="cookie-category-badge optional">Optional</span>
                    </div>
                    <p>
                      Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung, wie z.B. 
                      Spracheinstellungen und bevorzugte Ansichten.
                    </p>
                    <h4>Verwendungszwecke:</h4>
                    <ul>
                      <li>Speicherung von Sprachpräferenzen</li>
                      <li>Merken von Benutzereinstellungen</li>
                      <li>Personalisierte Inhalte</li>
                      <li>Chat-Funktionen</li>
                      <li>Video-Player-Einstellungen</li>
                    </ul>
                    <p className="cookie-legal-basis">
                      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="cookie-category-card">
                    <div className="cookie-category-header">
                      <h3>🔵 Analyse-Cookies</h3>
                      <span className="cookie-category-badge optional">Optional</span>
                    </div>
                    <p>
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                      indem sie Informationen anonym sammeln und melden.
                    </p>
                    <h4>Verwendungszwecke:</h4>
                    <ul>
                      <li>Besucherzahlen und Traffic-Quellen</li>
                      <li>Beliebte Seiten und Inhalte</li>
                      <li>Verweildauer und Absprungraten</li>
                      <li>Geräte- und Browser-Informationen</li>
                      <li>Fehlerberichte und Performance-Daten</li>
                    </ul>
                    <p className="cookie-legal-basis">
                      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                    </p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="cookie-category-card">
                    <div className="cookie-category-header">
                      <h3>🟢 Marketing-Cookies</h3>
                      <span className="cookie-category-badge optional">Optional</span>
                    </div>
                    <p>
                      Diese Cookies werden verwendet, um Werbung relevanter für Sie und Ihre Interessen 
                      zu gestalten. Sie werden auch verwendet, um die Häufigkeit der Anzeige einer 
                      Werbung zu begrenzen.
                    </p>
                    <h4>Verwendungszwecke:</h4>
                    <ul>
                      <li>Personalisierte Werbung</li>
                      <li>Retargeting-Kampagnen</li>
                      <li>Social-Media-Integration</li>
                      <li>Conversion-Tracking</li>
                      <li>A/B-Testing von Anzeigen</li>
                    </ul>
                    <p className="cookie-legal-basis">
                      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div id="cookie-liste" className="legal-section">
                <h2 className="legal-section-title">4. Detaillierte Cookie-Liste</h2>
                <div className="legal-text">
                  <p>Hier finden Sie eine vollständige Liste aller Cookies, die wir verwenden:</p>

                  <div className="cookie-table-wrapper">
                    <table className="cookie-table">
                      <thead>
                        <tr>
                          <th>Cookie-Name</th>
                          <th>Anbieter</th>
                          <th>Zweck</th>
                          <th>Typ</th>
                          <th>Laufzeit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Necessary Cookies */}
                        <tr>
                          <td><code>session_id</code></td>
                          <td>FinanzPlus</td>
                          <td>Sitzungsverwaltung</td>
                          <td>Notwendig</td>
                          <td>Session</td>
                        </tr>
                        <tr>
                          <td><code>auth_token</code></td>
                          <td>FinanzPlus</td>
                          <td>Authentifizierung</td>
                          <td>Notwendig</td>
                          <td>7 Tage</td>
                        </tr>
                        <tr>
                          <td><code>cookie_consent</code></td>
                          <td>FinanzPlus</td>
                          <td>Cookie-Einstellungen</td>
                          <td>Notwendig</td>
                          <td>1 Jahr</td>
                        </tr>
                        <tr>
                          <td><code>csrf_token</code></td>
                          <td>FinanzPlus</td>
                          <td>Sicherheit (CSRF-Schutz)</td>
                          <td>Notwendig</td>
                          <td>Session</td>
                        </tr>

                        {/* Functional Cookies */}
                        <tr>
                          <td><code>language</code></td>
                          <td>FinanzPlus</td>
                          <td>Sprachpräferenz</td>
                          <td>Funktional</td>
                          <td>1 Jahr</td>
                        </tr>
                        <tr>
                          <td><code>theme</code></td>
                          <td>FinanzPlus</td>
                          <td>Design-Präferenz</td>
                          <td>Funktional</td>
                          <td>1 Jahr</td>
                        </tr>

                        {/* Analytics Cookies */}
                        <tr>
                          <td><code>_ga</code></td>
                          <td>Google Analytics</td>
                          <td>Besucher-Identifikation</td>
                          <td>Analyse</td>
                          <td>2 Jahre</td>
                        </tr>
                        <tr>
                          <td><code>_gid</code></td>
                          <td>Google Analytics</td>
                          <td>Besucher-Identifikation</td>
                          <td>Analyse</td>
                          <td>24 Stunden</td>
                        </tr>
                        <tr>
                          <td><code>_gat</code></td>
                          <td>Google Analytics</td>
                          <td>Anfrage-Drosselung</td>
                          <td>Analyse</td>
                          <td>1 Minute</td>
                        </tr>

                        {/* Marketing Cookies */}
                        <tr>
                          <td><code>_fbp</code></td>
                          <td>Facebook</td>
                          <td>Conversion-Tracking</td>
                          <td>Marketing</td>
                          <td>3 Monate</td>
                        </tr>
                        <tr>
                          <td><code>IDE</code></td>
                          <td>Google DoubleClick</td>
                          <td>Personalisierte Werbung</td>
                          <td>Marketing</td>
                          <td>1 Jahr</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div id="verwaltung" className="legal-section">
                <h2 className="legal-section-title">5. Cookie-Verwaltung</h2>
                <div className="legal-text">
                  <h3>5.1 Über unsere Website</h3>
                  <p>
                    Sie können Ihre Cookie-Einstellungen jederzeit über das Widget in der Seitenleiste 
                    oder über unser Cookie-Banner anpassen.
                  </p>

                  <h3>5.2 Über Ihren Browser</h3>
                  <p>
                    Die meisten Browser ermöglichen es Ihnen, Cookies zu verwalten. Hier finden Sie 
                    Anleitungen für die gängigsten Browser:
                  </p>

                  <div className="browser-links-grid">
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="browser-link">
                      <span className="browser-icon">🌐</span>
                      <strong>Google Chrome</strong>
                      <span className="browser-arrow">→</span>
                    </a>
                    <a href="https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen" target="_blank" rel="noopener noreferrer" className="browser-link">
                      <span className="browser-icon">🦊</span>
                      <strong>Mozilla Firefox</strong>
                      <span className="browser-arrow">→</span>
                    </a>
                    <a href="https://support.apple.com/de-de/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="browser-link">
                      <span className="browser-icon">🧭</span>
                      <strong>Safari</strong>
                      <span className="browser-arrow">→</span>
                    </a>
                    <a href="https://support.microsoft.com/de-de/microsoft-edge/cookies-in-microsoft-edge-l%C3%B6schen-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="browser-link">
                      <span className="browser-icon">🌊</span>
                      <strong>Microsoft Edge</strong>
                      <span className="browser-arrow">→</span>
                    </a>
                  </div>

                  <div className="legal-warning-box">
                    <strong>⚠️ Hinweis:</strong> Wenn Sie Cookies deaktivieren, können einige Funktionen 
                    unserer Website möglicherweise nicht mehr ordnungsgemäß funktionieren.
                  </div>

                  <h3>5.3 Do Not Track (DNT)</h3>
                  <p>
                    Wir respektieren das "Do Not Track"-Signal Ihres Browsers. Wenn Sie DNT aktiviert 
                    haben, werden keine Analyse- oder Marketing-Cookies gesetzt.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="drittanbieter" className="legal-section">
                <h2 className="legal-section-title">6. Drittanbieter-Cookies</h2>
                <div className="legal-text">
                  <p>Wir arbeiten mit folgenden Drittanbietern zusammen, die Cookies setzen können:</p>

                  <div className="third-party-grid">
                    <div className="third-party-card">
                      <h4>Google Analytics</h4>
                      <p><strong>Zweck:</strong> Website-Analyse</p>
                      <p><strong>Datenschutz:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="legal-link">Google Privacy Policy</a></p>
                      <p><strong>Opt-out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="legal-link">Browser Add-on</a></p>
                    </div>

                    <div className="third-party-card">
                      <h4>Google Tag Manager</h4>
                      <p><strong>Zweck:</strong> Tag-Verwaltung</p>
                      <p><strong>Datenschutz:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="legal-link">Google Privacy Policy</a></p>
                    </div>

                    <div className="third-party-card">
                      <h4>Facebook Pixel</h4>
                      <p><strong>Zweck:</strong> Conversion-Tracking</p>
                      <p><strong>Datenschutz:</strong> <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="legal-link">Facebook Privacy Policy</a></p>
                      <p><strong>Opt-out:</strong> <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer" className="legal-link">Ad Settings</a></p>
                    </div>

                    <div className="third-party-card">
                      <h4>LinkedIn Insight Tag</h4>
                      <p><strong>Zweck:</strong> B2B-Marketing</p>
                      <p><strong>Datenschutz:</strong> <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="legal-link">LinkedIn Privacy Policy</a></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div id="ihre-rechte" className="legal-section">
                <h2 className="legal-section-title">7. Ihre Rechte</h2>
                <div className="legal-text">
                  <p>In Bezug auf Cookies haben Sie folgende Rechte:</p>

                  <div className="legal-rights-grid">
                    <div className="legal-right-card">
                      <h4>✅ Einwilligung</h4>
                      <p>Sie können Ihre Einwilligung zur Verwendung von Cookies jederzeit erteilen</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>🚫 Widerruf</h4>
                      <p>Sie können Ihre Einwilligung jederzeit widerrufen</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>🗑️ Löschung</h4>
                      <p>Sie können Cookies jederzeit in Ihrem Browser löschen</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>📋 Auskunft</h4>
                      <p>Sie können Auskunft über gespeicherte Cookies verlangen</p>
                    </div>
                  </div>

                  <p>
                    Weitere Informationen zu Ihren Datenschutzrechten finden Sie in unserer{' '}
                    <Link to="/datenschutz" className="legal-link">Datenschutzerklärung</Link>.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div id="aenderungen" className="legal-section">
                <h2 className="legal-section-title">8. Änderungen dieser Cookie-Richtlinie</h2>
                <div className="legal-text">
                  <p>
                    Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren, um Änderungen 
                    in unseren Praktiken oder aus anderen betrieblichen, rechtlichen oder regulatorischen 
                    Gründen widerzuspiegeln.
                  </p>
                  <p>
                    Wir empfehlen Ihnen, diese Seite regelmäßig zu besuchen, um über unsere Verwendung 
                    von Cookies informiert zu bleiben.
                  </p>
                  <p>
                    <strong>Stand dieser Cookie-Richtlinie:</strong> 12. Juni 2026
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="legal-cta">
                <h3>Haben Sie Fragen zu Cookies?</h3>
                <p>Unser Datenschutzteam hilft Ihnen gerne weiter.</p>
                <div className="legal-cta-buttons">
                  <a href="mailto:datenschutz@finanzplus.at" className="btn btn-primary">
                    📧 Datenschutz kontaktieren
                  </a>
                  <Link to="/datenschutz" className="btn btn-secondary">
                    📄 Datenschutzerklärung
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cookies;

// Made with Bob
