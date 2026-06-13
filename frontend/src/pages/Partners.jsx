import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Partners.css';

const Partners = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Données complètes des partenaires bancaires autrichiens
  const partners = [
    {
      id: 1,
      name: 'Erste Bank',
      fullName: 'Erste Bank der oesterreichischen Sparkassen AG',
      founded: 1819,
      headquarters: 'Wien',
      employees: '45.000+',
      rating: 'A+',
      website: 'https://www.erstebank.at',
      specialties: ['Immobilienfinanzierung', 'Baufinanzierung', 'Wohnkredit'],
      categories: ['immobilien', 'privat'],
      description: 'Die Erste Bank ist eine der größten und ältesten Banken Österreichs mit über 200 Jahren Erfahrung im Finanzwesen.',
      advantages: [
        'Beste Konditionen für Immobilienfinanzierung',
        'Schnelle Kreditentscheidung in 24h',
        'Persönliche Beratung in über 200 Filialen',
        'Flexible Rückzahlungsoptionen'
      ],
      products: [
        { name: 'Wohnkredit', rate: 'ab 2,5%', duration: '5-30 Jahre' },
        { name: 'Baufinanzierung', rate: 'ab 2,3%', duration: '10-35 Jahre' },
        { name: 'Privatkredit', rate: 'ab 3,9%', duration: '1-10 Jahre' }
      ],
      certifications: ['ISO 9001', 'DSGVO', 'FMA Lizenz'],
      color: '#E2001A'
    },
    {
      id: 2,
      name: 'Raiffeisen Bank',
      fullName: 'Raiffeisen Bank International AG',
      founded: 1886,
      headquarters: 'Wien',
      employees: '47.000+',
      rating: 'A',
      website: 'https://www.raiffeisen.at',
      specialties: ['Unternehmenskredite', 'Geschäftskredite', 'Investitionsfinanzierung'],
      categories: ['unternehmen', 'privat'],
      description: 'Raiffeisen ist Österreichs führende Bankengruppe mit starkem Fokus auf Unternehmensfinanzierung und internationalen Geschäften.',
      advantages: [
        'Spezialist für Unternehmensfinanzierung',
        'Internationale Expertise in CEE',
        'Maßgeschneiderte Finanzlösungen',
        'Digitale Banking-Plattform'
      ],
      products: [
        { name: 'Firmenkredit', rate: 'ab 2,8%', duration: '1-15 Jahre' },
        { name: 'Investitionskredit', rate: 'ab 2,5%', duration: '5-20 Jahre' },
        { name: 'Privatkredit', rate: 'ab 3,7%', duration: '1-10 Jahre' }
      ],
      certifications: ['ISO 27001', 'DSGVO', 'FMA Lizenz'],
      color: '#FFED00'
    },
    {
      id: 3,
      name: 'Bank Austria',
      fullName: 'Bank Austria - UniCredit Bank Austria AG',
      founded: 1855,
      headquarters: 'Wien',
      employees: '7.500+',
      rating: 'A',
      website: 'https://www.bankaustria.at',
      specialties: ['Privatkredit', 'Konsumkredit', 'Umschuldung'],
      categories: ['privat', 'auto'],
      description: 'Bank Austria ist Teil der UniCredit Gruppe und bietet umfassende Finanzdienstleistungen für Privat- und Firmenkunden.',
      advantages: [
        'Teil der internationalen UniCredit Gruppe',
        'Günstige Konditionen für Privatkredite',
        'Online-Kreditantrag in 10 Minuten',
        'Kostenlose Sondertilgungen möglich'
      ],
      products: [
        { name: 'Privatkredit', rate: 'ab 3,5%', duration: '1-8 Jahre' },
        { name: 'Autokredit', rate: 'ab 2,9%', duration: '2-7 Jahre' },
        { name: 'Umschuldung', rate: 'ab 3,2%', duration: '1-10 Jahre' }
      ],
      certifications: ['ISO 9001', 'DSGVO', 'FMA Lizenz'],
      color: '#E2001A'
    },
    {
      id: 4,
      name: 'BAWAG P.S.K.',
      fullName: 'BAWAG P.S.K. Bank für Arbeit und Wirtschaft',
      founded: 1883,
      headquarters: 'Wien',
      employees: '2.400+',
      rating: 'A-',
      website: 'https://www.bawagpsk.com',
      specialties: ['Autokredit', 'Fahrzeugfinanzierung', 'Leasingübernahme'],
      categories: ['auto', 'privat'],
      description: 'BAWAG P.S.K. ist eine der größten Banken Österreichs mit besonderem Fokus auf Autofinanzierung und digitale Services.',
      advantages: [
        'Spezialist für Autofinanzierung',
        '100% digitaler Kreditprozess',
        'Sofortzusage in Echtzeit',
        'Flexible Anzahlungsoptionen'
      ],
      products: [
        { name: 'Autokredit', rate: 'ab 2,7%', duration: '1-7 Jahre' },
        { name: 'Motorradkredit', rate: 'ab 2,9%', duration: '1-5 Jahre' },
        { name: 'Privatkredit', rate: 'ab 3,8%', duration: '1-8 Jahre' }
      ],
      certifications: ['ISO 27001', 'DSGVO', 'FMA Lizenz'],
      color: '#005CA9'
    },
    {
      id: 5,
      name: 'Volksbank',
      fullName: 'Österreichische Volksbanken AG',
      founded: 1922,
      headquarters: 'Wien',
      employees: '3.200+',
      rating: 'BBB+',
      website: 'https://www.volksbank.at',
      specialties: ['Wohnbaukredit', 'Sanierungskredit', 'Energieeffizienz'],
      categories: ['immobilien', 'privat'],
      description: 'Volksbank ist eine genossenschaftliche Bankengruppe mit starkem regionalem Bezug und Fokus auf nachhaltige Finanzierung.',
      advantages: [
        'Regionale Nähe und persönliche Betreuung',
        'Spezialist für Wohnbauförderung',
        'Nachhaltige Finanzierungsmodelle',
        'Faire Konditionen für Sanierungen'
      ],
      products: [
        { name: 'Wohnbaukredit', rate: 'ab 2,4%', duration: '10-30 Jahre' },
        { name: 'Sanierungskredit', rate: 'ab 2,6%', duration: '5-20 Jahre' },
        { name: 'Privatkredit', rate: 'ab 4,1%', duration: '1-8 Jahre' }
      ],
      certifications: ['ISO 9001', 'DSGVO', 'FMA Lizenz'],
      color: '#009640'
    }
  ];

  // Catégories de filtrage
  const categories = [
    { id: 'all', name: 'Alle Partner', icon: '🏦' },
    { id: 'immobilien', name: 'Immobilien', icon: '🏠' },
    { id: 'auto', name: 'Auto', icon: '🚗' },
    { id: 'privat', name: 'Privat', icon: '👤' },
    { id: 'unternehmen', name: 'Unternehmen', icon: '🏢' }
  ];

  // Filtrer les partenaires
  const filteredPartners = selectedCategory === 'all' 
    ? partners 
    : partners.filter(p => p.categories.includes(selectedCategory));

  return (
    <div className="partners-page">
      {/* Hero Section */}
      <section className="partners-hero">
        <div className="container">
          <h1 className="partners-hero-title">Unsere Bankpartner</h1>
          <p className="partners-hero-subtitle">
            Wir arbeiten mit den führenden österreichischen Banken zusammen, 
            um Ihnen die besten Kreditkonditionen zu garantieren.
          </p>
          <div className="partners-hero-stats">
            <div className="hero-stat">
              <span className="stat-number">5</span>
              <span className="stat-label">Top-Banken</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">200+</span>
              <span className="stat-label">Jahre Erfahrung</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Vertrauenswürdig</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres par catégorie */}
      <section className="partners-filters section-sm">
        <div className="container">
          <div className="filters-wrapper">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des partenaires */}
      <section className="partners-list section">
        <div className="container">
          <div className="partners-grid">
            {filteredPartners.map((partner, index) => (
              <div 
                key={partner.id} 
                className="partner-card-detailed animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header de la carte */}
                <div className="partner-card-header">
                  <div className="partner-logo-container">
                    <div 
                      className="partner-logo-circle"
                      style={{ borderColor: partner.color }}
                    >
                      <span className="partner-logo-text">{partner.name}</span>
                    </div>
                    <div className="partner-badge-official">Offizieller Partner</div>
                  </div>
                  <div className="partner-rating">
                    <span className="rating-label">Rating</span>
                    <span className="rating-value">{partner.rating}</span>
                  </div>
                </div>

                {/* Informations principales */}
                <div className="partner-card-body">
                  <h3 className="partner-card-title">{partner.name}</h3>
                  <p className="partner-full-name">{partner.fullName}</p>
                  <p className="partner-description">{partner.description}</p>

                  {/* Infos clés */}
                  <div className="partner-info-grid">
                    <div className="info-item">
                      <span className="info-icon">📅</span>
                      <div className="info-content">
                        <span className="info-label">Gegründet</span>
                        <span className="info-value">{partner.founded}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <div className="info-content">
                        <span className="info-label">Hauptsitz</span>
                        <span className="info-value">{partner.headquarters}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">👥</span>
                      <div className="info-content">
                        <span className="info-label">Mitarbeiter</span>
                        <span className="info-value">{partner.employees}</span>
                      </div>
                    </div>
                  </div>

                  {/* Spécialités */}
                  <div className="partner-specialties">
                    <h4 className="specialties-title">Spezialitäten</h4>
                    <div className="specialties-tags">
                      {partner.specialties.map((specialty, idx) => (
                        <span key={idx} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="partner-advantages">
                    <h4 className="advantages-title">Vorteile</h4>
                    <ul className="advantages-list">
                      {partner.advantages.map((advantage, idx) => (
                        <li key={idx} className="advantage-item">
                          <span className="advantage-icon">✓</span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Produits */}
                  <div className="partner-products">
                    <h4 className="products-title">Kreditprodukte</h4>
                    <div className="products-list">
                      {partner.products.map((product, idx) => (
                        <div key={idx} className="product-item">
                          <div className="product-name">{product.name}</div>
                          <div className="product-details">
                            <span className="product-rate">{product.rate}</span>
                            <span className="product-duration">{product.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="partner-certifications">
                    {partner.certifications.map((cert, idx) => (
                      <span key={idx} className="cert-badge">
                        <span className="cert-icon">✓</span>
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer de la carte */}
                <div className="partner-card-footer">
                  <a 
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Website besuchen
                  </a>
                  <Link 
                    to="/kreditrechner"
                    className="btn btn-primary"
                  >
                    Kredit berechnen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="partners-cta section bg-off-white">
        <div className="container text-center">
          <h2 className="cta-title">Bereit für Ihren Kredit?</h2>
          <p className="cta-subtitle">
            Vergleichen Sie jetzt Angebote von allen Partnern und finden Sie die beste Lösung
          </p>
          <div className="cta-buttons">
            <Link to="/kreditrechner" className="btn btn-primary btn-lg">
              🧮 Kreditrechner starten
            </Link>
            <Link to="/kontakt" className="btn btn-outline btn-lg">
              📞 Beratung anfragen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
