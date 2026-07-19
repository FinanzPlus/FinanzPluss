import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

// Composant Calculateur Rapide avec saisie directe
const QuickCalculator = ({ navigate }) => {
  const [amount, setAmount] = useState(25000);
  const [duration, setDuration] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Calcul de la mensualité
  useEffect(() => {
    const interestRate = 0.028; // 2.8% taux d'intérêt fixe
    const monthlyRate = interestRate / 12;
    const numPayments = duration;
    
    if (amount > 0 && duration > 0) {
      // Formule de calcul de mensualité : M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                     (Math.pow(1 + monthlyRate, numPayments) - 1);
      setMonthlyPayment(Math.round(payment));
    } else {
      setMonthlyPayment(0);
    }
  }, [amount, duration]);

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
    setAmount(value);
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setDuration(value);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('de-AT').format(num);
  };

  return (
    <section className="quick-calculator-section section">
      <div className="container">
        <div className="calculator-card">
          <div className="calculator-header">
            <h2 className="calculator-title">Schnellrechner</h2>
            <p className="calculator-subtitle">
              Geben Sie Ihren Wunschbetrag und die Laufzeit ein
            </p>
          </div>
          <div className="calculator-body">
            <div className="calculator-form">
              <div className="form-group">
                <label htmlFor="amount">Kreditbetrag (€)</label>
                <div className="input-wrapper">
                  <input
                    id="amount"
                    type="text"
                    value={formatNumber(amount)}
                    onChange={handleAmountChange}
                    className="calculator-input"
                    placeholder="z.B. 25.000"
                  />
                  <span className="input-suffix">€</span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="duration">Laufzeit (Monate)</label>
                <div className="input-wrapper">
                  <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    className="calculator-input"
                    placeholder="z.B. 60"
                  />
                  <span className="input-suffix">Monate</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/kreditrechner')}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                Kreditantrag stellen
              </button>
            </div>
            <div className="calculator-result">
              <div className="result-label">Geschätzte monatliche Rate</div>
              <div className="result-amount">~{formatNumber(monthlyPayment)} €</div>
              <div className="result-note">
                * Beispielrechnung bei 2,8% Zinssatz (fest)
              </div>
              <div className="result-details">
                <div className="result-detail-item">
                  <span>Kreditbetrag:</span>
                  <strong>{formatNumber(amount)} €</strong>
                </div>
                <div className="result-detail-item">
                  <span>Laufzeit:</span>
                  <strong>{duration} Monate ({Math.round(duration/12)} Jahre)</strong>
                </div>
                <div className="result-detail-item">
                  <span>Gesamtbetrag:</span>
                  <strong>{formatNumber(monthlyPayment * duration)} €</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [stats, setStats] = useState({
    clients: 0,
    amount: 0,
    years: 0,
    satisfaction: 0
  });

  // Animation des compteurs au chargement
  useEffect(() => {
    const animateCounter = (target, key, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 16);
    };

    animateCounter(500, 'clients');
    animateCounter(50000000, 'amount');
    animateCounter(10, 'years');
    animateCounter(98, 'satisfaction');
  }, []);

  // Étapes du processus
  const steps = [
    {
      number: 1,
      title: 'Kreditrechner nutzen',
      description: 'Berechnen Sie Ihre monatliche Rate in wenigen Sekunden',
      icon: '🧮'
    },
    {
      number: 2,
      title: 'Angebote vergleichen',
      description: 'Erhalten Sie personalisierte Angebote von Top-Banken',
      icon: '📊'
    },
    {
      number: 3,
      title: 'Antrag stellen',
      description: 'Reichen Sie Ihren Antrag online ein - schnell und sicher',
      icon: '📝'
    }
  ];

  // Témoignages clients
  const testimonials = [
    {
      name: 'Michael K.',
      city: 'Wien',
      rating: 5,
      text: 'Hervorragender Service! Innerhalb von 24 Stunden hatte ich eine Zusage. Die Konditionen waren deutlich besser als bei meiner Hausbank.',
      loanType: 'Autokredit',
      amount: '25.000 €'
    },
    {
      name: 'Sarah M.',
      city: 'Graz',
      rating: 5,
      text: 'Schnell und unkompliziert. Das Team war immer erreichbar und sehr hilfsbereit. Vom ersten Kontakt bis zur Auszahlung nur 3 Tage!',
      loanType: 'Wohnkredit',
      amount: '150.000 €'
    },
    {
      name: 'Thomas B.',
      city: 'Salzburg',
      rating: 5,
      text: 'Professionelle Beratung und transparente Konditionen. Ich habe 0,5% Zinsen gespart im Vergleich zu meinem ersten Angebot.',
      loanType: 'Privatkredit',
      amount: '15.000 €'
    }
  ];

  // Arguments "Pourquoi nous choisir"
  const benefits = [
    {
      icon: '🏆',
      title: 'Fester Zinssatz',
      description: 'Transparenter Festzins von 2,8% – keine versteckten Kosten'
    },
    {
      icon: '⚡',
      title: 'Schnelle Zusage',
      description: 'Antwort innerhalb von 24 Stunden garantiert'
    },
    {
      icon: '🔒',
      title: '100% Sicher',
      description: 'SSL-Verschlüsselung und DSGVO-konform'
    },
    {
      icon: '💰',
      title: 'Kostenlos',
      description: 'Unser Service ist für Sie völlig kostenfrei'
    },
    {
      icon: '🎯',
      title: 'Persönlich',
      description: 'Individuelle Beratung durch Finanzexperten'
    },
    {
      icon: '📱',
      title: 'Digital',
      description: 'Kompletter Prozess online - keine Filiale nötig'
    }
  ];

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content container">
          <div className="hero-text">
            <h1 className="hero-title animate-fade-in-up">
              Ihr Traumkredit<br />
              <span className="hero-highlight">zu besten Konditionen</span>
            </h1>
            <p className="hero-subtitle animate-fade-in-up">
              Erhalten Sie Ihren Kredit zu einem festen Zinssatz von 2,8% – transparent, schnell und kostenlos.
            </p>
            <div className="hero-buttons animate-fade-in-up">
              <button
                onClick={() => navigate('/kreditrechner')}
                className="btn btn-primary btn-lg"
              >
                🧮 Kreditantrag stellen
              </button>
              <button
                onClick={() => navigate('/uber-uns')}
                className="btn btn-secondary btn-lg"
              >
                Mehr erfahren
              </button>
            </div>
            <div className="hero-trust animate-fade-in-up">
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Über 500 zufriedene Kunden</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>10 Jahre Erfahrung</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>98% Zufriedenheit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHIFFRES CLÉS ANIMÉS */}
      <section className="stats-section section-sm">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card animate-fade-in-up">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{stats.clients}+</div>
              <div className="stat-label">Zufriedene Kunden</div>
            </div>
            <div className="stat-card animate-fade-in-up">
              <div className="stat-icon">💶</div>
              <div className="stat-number">{(stats.amount / 1000000).toFixed(0)}M+</div>
              <div className="stat-label">Finanziert</div>
            </div>
            <div className="stat-card animate-fade-in-up">
              <div className="stat-icon">📅</div>
              <div className="stat-number">{stats.years}</div>
              <div className="stat-label">Jahre Erfahrung</div>
            </div>
            <div className="stat-card animate-fade-in-up">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">{stats.satisfaction}%</div>
              <div className="stat-label">Zufriedenheit</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMENT ÇA FONCTIONNE - 3 ÉTAPES */}
      <section className="process-section section bg-off-white">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">So einfach geht's</h2>
            <p className="section-subtitle">
              In nur 3 Schritten zu Ihrem Wunschkredit
            </p>
          </div>
          <div className="process-steps">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`process-step animate-fade-in-up ${activeStep === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SIMULATEUR RAPIDE INTÉGRÉ */}
      <QuickCalculator navigate={navigate} />

      {/* 7. TÉMOIGNAGES CLIENTS */}
      <section className="testimonials-section section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Was unsere Kunden sagen</h2>
            <p className="section-subtitle">
              Über 500 zufriedene Kunden vertrauen uns
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card animate-fade-in-up">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="testimonial-info">
                    <div className="testimonial-name">{testimonial.name}</div>
                    <div className="testimonial-city">{testimonial.city}</div>
                  </div>
                  <div className="testimonial-rating">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-footer">
                  <span className="testimonial-loan">{testimonial.loanType}</span>
                  <span className="testimonial-amount">{testimonial.amount}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonials-cta text-center">
            <Link to="/bewertungen" className="btn btn-outline">
              Alle Bewertungen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* 8. POURQUOI NOUS CHOISIR - 6 ARGUMENTS */}
      <section className="benefits-section section bg-off-white">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Warum FinanzPlus Austria?</h2>
            <p className="section-subtitle">
              6 gute Gründe, uns zu vertrauen
            </p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card animate-fade-in-up">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BANNIÈRE CTA FINALE */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Bereit für Ihren Traumkredit?</h2>
            <p className="cta-subtitle">
              Starten Sie jetzt und erhalten Sie Ihr persönliches Angebot in 24 Stunden
            </p>
            <div className="cta-buttons">
              <button
                onClick={() => navigate('/kreditrechner')}
                className="btn btn-primary btn-lg"
              >
                🧮 Kreditantrag stellen
              </button>
              <a
                href="https://wa.me/4368110535900?text=Hallo, ich interessiere mich für einen Kredit."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                💬 WhatsApp Beratung
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER est dans MainLayout */}
    </div>
  );
};

export default Home;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
