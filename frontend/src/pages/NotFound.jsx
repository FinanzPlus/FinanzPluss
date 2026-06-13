import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Seite nicht gefunden</h2>
          <p className="error-message">
            Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.
          </p>
          <div className="error-actions">
            <Link to={ROUTES.HOME} className="btn btn-primary">
              Zur Startseite
            </Link>
            <Link to={ROUTES.CONTACT} className="btn btn-outline">
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

// Made with Bob
