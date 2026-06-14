/**
 * Appointments Page
 * Page dédiée à la prise de rendez-vous avec intégration complète
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CalendlyWidget from '../components/common/CalendlyWidget';
import GoogleMaps from '../components/common/GoogleMaps';
import whatsappService from '../services/whatsappService';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('online');

  // Données pré-remplies pour Calendly si l'utilisateur est connecté
  const prefillData = user ? {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone || ''
  } : {};

  const handleWhatsAppAppointment = () => {
    whatsappService.sendAppointmentRequest({
      date: 'Bitte vorschlagen',
      time: 'Bitte vorschlagen',
      type: 'Beratung'
    });
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+49 155 652367949';
  };

  return (
    <div className="appointments-page">
      {/* Hero Section */}
      <section className="appointments-hero">
        <div className="hero-content">
          <h1>📅 Termin vereinbaren</h1>
          <p className="hero-subtitle">
            Buchen Sie jetzt Ihre persönliche Finanzberatung – online oder vor Ort
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Jahre Erfahrung</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5.000+</span>
              <span className="stat-label">Zufriedene Kunden</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Erfolgsquote</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="container">
          <h2>Schnelle Kontaktaufnahme</h2>
          <div className="actions-grid">
            <button className="action-card" onClick={() => setActiveSection('online')}>
              <div className="action-icon">💻</div>
              <h3>Online Termin</h3>
              <p>Bequem von zu Hause aus</p>
            </button>
            <button className="action-card" onClick={() => setActiveSection('office')}>
              <div className="action-icon">🏢</div>
              <h3>Vor Ort Termin</h3>
              <p>In unserem Büro in Wien</p>
            </button>
            <button className="action-card" onClick={handleWhatsAppAppointment}>
              <div className="action-icon">💬</div>
              <h3>WhatsApp</h3>
              <p>Schnelle Terminanfrage</p>
            </button>
            <button className="action-card" onClick={handlePhoneCall}>
              <div className="action-icon">📞</div>
              <h3>Anrufen</h3>
              <p>Sofortige Beratung</p>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="appointments-content">
        <div className="container">
          {/* Section Tabs */}
          <div className="section-tabs">
            <button 
              className={`tab ${activeSection === 'online' ? 'active' : ''}`}
              onClick={() => setActiveSection('online')}
            >
              <span className="tab-icon">💻</span>
              Online Termin buchen
            </button>
            <button 
              className={`tab ${activeSection === 'office' ? 'active' : ''}`}
              onClick={() => setActiveSection('office')}
            >
              <span className="tab-icon">🏢</span>
              Büro besuchen
            </button>
            <button 
              className={`tab ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveSection('contact')}
            >
              <span className="tab-icon">📞</span>
              Kontakt
            </button>
          </div>

          {/* Online Appointment Section */}
          {activeSection === 'online' && (
            <div className="section-content">
              <div className="section-intro">
                <h2>Online Video-Beratung</h2>
                <p>
                  Nutzen Sie unsere bequeme Online-Beratung per Video-Call. 
                  Keine Anfahrt, keine Wartezeit – einfach von zu Hause aus.
                </p>
                <div className="intro-benefits">
                  <div className="benefit">✅ Flexible Terminwahl</div>
                  <div className="benefit">✅ Sichere Video-Verbindung</div>
                  <div className="benefit">✅ Bildschirmfreigabe möglich</div>
                  <div className="benefit">✅ Dokumente digital teilen</div>
                </div>
              </div>
              <CalendlyWidget 
                prefillData={prefillData}
                showInline={true}
                height="700px"
              />
            </div>
          )}

          {/* Office Visit Section */}
          {activeSection === 'office' && (
            <div className="section-content">
              <div className="section-intro">
                <h2>Besuchen Sie uns in Wien</h2>
                <p>
                  Kommen Sie persönlich vorbei und lassen Sie sich in unserem 
                  modernen Büro im Herzen von Wien beraten.
                </p>
              </div>

              <div className="office-info-grid">
                <div className="office-card">
                  <div className="card-icon">🏢</div>
                  <h3>Unser Büro</h3>
                  <p><strong>FinanzPlus Austria GmbH</strong></p>
                  <p>Hauptstraße 123</p>
                  <p>1010 Wien, Österreich</p>
                </div>

                <div className="office-card">
                  <div className="card-icon">🕐</div>
                  <h3>Öffnungszeiten</h3>
                  <p><strong>Montag - Freitag:</strong> 09:00 - 18:00</p>
                  <p><strong>Samstag:</strong> 10:00 - 14:00</p>
                  <p><strong>Sonntag:</strong> Geschlossen</p>
                </div>

                <div className="office-card">
                  <div className="card-icon">🅿️</div>
                  <h3>Parkmöglichkeiten</h3>
                  <p><strong>City Parking</strong></p>
                  <p>200m entfernt</p>
                  <p>Erste Stunde kostenlos für Kunden</p>
                </div>
              </div>

              <GoogleMaps 
                address="Hauptstraße 123, 1010 Wien, Österreich"
                lat={48.2082}
                lng={16.3738}
                zoom={15}
                height="500px"
                showDirections={true}
                showInfo={true}
              />

              <div className="office-cta">
                <h3>Termin vor Ort vereinbaren</h3>
                <p>Buchen Sie jetzt Ihren persönlichen Termin in unserem Büro:</p>
                <CalendlyWidget 
                  prefillData={prefillData}
                  showInline={false}
                />
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="section-content">
              <div className="section-intro">
                <h2>Kontaktieren Sie uns</h2>
                <p>
                  Wählen Sie Ihren bevorzugten Kommunikationskanal. 
                  Wir sind für Sie da!
                </p>
              </div>

              <div className="contact-methods">
                <div className="contact-card primary">
                  <div className="contact-icon">📞</div>
                  <h3>Telefon</h3>
                  <p>Rufen Sie uns direkt an für eine sofortige Beratung</p>
                  <a href="tel:+49 155 652367949" className="contact-button">
                    +49 155 65236794
                  </a>
                  <p className="contact-hours">Mo-Fr: 09:00 - 18:00 Uhr</p>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">💬</div>
                  <h3>WhatsApp</h3>
                  <p>Schnelle Antworten per WhatsApp Business</p>
                  <button 
                    className="contact-button"
                    onClick={handleWhatsAppAppointment}
                  >
                    WhatsApp öffnen
                  </button>
                  <p className="contact-hours">Antwort innerhalb von 1 Stunde</p>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">📧</div>
                  <h3>E-Mail</h3>
                  <p>Schreiben Sie uns Ihr Anliegen per E-Mail</p>
                  <a 
                    href="mailto:kontakt@finanzplus.at" 
                    className="contact-button"
                  >
                    kontakt@finanzplus.at
                  </a>
                  <p className="contact-hours">Antwort innerhalb von 24 Stunden</p>
                </div>
              </div>

              <div className="emergency-contact">
                <div className="emergency-icon">🚨</div>
                <h3>Dringende Anfrage?</h3>
                <p>
                  Bei dringenden Anliegen erreichen Sie uns auch außerhalb 
                  der Geschäftszeiten über unsere Notfall-Hotline:
                </p>
                <a href="tel:+49 155 65236794" className="emergency-button">
                  📞 Notfall-Hotline: +49 155 65236794
                </a>
                <p className="emergency-note">
                  Verfügbar: Mo-So, 08:00 - 22:00 Uhr
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Warum FinanzPlus Austria?</h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <div className="reason-icon">🏆</div>
              <h3>15+ Jahre Erfahrung</h3>
              <p>Langjährige Expertise im österreichischen Finanzmarkt</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🤝</div>
              <h3>15+ Partnerbanken</h3>
              <p>Zugang zu den besten Konditionen am Markt</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">⚡</div>
              <h3>Schnelle Bearbeitung</h3>
              <p>Antwort innerhalb von 24 Stunden garantiert</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">💯</div>
              <h3>100% Kostenlos</h3>
              <p>Keine versteckten Gebühren oder Kosten</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🔒</div>
              <h3>Sicher & Vertraulich</h3>
              <p>DSGVO-konform und höchste Datensicherheit</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">⭐</div>
              <h3>5.000+ Kunden</h3>
              <p>Tausende zufriedene Kunden vertrauen uns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Bereit für Ihre Finanzierung?</h2>
          <p>Vereinbaren Sie jetzt einen Termin und starten Sie Ihr Projekt!</p>
          <div className="cta-buttons">
            <button 
              className="cta-button primary"
              onClick={() => setActiveSection('online')}
            >
              Online Termin buchen
            </button>
            <button 
              className="cta-button secondary"
              onClick={handleWhatsAppAppointment}
            >
              WhatsApp Anfrage
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointments;

// Made with Bob
