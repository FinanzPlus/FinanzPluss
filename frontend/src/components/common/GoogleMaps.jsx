/**
 * Google Maps Component
 * Composant pour afficher la localisation du bureau FinanzPlus Austria
 */

import React, { useState, useEffect } from 'react';
import './GoogleMaps.css';

const GoogleMaps = ({ 
  address = "Hauptstraße 123, 1010 Wien, Österreich",
  lat = 48.2082,
  lng = 16.3738,
  zoom = 15,
  height = "400px",
  showDirections = true,
  showInfo = true
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('map');

  // Coordonnées du bureau (exemple: centre de Vienne)
  const officeLocation = {
    lat: lat,
    lng: lng,
    address: address,
    name: "FinanzPlus Austria GmbH",
    phone: "+43 123 456 789",
    email: "kontakt@finanzplus.at"
  };

  // URL Google Maps embed
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(officeLocation.address)}&zoom=${zoom}`;

  // URL pour directions
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeLocation.address)}`;

  // URL pour ouvrir dans Google Maps
  const openInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${officeLocation.lat},${officeLocation.lng}`;

  useEffect(() => {
    // Simuler le chargement de la carte
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGetDirections = () => {
    window.open(directionsUrl, '_blank');
  };

  const handleOpenInMaps = () => {
    window.open(openInMapsUrl, '_blank');
  };

  return (
    <div className="google-maps-container">
      {showInfo && (
        <div className="maps-tabs">
          <button 
            className={`tab-button ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <span className="icon">🗺️</span>
            Karte
          </button>
          <button 
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <span className="icon">📍</span>
            Standort-Info
          </button>
        </div>
      )}

      {activeTab === 'map' ? (
        <div className="map-wrapper" style={{ height }}>
          {!mapLoaded && (
            <div className="map-loading">
              <div className="loading-spinner"></div>
              <p>Karte wird geladen...</p>
            </div>
          )}
          
          <iframe
            title="FinanzPlus Austria Standort"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, display: mapLoaded ? 'block' : 'none' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoaded(true)}
          ></iframe>

          {showDirections && mapLoaded && (
            <div className="map-controls">
              <button 
                className="control-button primary"
                onClick={handleGetDirections}
              >
                <span className="icon">🧭</span>
                Route berechnen
              </button>
              <button 
                className="control-button secondary"
                onClick={handleOpenInMaps}
              >
                <span className="icon">📱</span>
                In Google Maps öffnen
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="location-info" style={{ minHeight: height }}>
          <div className="info-header">
            <div className="office-icon">🏢</div>
            <h3>{officeLocation.name}</h3>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h4>Adresse</h4>
                <p>{officeLocation.address}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h4>Telefon</h4>
                <p>
                  <a href={`tel:${officeLocation.phone}`}>
                    {officeLocation.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📧</div>
              <div className="info-content">
                <h4>E-Mail</h4>
                <p>
                  <a href={`mailto:${officeLocation.email}`}>
                    {officeLocation.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-content">
                <h4>Öffnungszeiten</h4>
                <div className="opening-hours">
                  <div className="hours-row">
                    <span className="day">Montag - Freitag:</span>
                    <span className="time">09:00 - 18:00</span>
                  </div>
                  <div className="hours-row">
                    <span className="day">Samstag:</span>
                    <span className="time">10:00 - 14:00</span>
                  </div>
                  <div className="hours-row">
                    <span className="day">Sonntag:</span>
                    <span className="time">Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-actions">
            <button 
              className="action-button primary"
              onClick={handleGetDirections}
            >
              <span className="icon">🧭</span>
              Route berechnen
            </button>
            <button 
              className="action-button secondary"
              onClick={() => setActiveTab('map')}
            >
              <span className="icon">🗺️</span>
              Karte anzeigen
            </button>
          </div>

          <div className="info-note">
            <div className="note-icon">ℹ️</div>
            <p>
              <strong>Hinweis:</strong> Termine nach Vereinbarung möglich. 
              Kontaktieren Sie uns für eine persönliche Beratung außerhalb der regulären Öffnungszeiten.
            </p>
          </div>
        </div>
      )}

      {/* Informations de transport */}
      <div className="transport-info">
        <h4>🚇 Öffentliche Verkehrsmittel</h4>
        <div className="transport-options">
          <div className="transport-item">
            <span className="transport-icon">🚇</span>
            <span>U-Bahn: U1, U3 - Station Stephansplatz (5 Min. zu Fuß)</span>
          </div>
          <div className="transport-item">
            <span className="transport-icon">🚊</span>
            <span>Straßenbahn: Linie 1, 2 - Haltestelle Schwedenplatz</span>
          </div>
          <div className="transport-item">
            <span className="transport-icon">🚌</span>
            <span>Bus: 1A, 2A - Haltestelle Stephansplatz</span>
          </div>
          <div className="transport-item">
            <span className="transport-icon">🅿️</span>
            <span>Parkhaus: City Parking (200m entfernt)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMaps;

// Made with Bob
