import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Section principale avec 4 colonnes */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Colonne 1: Logo + Description */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="footer-logo-icon">FP</div>
              <div className="footer-logo-text">
                <span className="footer-logo-name">FinanzPlus</span>
                <span className="footer-logo-tagline">Austria</span>
              </div>
            </div>
            <p className="footer-description">
              Ihre vertrauenswürdige Finanzplattform für Kredite und Finanzierungen in Österreich. 
              Wir vergleichen Angebote führender österreichischer Banken und finden die beste Lösung für Sie.
            </p>
            <div className="footer-certifications">
              <div className="cert-badge">
                <span className="cert-icon">🔒</span>
                <span className="cert-text">SSL Gesichert</span>
              </div>
              <div className="cert-badge">
                <span className="cert-icon">✓</span>
                <span className="cert-text">DSGVO Konform</span>
              </div>
            </div>
          </div>

          {/* Colonne 2: Liens rapides */}
          <div className="footer-column">
            <h3 className="footer-title">Schnellzugriff</h3>
            <ul className="footer-links">
              <li><Link to="/">Startseite</Link></li>
              <li><Link to="/kreditrechner">Kreditrechner</Link></li>
              <li><Link to="/kreditvergleich">Kreditvergleich</Link></li>
              <li><Link to="/kreditfahigkeit">Kreditfähigkeit</Link></li>
              <li><Link to="/partner">Unsere Partner</Link></li>
              <li><Link to="/uber-uns">Über uns</Link></li>
              <li><Link to="/bewertungen">Kundenbewertungen</Link></li>
              <li><Link to="/kontakt">Kontakt</Link></li>
            </ul>
          </div>

          {/* Colonne 3: Horaires & Disponibilité */}
          <div className="footer-column">
            <h3 className="footer-title">Öffnungszeiten</h3>
            <div className="footer-hours">
              <div className="hours-item">
                <span className="hours-day">Montag - Freitag</span>
                <span className="hours-time">09:00 - 18:00</span>
              </div>
              <div className="hours-item">
                <span className="hours-day">Samstag</span>
                <span className="hours-time">10:00 - 14:00</span>
              </div>
              <div className="hours-item">
                <span className="hours-day">Sonntag</span>
                <span className="hours-time">Geschlossen</span>
              </div>
            </div>
            <div className="footer-availability">
              <div className="availability-badge online">
                <span className="status-dot"></span>
                <span>Jetzt online verfügbar</span>
              </div>
            </div>
          </div>

          {/* Colonne 4: Contact */}
          <div className="footer-column">
            <h3 className="footer-title">Kontakt</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div className="contact-info">
                  <span className="contact-label">Adresse</span>
                  <span className="contact-value">
                    Stephansplatz 1<br />
                    1010 Wien, Österreich
                  </span>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-info">
                  <span className="contact-label">Telefon</span>
                  <a href="tel:+4312345678" className="contact-value">
                    +43 1 234 5678
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-info">
                  <span className="contact-label">E-Mail</span>
                  <a href="mailto:info@finanzplus.at" className="contact-value">
                    info@finanzplus.at
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <div className="contact-info">
                  <span className="contact-label">WhatsApp</span>
                  <a 
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value whatsapp-link"
                  >
                    Jetzt chatten
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section logos partenaires */}
      <div className="footer-partners">
        <div className="footer-container">
          <p className="partners-title">Offizieller Partner von:</p>
          <div className="partners-logos">
            <div className="partner-logo" title="Erste Bank">
              <span className="partner-placeholder">Erste Bank</span>
            </div>
            <div className="partner-logo" title="Raiffeisen Bank">
              <span className="partner-placeholder">Raiffeisen</span>
            </div>
            <div className="partner-logo" title="Bank Austria">
              <span className="partner-placeholder">Bank Austria</span>
            </div>
            <div className="partner-logo" title="BAWAG P.S.K.">
              <span className="partner-placeholder">BAWAG</span>
            </div>
            <div className="partner-logo" title="Volksbank">
              <span className="partner-placeholder">Volksbank</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section mentions légales */}
      <div className="footer-legal">
        <div className="footer-container">
          <div className="legal-links">
            <Link to="/impressum">Impressum</Link>
            <span className="legal-separator">|</span>
            <Link to="/datenschutz">Datenschutz</Link>
            <span className="legal-separator">|</span>
            <Link to="/agb">AGB</Link>
            <span className="legal-separator">|</span>
            <Link to="/cookies">Cookie-Richtlinie</Link>
          </div>
          <div className="footer-copyright">
            <p>
              © {currentYear} FinanzPlus Austria. Alle Rechte vorbehalten.
            </p>
            <p className="footer-disclaimer">
              FinanzPlus Austria ist ein unabhängiger Kreditvermittler und arbeitet mit führenden österreichischen Banken zusammen.
            </p>
          </div>
        </div>
      </div>

      {/* Ligne dorée en haut du footer */}
      <div className="footer-border"></div>
    </footer>
  );
};

export default Footer;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
