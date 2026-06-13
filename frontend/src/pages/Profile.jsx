import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TEXTS } from '@/utils/constants';
import './Auth.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMessage({
        type: 'success',
        text: 'Profil erfolgreich aktualisiert!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Fehler beim Aktualisieren des Profils'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Nicht angemeldet</h2>
          <p>Bitte melden Sie sich an, um Ihr Profil zu sehen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Mein Profil</h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">{TEXTS.FORM_NAME}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{TEXTS.FORM_EMAIL}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
            <small>L'email ne peut pas être modifié</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">{TEXTS.FORM_PHONE}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">{TEXTS.FORM_ADDRESS}</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Wird gespeichert...' : TEXTS.BTN_SAVE}
          </button>
        </form>

        <div className="profile-info">
          <h3>Kontoinformationen</h3>
          <p><strong>Rolle:</strong> {user.role === 'admin' ? 'Administrator' : 'Kunde'}</p>
          <p><strong>Mitglied seit:</strong> {new Date(user.created_at).toLocaleDateString('de-DE')}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// Made with Bob
