import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/utils/constants';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Erfolgreich angemeldet!' });
        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Anmeldung fehlgeschlagen' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Anmelden</h1>
              <p>Willkommen zurück bei FinanzPlus Austria</p>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">E-Mail-Adresse</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="ihre.email@beispiel.com"
                  autoComplete="email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Passwort</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-footer">
                <Link to="/passwort-vergessen" className="forgot-link">
                  Passwort vergessen?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Anmeldung läuft...' : 'Anmelden'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Noch kein Konto?{' '}
                <Link to={ROUTES.REGISTER} className="auth-link">
                  Jetzt registrieren
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <h2>Warum FinanzPlus Austria?</h2>
            <ul className="benefits-list">
              <li>✅ Garantiert niedrige Zinsen (3%)</li>
              <li>✅ Schnelle Abwicklung</li>
              <li>✅ Persönliche Beratung</li>
              <li>✅ 100% sicher und vertrauenswürdig</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// Made with Bob
