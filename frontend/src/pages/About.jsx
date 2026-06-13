import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  // Équipe
  const team = [
    {
      name: 'Dr. Michael Schneider',
      role: 'Geschäftsführer & Gründer',
      image: '/assets/team/michael.jpg',
      bio: 'Über 20 Jahre Erfahrung im Finanzsektor mit Spezialisierung auf Kreditvermittlung',
      linkedin: 'https://linkedin.com/in/michael-schneider'
    },
    {
      name: 'Sarah Weber',
      role: 'Leiterin Kundenberatung',
      image: '/assets/team/sarah.jpg',
      bio: 'Expertin für maßgeschneiderte Finanzlösungen mit Fokus auf Kundenzufriedenheit',
      linkedin: 'https://linkedin.com/in/sarah-weber'
    },
    {
      name: 'Thomas Müller',
      role: 'Leiter Partnerschaften',
      image: '/assets/team/thomas.jpg',
      bio: 'Verantwortlich für strategische Bankpartnerschaften und Produktentwicklung',
      linkedin: 'https://linkedin.com/in/thomas-mueller'
    },
    {
      name: 'Lisa Hoffmann',
      role: 'Compliance & Datenschutz',
      image: '/assets/team/lisa.jpg',
      bio: 'Spezialistin für DSGVO-Compliance und Datensicherheit im Finanzbereich',
      linkedin: 'https://linkedin.com/in/lisa-hoffmann'
    }
  ];

  // Valeurs
  const values = [
    {
      icon: '🎯',
      title: 'Transparenz',
      description: 'Klare Kommunikation ohne versteckte Kosten oder Gebühren. Was Sie sehen, ist was Sie bekommen.'
    },
    {
      icon: '🤝',
      title: 'Vertrauen',
      description: 'Über 12.000 zufriedene Kunden vertrauen auf unsere Expertise und unabhängige Beratung.'
    },
    {
      icon: '⚡',
      title: 'Effizienz',
      description: 'Schnelle Kreditentscheidungen innerhalb von 24 Stunden dank digitaler Prozesse.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Modernste Technologie für den besten Kreditvergleich und optimale Konditionen.'
    },
    {
      icon: '🏆',
      title: 'Exzellenz',
      description: 'Höchste Qualitätsstandards in Beratung und Service für Ihre Zufriedenheit.'
    },
    {
      icon: '🔒',
      title: 'Sicherheit',
      description: 'DSGVO-konform und FMA-lizenziert für maximalen Schutz Ihrer Daten.'
    }
  ];

  // Expertise
  const expertise = [
    {
      icon: '🏠',
      title: 'Wohnkredite',
      count: '3.500+',
      description: 'Vermittelte Wohnkredite mit durchschnittlich 0,3% besseren Konditionen'
    },
    {
      icon: '🚗',
      title: 'Autokredite',
      count: '2.800+',
      description: 'Finanzierte Fahrzeuge mit flexiblen Laufzeiten und attraktiven Zinsen'
    },
    {
      icon: '💼',
      title: 'Geschäftskredite',
      count: '1.200+',
      description: 'Unterstützte KMUs bei Expansion und Investitionen'
    },
    {
      icon: '🎓',
      title: 'Bildungskredite',
      count: '800+',
      description: 'Ermöglichte Aus- und Weiterbildungen mit Sonderkonditionen'
    }
  ];

  // Milestones
  const milestones = [
    {
      year: '2015',
      title: 'Gründung',
      description: 'FinanzPlus Austria wird in Wien gegründet mit der Vision, Kreditvermittlung zu revolutionieren'
    },
    {
      year: '2017',
      title: 'Erste Partnerschaften',
      description: 'Kooperationen mit Erste Bank und Raiffeisen etabliert'
    },
    {
      year: '2019',
      title: 'Digitale Transformation',
      description: 'Launch der Online-Plattform mit Echtzeit-Kreditvergleich'
    },
    {
      year: '2021',
      title: '10.000 Kunden',
      description: 'Meilenstein von 10.000 zufriedenen Kunden erreicht'
    },
    {
      year: '2023',
      title: 'Expansion',
      description: 'Erweiterung auf 6 Bankpartner und neue Produktlinien'
    },
    {
      year: '2024',
      title: 'Auszeichnung',
      description: 'Gewinner des "Bester Kreditvermittler Österreich" Awards'
    }
  ];

  // Certifications
  const certifications = [
    {
      name: 'FMA-Lizenz',
      icon: '🏛️',
      description: 'Lizenziert durch die Finanzmarktaufsicht Österreich'
    },
    {
      name: 'DSGVO-konform',
      icon: '🔒',
      description: 'Vollständige Einhaltung der EU-Datenschutzgrundverordnung'
    },
    {
      name: 'ISO 9001',
      icon: '⭐',
      description: 'Zertifiziertes Qualitätsmanagementsystem'
    },
    {
      name: 'SSL-Verschlüsselung',
      icon: '🛡️',
      description: 'Höchste Sicherheitsstandards für Ihre Daten'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>Über FinanzPlus Austria</h1>
          <p className="hero-subtitle">
            Ihr vertrauensvoller Partner für faire und transparente Kreditvermittlung seit 2015
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Unsere Mission</h2>
              <p className="mission-lead">
                Wir machen Kreditvermittlung einfach, transparent und fair für alle Österreicher.
              </p>
              <p>
                Bei FinanzPlus Austria glauben wir, dass jeder Zugang zu fairen Finanzierungsmöglichkeiten 
                verdient. Deshalb haben wir eine Plattform geschaffen, die Ihnen ermöglicht, die besten 
                Kreditangebote von führenden österreichischen Banken zu vergleichen – kostenlos, unverbindlich 
                und in wenigen Minuten.
              </p>
              <p>
                Unser Team aus erfahrenen Finanzexperten arbeitet täglich daran, Ihnen die besten Konditionen 
                zu sichern und Sie durch den gesamten Kreditprozess zu begleiten. Von der ersten Berechnung 
                bis zur finalen Auszahlung stehen wir an Ihrer Seite.
              </p>
              <div className="mission-stats">
                <div className="mission-stat">
                  <span className="stat-number">12.000+</span>
                  <span className="stat-label">Zufriedene Kunden</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Kundenzufriedenheit</span>
                </div>
                <div className="mission-stat">
                  <span className="stat-number">€150M+</span>
                  <span className="stat-label">Vermittelte Kredite</span>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">🏦</span>
                <p>FinanzPlus Austria Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Unsere Werte</h2>
          <p className="section-subtitle">
            Diese Prinzipien leiten uns in allem, was wir tun
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <span className="value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="expertise-section">
        <div className="container">
          <h2>Unsere Expertise</h2>
          <p className="section-subtitle">
            Spezialisiert auf verschiedene Kreditarten mit nachweisbaren Erfolgen
          </p>
          <div className="expertise-grid">
            {expertise.map((item, index) => (
              <div key={index} className="expertise-card">
                <span className="expertise-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <div className="expertise-count">{item.count}</div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Unser Team</h2>
          <p className="section-subtitle">
            Erfahrene Finanzexperten mit Leidenschaft für Ihren Erfolg
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="team-image-fallback" style={{display: 'none'}}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    <span>🔗</span> LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2>Unsere Geschichte</h2>
          <p className="section-subtitle">
            Von der Gründung bis heute – Eine Erfolgsgeschichte
          </p>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-year">{milestone.year}</span>
                </div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="certifications-section">
        <div className="container">
          <h2>Zertifizierungen & Sicherheit</h2>
          <p className="section-subtitle">
            Ihre Sicherheit und Ihr Vertrauen sind unsere höchste Priorität
          </p>
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="cert-card">
                <span className="cert-icon">{cert.icon}</span>
                <h3>{cert.name}</h3>
                <p>{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="about-partners-section">
        <div className="container">
          <h2>Unsere Bankpartner</h2>
          <p className="section-subtitle">
            Zusammenarbeit mit den führenden Banken Österreichs
          </p>
          <div className="partners-logos">
            <div className="partner-logo-item">
              <div className="logo-placeholder">Erste Bank</div>
            </div>
            <div className="partner-logo-item">
              <div className="logo-placeholder">Raiffeisen</div>
            </div>
            <div className="partner-logo-item">
              <div className="logo-placeholder">Bank Austria</div>
            </div>
            <div className="partner-logo-item">
              <div className="logo-placeholder">BAWAG P.S.K.</div>
            </div>
            <div className="partner-logo-item">
              <div className="logo-placeholder">Volksbank</div>
            </div>
            <div className="partner-logo-item">
              <div className="logo-placeholder">Sparkasse</div>
            </div>
          </div>
          <div className="partners-cta">
            <Button
              variant="outline"
              size="large"
              onClick={() => navigate('/partner')}
            >
              Alle Partner ansehen
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Bereit, mit uns zu arbeiten?</h2>
            <p>Lassen Sie uns gemeinsam die beste Finanzierungslösung für Sie finden</p>
            <div className="cta-buttons">
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate('/kreditrechner')}
              >
                Kredit berechnen
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => navigate('/kontakt')}
              >
                Kontakt aufnehmen
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

// Made with Bob
