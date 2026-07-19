import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const Datenschutz = () => {
  return (
    <div className="legal-page">
      {/* Hero Section */}
      <section className="legal-hero">
        <div className="container">
          <div className="legal-hero-content">
            <h1 className="legal-title">Datenschutzerklärung</h1>
            <p className="legal-subtitle">
              Ihre Privatsphäre ist uns wichtig. Hier erfahren Sie, wie wir Ihre Daten schützen.
            </p>
            <div className="legal-meta">
              <span className="legal-meta-item">
                📅 Letzte Aktualisierung: 12. Juni 2026
              </span>
              <span className="legal-meta-item">
                ⏱️ Lesezeit: 8 Minuten
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
                  <li><a href="#verantwortlicher">1. Verantwortlicher</a></li>
                  <li><a href="#datenerfassung">2. Datenerfassung</a></li>
                  <li><a href="#verwendungszweck">3. Verwendungszweck</a></li>
                  <li><a href="#rechtsgrundlage">4. Rechtsgrundlage</a></li>
                  <li><a href="#cookies">5. Cookies</a></li>
                  <li><a href="#weitergabe">6. Datenweitergabe</a></li>
                  <li><a href="#speicherdauer">7. Speicherdauer</a></li>
                  <li><a href="#ihre-rechte">8. Ihre Rechte</a></li>
                  <li><a href="#sicherheit">9. Datensicherheit</a></li>
                  <li><a href="#aenderungen">10. Änderungen</a></li>
                </ul>
              </div>

              <div className="legal-contact-box">
                <h4>Datenschutzfragen?</h4>
                <p>Unser Datenschutzbeauftragter hilft Ihnen gerne weiter.</p>
                <a href="mailto:datenschutz@finanzplus.at" className="btn btn-secondary btn-sm">
                  📧 Kontakt aufnehmen
                </a>
              </div>
            </aside>

            {/* Main Content */}
            <div className="legal-main">
              {/* Section 1 */}
              <div id="verantwortlicher" className="legal-section">
                <h2 className="legal-section-title">1. Verantwortlicher für die Datenverarbeitung</h2>
                <div className="legal-text">
                  <p>
                    Verantwortlich für die Verarbeitung Ihrer personenbezogenen Daten im Sinne der 
                    Datenschutz-Grundverordnung (DSGVO) ist:
                  </p>
                  <div className="legal-info-box">
                    <strong>FinanzPlus Austria GmbH</strong><br />
                    Kärntner Ring 5-7<br />
                    1010 Wien, Österreich<br />
                    <br />
                    E-Mail: datenschutz@finanzplus.at<br />
                    Telefon: +4368110535900<br />
                    Datenschutzbeauftragter: Dr. Michael Schneider
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div id="datenerfassung" className="legal-section">
                <h2 className="legal-section-title">2. Welche Daten erfassen wir?</h2>
                <div className="legal-text">
                  <h3>2.1 Automatisch erfasste Daten</h3>
                  <p>Bei jedem Besuch unserer Website erfassen wir automatisch folgende Informationen:</p>
                  <ul>
                    <li>IP-Adresse (anonymisiert nach 7 Tagen)</li>
                    <li>Browsertyp und -version</li>
                    <li>Betriebssystem</li>
                    <li>Referrer URL (vorherige Seite)</li>
                    <li>Datum und Uhrzeit des Zugriffs</li>
                    <li>Übertragene Datenmenge</li>
                  </ul>

                  <h3>2.2 Von Ihnen bereitgestellte Daten</h3>
                  <p>Wenn Sie unsere Dienste nutzen, erfassen wir:</p>
                  <ul>
                    <li><strong>Kontaktformular:</strong> Name, E-Mail, Telefon, Nachricht</li>
                    <li><strong>Kreditanfrage:</strong> Persönliche Daten, Einkommensinformationen, Beschäftigungsstatus</li>
                    <li><strong>Benutzerkonto:</strong> Name, E-Mail, Passwort (verschlüsselt), Adresse</li>
                    <li><strong>Newsletter:</strong> E-Mail-Adresse, Name (optional)</li>
                  </ul>

                  <h3>2.3 Sensible Daten</h3>
                  <p>
                    Für Kreditanträge verarbeiten wir auch sensible Finanzdaten wie Einkommen, 
                    Ausgaben und Vermögenswerte. Diese werden mit höchsten Sicherheitsstandards geschützt.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div id="verwendungszweck" className="legal-section">
                <h2 className="legal-section-title">3. Wofür verwenden wir Ihre Daten?</h2>
                <div className="legal-text">
                  <p>Wir verwenden Ihre personenbezogenen Daten für folgende Zwecke:</p>
                  
                  <div className="legal-purpose-grid">
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">🔍</div>
                      <h4>Kreditvermittlung</h4>
                      <p>Bearbeitung und Weiterleitung Ihrer Kreditanfragen an unsere Berater</p>
                    </div>
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">📞</div>
                      <h4>Kommunikation</h4>
                      <p>Beantwortung Ihrer Anfragen und Bereitstellung von Kundenservice</p>
                    </div>
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">📊</div>
                      <h4>Verbesserung</h4>
                      <p>Analyse und Optimierung unserer Website und Dienstleistungen</p>
                    </div>
                    <div className="legal-purpose-card">
                      <div className="legal-purpose-icon">📧</div>
                      <h4>Marketing</h4>
                      <p>Versand von Newslettern und Angeboten (nur mit Ihrer Einwilligung)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div id="rechtsgrundlage" className="legal-section">
                <h2 className="legal-section-title">4. Rechtsgrundlage der Verarbeitung</h2>
                <div className="legal-text">
                  <p>Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von:</p>
                  <ul>
                    <li>
                      <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong> Newsletter, Marketing, 
                      optionale Cookies
                    </li>
                    <li>
                      <strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung):</strong> Bearbeitung von 
                      Kreditanfragen und Kundenkonto
                    </li>
                    <li>
                      <strong>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung):</strong> 
                      Aufbewahrungspflichten, Geldwäscheprävention
                    </li>
                    <li>
                      <strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):</strong> 
                      Website-Analyse, Sicherheit, Betrugsbekämpfung
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div id="cookies" className="legal-section">
                <h2 className="legal-section-title">5. Cookies und Tracking-Technologien</h2>
                <div className="legal-text">
                  <p>
                    Unsere Website verwendet Cookies, um Ihre Benutzererfahrung zu verbessern. 
                    Detaillierte Informationen finden Sie in unserer{' '}
                    <Link to="/cookies" className="legal-link">Cookie-Richtlinie</Link>.
                  </p>

                  <h3>5.1 Arten von Cookies</h3>
                  <ul>
                    <li><strong>Notwendige Cookies:</strong> Für grundlegende Funktionen (immer aktiv)</li>
                    <li><strong>Funktionale Cookies:</strong> Für erweiterte Funktionen (optional)</li>
                    <li><strong>Analyse-Cookies:</strong> Für Website-Statistiken (optional)</li>
                    <li><strong>Marketing-Cookies:</strong> Für personalisierte Werbung (optional)</li>
                  </ul>

                  <p>
                    Sie können Ihre Cookie-Einstellungen jederzeit in unserem Cookie-Banner anpassen.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="weitergabe" className="legal-section">
                <h2 className="legal-section-title">6. Weitergabe von Daten an Dritte</h2>
                <div className="legal-text">
                  <p>Wir geben Ihre Daten nur in folgenden Fällen an Dritte weiter:</p>
                  
                  <h3>6.1 Kreditvermittlung</h3>
                  <p>
                    Für die Bearbeitung Ihrer Kreditanfrage werden Ihre Daten vertraulich behandelt.
                    Unsere Berater unterliegen der DSGVO-Verpflichtung.
                  </p>

                  <h3>6.2 Dienstleister</h3>
                  <p>Wir arbeiten mit folgenden Dienstleistern zusammen:</p>
                  <ul>
                    <li><strong>Hosting:</strong> AWS (Amazon Web Services) - EU-Region Frankfurt</li>
                    <li><strong>E-Mail-Versand:</strong> SendGrid - DSGVO-konform</li>
                    <li><strong>Analyse:</strong> Google Analytics (anonymisiert)</li>
                    <li><strong>CRM:</strong> Salesforce - EU-Datenzentrum</li>
                  </ul>

                  <h3>6.3 Rechtliche Verpflichtungen</h3>
                  <p>
                    Wir können Ihre Daten offenlegen, wenn dies gesetzlich vorgeschrieben ist oder 
                    zur Durchsetzung unserer Rechte erforderlich ist.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="speicherdauer" className="legal-section">
                <h2 className="legal-section-title">7. Speicherdauer</h2>
                <div className="legal-text">
                  <p>Wir speichern Ihre Daten nur so lange wie nötig:</p>
                  <ul>
                    <li><strong>Kontaktanfragen:</strong> 3 Jahre nach letztem Kontakt</li>
                    <li><strong>Kreditanträge:</strong> 7 Jahre (gesetzliche Aufbewahrungspflicht)</li>
                    <li><strong>Benutzerkonto:</strong> Bis zur Löschung durch Sie</li>
                    <li><strong>Newsletter:</strong> Bis zur Abmeldung</li>
                    <li><strong>Server-Logs:</strong> 90 Tage</li>
                    <li><strong>Cookies:</strong> Siehe Cookie-Richtlinie</li>
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div id="ihre-rechte" className="legal-section">
                <h2 className="legal-section-title">8. Ihre Rechte</h2>
                <div className="legal-text">
                  <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>

                  <div className="legal-rights-grid">
                    <div className="legal-right-card">
                      <h4>📋 Auskunftsrecht</h4>
                      <p>Sie können Auskunft über Ihre gespeicherten Daten verlangen (Art. 15 DSGVO)</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>✏️ Berichtigungsrecht</h4>
                      <p>Sie können die Korrektur falscher Daten verlangen (Art. 16 DSGVO)</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>🗑️ Löschungsrecht</h4>
                      <p>Sie können die Löschung Ihrer Daten verlangen (Art. 17 DSGVO)</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>⏸️ Einschränkungsrecht</h4>
                      <p>Sie können die Einschränkung der Verarbeitung verlangen (Art. 18 DSGVO)</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>📤 Datenübertragbarkeit</h4>
                      <p>Sie können Ihre Daten in einem gängigen Format erhalten (Art. 20 DSGVO)</p>
                    </div>
                    <div className="legal-right-card">
                      <h4>🚫 Widerspruchsrecht</h4>
                      <p>Sie können der Verarbeitung widersprechen (Art. 21 DSGVO)</p>
                    </div>
                  </div>

                  <div className="legal-highlight-box">
                    <h4>So machen Sie Ihre Rechte geltend:</h4>
                    <p>
                      Senden Sie eine E-Mail an <strong>datenschutz@finanzplus.at</strong> oder 
                      nutzen Sie unser <Link to="/kontakt" className="legal-link">Kontaktformular</Link>. 
                      Wir werden Ihre Anfrage innerhalb von 30 Tagen bearbeiten.
                    </p>
                  </div>

                  <h3>8.1 Beschwerderecht</h3>
                  <p>
                    Sie haben das Recht, sich bei der österreichischen Datenschutzbehörde zu beschweren:
                  </p>
                  <div className="legal-info-box">
                    <strong>Österreichische Datenschutzbehörde</strong><br />
                    Barichgasse 40-42<br />
                    1030 Wien<br />
                    <br />
                    Telefon: +43 1 52 152-0<br />
                    E-Mail: dsb@dsb.gv.at<br />
                    Website: www.dsb.gv.at
                  </div>
                </div>
              </div>

              {/* Section 9 */}
              <div id="sicherheit" className="legal-section">
                <h2 className="legal-section-title">9. Datensicherheit</h2>
                <div className="legal-text">
                  <p>Wir schützen Ihre Daten mit modernsten Sicherheitsmaßnahmen:</p>
                  
                  <div className="legal-security-grid">
                    <div className="legal-security-item">
                      <span className="legal-security-icon">🔒</span>
                      <h4>SSL/TLS-Verschlüsselung</h4>
                      <p>Alle Datenübertragungen sind verschlüsselt</p>
                    </div>
                    <div className="legal-security-item">
                      <span className="legal-security-icon">🛡️</span>
                      <h4>Firewall-Schutz</h4>
                      <p>Mehrschichtige Firewall-Systeme</p>
                    </div>
                    <div className="legal-security-item">
                      <span className="legal-security-icon">🔐</span>
                      <h4>Passwort-Hashing</h4>
                      <p>Passwörter werden mit bcrypt verschlüsselt</p>
                    </div>
                    <div className="legal-security-item">
                      <span className="legal-security-icon">👁️</span>
                      <h4>Zugriffskontrollen</h4>
                      <p>Strenge Zugriffsbeschränkungen für Mitarbeiter</p>
                    </div>
                    <div className="legal-security-item">
                      <span className="legal-security-icon">📊</span>
                      <h4>Regelmäßige Audits</h4>
                      <p>Jährliche Sicherheitsüberprüfungen</p>
                    </div>
                    <div className="legal-security-item">
                      <span className="legal-security-icon">💾</span>
                      <h4>Backup-Systeme</h4>
                      <p>Tägliche verschlüsselte Backups</p>
                    </div>
                  </div>

                  <div className="legal-warning-box">
                    <strong>⚠️ Wichtiger Hinweis:</strong> Trotz aller Sicherheitsmaßnahmen kann keine 
                    Datenübertragung über das Internet zu 100% sicher sein. Wir empfehlen, sensible 
                    Informationen nur über sichere Kanäle zu übermitteln.
                  </div>
                </div>
              </div>

              {/* Section 10 */}
              <div id="aenderungen" className="legal-section">
                <h2 className="legal-section-title">10. Änderungen dieser Datenschutzerklärung</h2>
                <div className="legal-text">
                  <p>
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte 
                    Rechtslagen oder Änderungen unserer Dienstleistungen anzupassen.
                  </p>
                  <p>
                    Die aktuelle Version ist immer auf unserer Website verfügbar. Bei wesentlichen 
                    Änderungen werden wir Sie per E-Mail informieren.
                  </p>
                  <p>
                    <strong>Stand dieser Datenschutzerklärung:</strong> 12. Juni 2026
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="legal-cta">
                <h3>Haben Sie Fragen zum Datenschutz?</h3>
                <p>Unser Datenschutzteam steht Ihnen gerne zur Verfügung.</p>
                <div className="legal-cta-buttons">
                  <a href="mailto:datenschutz@finanzplus.at" className="btn btn-primary">
                    📧 Datenschutz kontaktieren
                  </a>
                  <Link to="/kontakt" className="btn btn-secondary">
                    💬 Allgemeine Anfrage
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

export default Datenschutz;

// Made with Bob
