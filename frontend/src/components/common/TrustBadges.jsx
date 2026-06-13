import React from 'react';
import './TrustBadges.css';

const TrustBadges = () => {
  const badges = [
    {
      icon: 'fa-shield-alt',
      title: 'SSL Verschlüsselt',
      description: '256-Bit Sicherheit'
    },
    {
      icon: 'fa-lock',
      title: 'Datenschutz',
      description: 'DSGVO konform'
    },
    {
      icon: 'fa-certificate',
      title: 'Zertifiziert',
      description: 'TÜV geprüft'
    },
    {
      icon: 'fa-user-shield',
      title: 'Sicher',
      description: '100% geschützt'
    },
    {
      icon: 'fa-award',
      title: 'Ausgezeichnet',
      description: 'Top bewertet'
    }
  ];

  return (
    <div className="trust-badges">
      <div className="badges-container">
        {badges.map((badge, index) => (
          <div key={index} className="trust-badge">
            <div className="badge-icon">
              <i className={`fas ${badge.icon}`}></i>
            </div>
            <div className="badge-content">
              <h4>{badge.title}</h4>
              <p>{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;

// Made with Bob
