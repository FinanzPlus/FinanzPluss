import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinancialDisclaimer from '../components/common/FinancialDisclaimer';
import './LoanComparator.css';

/**
 * LOAN COMPARATOR - Calcul avec taux fixe 2,8%
 */
const LoanComparator = () => {
  const navigate = useNavigate();

  // Taux fixe unique 2.8%
  const FIXED_RATE = 2.8;

  const [amount, setAmount] = useState(25000);
  const [duration, setDuration] = useState(60);

  // Calcul avec taux fixe 2.8%
  const monthlyRate = FIXED_RATE / 100 / 12;
  const monthlyPayment = amount > 0 && duration > 0
    ? (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration))
    : 0;
  const totalAmount = monthlyPayment * duration;
  const totalInterest = totalAmount - amount;

  // Scénarios de durée pour comparer
  const scenarios = [24, 36, 48, 60, 84, 120].map(months => {
    const mRate = FIXED_RATE / 100 / 12;
    const mPayment = (amount * mRate) / (1 - Math.pow(1 + mRate, -months));
    const tAmount = mPayment * months;
    return {
      months,
      monthlyPayment: mPayment.toFixed(2),
      totalAmount: tAmount.toFixed(2),
      totalInterest: (tAmount - amount).toFixed(2)
    };
  });

  const goToSimulator = () => {
    localStorage.setItem('preselected_amount', amount);
    localStorage.setItem('preselected_duration', duration);
    navigate('/kreditrechner');
  };

  return (
    <div className="loan-comparator">
      {/* Hero Section */}
      <section className="comparator-hero">
        <div className="container">
          <h1>📊 Kreditvergleich</h1>
          <p className="hero-subtitle">
            Vergleichen Sie verschiedene Laufzeiten zu unserem festen Zinssatz von 2,8%
          </p>
        </div>
      </section>

      {/* Formulaire */}
      <section className="comparator-form-section">
        <div className="container">
          <div className="comparator-form-card">
            <h2>Kreditparameter</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="amount">
                  Kreditbetrag
                  <span className="label-value">€ {amount.toLocaleString('de-AT')}</span>
                </label>
                <input
                  type="range"
                  id="amount"
                  min="1000"
                  max="500000"
                  step="1000"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="range-input"
                />
                <div className="range-labels">
                  <span>€ 1.000</span>
                  <span>€ 500.000</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="duration">
                  Laufzeit
                  <span className="label-value">{duration} Monate ({(duration / 12).toFixed(1)} Jahre)</span>
                </label>
                <input
                  type="range"
                  id="duration"
                  min="12"
                  max="360"
                  step="6"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="range-input"
                />
                <div className="range-labels">
                  <span>12 Monate</span>
                  <span>360 Monate</span>
                </div>
              </div>
            </div>

            {/* Affichage taux fixe */}
            <div className="fixed-rate-banner">
              🔒 <strong>Zinssatz: 2,8% fest</strong> – transparent und ohne Überraschungen
            </div>
          </div>
        </div>
      </section>

      {/* Avertissement financier obligatoire */}
      <FinancialDisclaimer variant="compact" />

      {/* Résultat principal */}
      <section className="comparison-results-section">
        <div className="container">
          <h2 className="section-title">Ihre Kreditberechnung</h2>
          <p className="section-subtitle">
            Kreditbetrag: <strong>€ {amount.toLocaleString('de-AT')}</strong> | Laufzeit: <strong>{duration} Monate</strong> | Zinssatz: <strong>2,8% fest</strong>
          </p>

          <div className="main-result-card">
            <div className="main-result-highlight">
              <div className="result-label">Monatliche Rate</div>
              <div className="result-value">€ {monthlyPayment.toFixed(2)}</div>
            </div>
            <div className="main-result-details">
              <div className="detail-item">
                <span className="detail-icon">💰</span>
                <div>
                  <div className="detail-label">Gesamtbetrag</div>
                  <div className="detail-value">€ {totalAmount.toFixed(2)}</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📈</span>
                <div>
                  <div className="detail-label">Gesamtzinsen</div>
                  <div className="detail-value">€ {totalInterest.toFixed(2)}</div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📊</span>
                <div>
                  <div className="detail-label">Zinssatz</div>
                  <div className="detail-value">2,8% fest 🔒</div>
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={goToSimulator}>
              🧮 Jetzt Kreditantrag stellen
            </button>
          </div>
        </div>
      </section>

      {/* Tableau comparatif par durée */}
      <section className="comparison-table-section">
        <div className="container">
          <h2 className="section-title">Laufzeitenvergleich</h2>
          <p className="section-subtitle">
            Für € {amount.toLocaleString('de-AT')} bei 2,8% Festzins
          </p>

          <div className="comparison-grid">
            {scenarios.map((sc, index) => (
              <div
                key={sc.months}
                className={`comparison-card ${sc.months === duration ? 'best-offer' : ''}`}
              >
                {sc.months === duration && (
                  <div className="best-badge">✓ Ihre Auswahl</div>
                )}
                <div className="comparison-card-header">
                  <h3 className="bank-name">{sc.months} Monate</h3>
                  <p style={{ color: '#57606a', fontSize: '0.875rem' }}>({(sc.months / 12).toFixed(1)} Jahre)</p>
                </div>
                <div className="comparison-card-body">
                  <div className="main-result">
                    <div className="result-label">Monatliche Rate</div>
                    <div className="result-value">€ {sc.monthlyPayment}</div>
                  </div>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <div>
                        <div className="detail-label">Gesamtbetrag</div>
                        <div className="detail-value">€ {sc.totalAmount}</div>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📈</span>
                      <div>
                        <div className="detail-label">Zinsen gesamt</div>
                        <div className="detail-value">€ {sc.totalInterest}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="comparison-card-footer">
                  <button
                    className={`btn ${sc.months === duration ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => { setDuration(sc.months); goToSimulator(); }}
                  >
                    Auswählen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section avantages */}
      <section className="advantages-section">
        <div className="container">
          <h2>Warum FinanzPlus Austria?</h2>
          <div className="advantages-grid">
            <div className="advantage-card">
              <span className="advantage-icon">🔒</span>
              <h3>Fester Zinssatz</h3>
              <p>2,8% fest – keine versteckten Kosten, keine bösen Überraschungen</p>
            </div>
            <div className="advantage-card">
              <span className="advantage-icon">⚡</span>
              <h3>Schnelle Antwort</h3>
              <p>Antwort auf Ihre Anfrage innerhalb von 24 Stunden garantiert</p>
            </div>
            <div className="advantage-card">
              <span className="advantage-icon">💰</span>
              <h3>Kostenlos</h3>
              <p>Unser Service ist für Sie völlig kostenfrei und unverbindlich</p>
            </div>
            <div className="advantage-card">
              <span className="advantage-icon">🎯</span>
              <h3>Transparent</h3>
              <p>Klare Konditionen ohne versteckte Gebühren oder Provisionen</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Bereit für Ihren Kredit?</h2>
          <p>Starten Sie jetzt Ihren Kreditantrag – einfach, schnell und kostenlos</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={goToSimulator}
          >
            🧮 Kreditantrag stellen
          </button>
        </div>
      </section>
    </div>
  );
};

export default LoanComparator;
