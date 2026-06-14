import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import useRecaptcha from '../hooks/useRecaptcha';
import RecaptchaBadge from '../components/common/RecaptchaBadge';
import './Contact.css';

const Contact = () => {
  const { user } = useAuth();
  const { executeRecaptcha, isReady, error: recaptchaError } = useRecaptcha('contact');
  
  const [openingHours, setOpeningHours] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    email: user ? user.email : '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadOpeningHours();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
      }));
    }
  }, [user]);

  const loadOpeningHours = async () => {
    try {
      const response = await api.get('/contact/opening-hours');
      setOpeningHours(response.data.hours);
      setIsOpen(response.data.is_currently_open);
    } catch (err) {
      console.error('Error loading opening hours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Générer le token reCAPTCHA
      const recaptchaToken = await executeRecaptcha();
      
      if (!recaptchaToken) {
        setError('reCAPTCHA-Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        setSubmitting(false);
        return;
      }

      // Envoyer le formulaire avec le token reCAPTCHA
      await api.post('/contact/messages', {
        ...formData,
        recaptchaToken
      });
      
      setSuccess(true);
      setFormData({
        name: user ? `${user.first_name} ${user.last_name}` : '',
        email: user ? user.email : '',
        phone: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err.response?.data?.message || 'Fehler beim Senden der Nachricht');
    } finally {
      setSubmitting(false);
    }
  };

  const getDayName = (day) => {
    const days = {
      monday: 'Montag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag'
    };
    return days[day] || day;
  };

  const formatTime = (time) => {
    return time ? time.slice(0, 5) : '';
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <div className="contact-header">
          <h1>Öffnungszeiten & Kontakt</h1>
          <p>Wir sind für Sie da! Kontaktieren Sie uns oder besuchen Sie uns vor Ort.</p>
        </div>

        <div className="contact-layout">
          {/* Contact Information */}
          <div className="contact-info-section">
            {/* Status Badge */}
            <div className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
              <span className="status-indicator"></span>
              <span className="status-text">
                {isOpen ? 'Jetzt geöffnet' : 'Geschlossen'}
              </span>
            </div>

            {/* Opening Hours */}
            <div className="info-card">
              <h2>🕐 Öffnungszeiten</h2>
              {loading ? (
                <p>Lädt...</p>
              ) : (
                <div className="opening-hours-list">
                  {openingHours.map(hours => (
                    <div key={hours.day_of_week} className="hours-row">
                      <span className="day-name">{getDayName(hours.day_of_week)}</span>
                      <span className="hours-time">
                        {hours.is_closed ? (
                          <span className="closed-text">Geschlossen</span>
                        ) : (
                          `${formatTime(hours.open_time)} - ${formatTime(hours.close_time)} Uhr`
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div className="info-card">
              <h2>📍 Kontaktinformationen</h2>
              <div className="contact-details">
                <div className="detail-item">
                  <strong>Adresse:</strong>
                  <p>Hauptstraße 123<br />1010 Wien, Österreich</p>
                </div>
                <div className="detail-item">
                  <strong>Telefon:</strong>
                  <p><a href="tel:+49 155 65236794">+49 155 65236794</a></p>
                </div>
                <div className="detail-item">
                  <strong>WhatsApp:</strong>
                  <p>
                    <a 
                      href="https://wa.me/447451267912" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="whatsapp-link"
                    >
                      +49 155 65236794
                    </a>
                  </p>
                </div>
                <div className="detail-item">
                  <strong>E-Mail:</strong>
                  <p><a href="mailto:Kontakt_finanzplusaustria@proton.me">Kontakt_finanzplusaustria@proton.me</a></p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="info-card response-time">
              <h2>⏱️ Antwortzeit</h2>
              <p>Wir antworten in der Regel innerhalb von <strong>24 Stunden</strong> auf Ihre Anfragen.</p>
              <p className="note">Anfragen am Wochenende werden am nächsten Werktag bearbeitet.</p>
            </div>

            {/* Map */}
            <div className="info-card map-card">
              <h2>🗺️ Standort</h2>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.4!2d16.3738!3d48.2082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDEyJzI5LjUiTiAxNsKwMjInMjUuNyJF!5e0!3m2!1sde!2sat!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FinanzPlus Austria Standort"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-card">
              <h2>Kontaktformular</h2>
              <p className="form-description">
                Haben Sie Fragen? Füllen Sie das Formular aus und wir melden uns bei Ihnen.
              </p>

              {success && (
                <div className="success-message">
                  ✓ Ihre Nachricht wurde erfolgreich gesendet! Wir werden uns in Kürze bei Ihnen melden.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    E-Mail <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Telefon (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Betreff <span className="required">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                    disabled={submitting}
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
                    <option value="Produktinformation">Produktinformation</option>
                    <option value="Finanzierung">Finanzierung</option>
                    <option value="Beschwerde">Beschwerde</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Nachricht <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="form-textarea"
                    placeholder="Ihre Nachricht..."
                    disabled={submitting}
                  />
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* Badge reCAPTCHA */}
                <RecaptchaBadge isReady={isReady} error={recaptchaError} />

                <button
                  type="submit"
                  className="btn btn-primary btn-submit"
                  disabled={submitting || !isReady}
                >
                  {submitting ? 'Wird gesendet...' : '📧 Nachricht senden'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

// Made with Bob
