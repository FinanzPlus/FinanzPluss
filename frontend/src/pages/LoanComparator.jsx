import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BankLogo from '../components/common/BankLogo';
import { compareOffers, formatCurrency } from '../services/loanService';
import './LoanComparator.css';

/**
 * LOAN COMPARATOR - Comparaison multi-banques
 * Compare les offres de toutes les banques partenaires
 */
const LoanComparator = () => {
  const navigate = useNavigate();

  // Données des banques
  const banks = [
    {
      id: 1,
      name: 'Erste Bank',
      rate: 2.5,
      specialties: ['Immobilienfinanzierung', 'Wohnkredit'],
      minAmount: 5000,
      maxAmount: 500000,
      processingTime: '24h',
      approvalRate: 92,
      color: '#E2001A'
    },
    {
      id: 2,
      name: 'Raiffeisen Bank',
      rate: 2.8,
      specialties: ['Unternehmenskredite', 'Geschäftskredite'],
      minAmount: 10000,
      maxAmount: 1000000,
      processingTime: '48h',
      approvalRate: 88,
      color: '#FFED00'
    },
    {
      id: 3,
      name: 'Bank Austria',
      rate: 3.2,
      specialties: ['Privatkredit', 'Konsumkredit'],
      minAmount: 1000,
      maxAmount: 75000,
      processingTime: '12h',
      approvalRate: 95,
      color: '#E2001A'
    },
    {
      id: 4,
      name: 'BAWAG P.S.K.',
      rate: 2.7,
      specialties: ['Autokredit', 'Fahrzeugfinanzierung'],
      minAmount: 3000,
      maxAmount: 100000,
      processingTime: '24h',
      approvalRate: 90,
      color: '#005CA9'
    },
    {
      id: 5,
      name: 'Volksbank',
      rate: 2.4,
      specialties: ['Wohnbaukredit', 'Sanierungskredit'],
      minAmount: 10000,
      maxAmount: 400000,
      processingTime: '36h',
      approvalRate: 85,
      color: '#009640'
    }
  ];

  // États
  const [amount, setAmount] = useState(25000);
  const [duration, setDuration] = useState(60);
  const [comparison, setComparison] = useState([]);
  const [sortBy, setSortBy] = useState('totalAmount'); // totalAmount, rate, monthlyPayment
  const [showDetails, setShowDetails] = useState(null);

  // Calcul automatique
  useEffect(() => {
    const results = compareOffers(amount, duration, banks);
    setComparison(results);
  }, [amount, duration]);

  // Tri des résultats
  const sortedComparison = [...comparison].sort((a, b) => {
    switch (sortBy) {
      case 'rate':
        return parseFloat(a.rate) - parseFloat(b.rate);
      case 'monthlyPayment':
        return parseFloat(a.monthlyPayment) - parseFloat(b.monthlyPayment);
      case 'totalAmount':
      default:
        return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
    }
  });

  // Meilleure offre
  const bestOffer = sortedComparison[0];

  // Sélectionner une banque et aller au simulateur
  const selectBank = (bankName) => {
    const bank = banks.find(b => b.name === bankName);
    localStorage.setItem('preselected_bank', JSON.stringify(bank));
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
            Vergleichen Sie Angebote von 5 führenden österreichischen Banken in Echtzeit
          </p>
        </div>
      </section>

      {/* Formulaire de comparaison */}
      <section className="comparator-form-section">
        <div className="container">
          <div className="comparator-form-card">
            <h2>Vergleichsparameter</h2>
            
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

            <div className="sort-controls">
              <label>Sortieren nach:</label>
              <div className="sort-buttons">
                <button
                  className={`sort-btn ${sortBy === 'totalAmount' ? 'active' : ''}`}
                  onClick={() => setSortBy('totalAmount')}
                >
                  💰 Gesamtbetrag
                </button>
                <button
                  className={`sort-btn ${sortBy === 'monthlyPayment' ? 'active' : ''}`}
                  onClick={() => setSortBy('monthlyPayment')}
                >
                  📅 Monatliche Rate
                </button>
                <button
                  className={`sort-btn ${sortBy === 'rate' ? 'active' : ''}`}
                  onClick={() => setSortBy('rate')}
                >
                  📈 Zinssatz
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Résultats de comparaison */}
      <section className="comparison-results-section">
        <div className="container">
          <h2 className="section-title">Vergleichsergebnisse</h2>
          <p className="section-subtitle">
            {sortedComparison.length} Angebote gefunden - Sortiert nach {
              sortBy === 'totalAmount' ? 'Gesamtbetrag' :
              sortBy === 'monthlyPayment' ? 'monatlicher Rate' :
              'Zinssatz'
            }
          </p>

          <div className="comparison-grid">
            {sortedComparison.map((offer, index) => {
              const bank = banks.find(b => b.name === offer.bank);
              const isBest = index === 0;

              return (
                <div
                  key={offer.bankId}
                  className={`comparison-card ${isBest ? 'best-offer' : ''} ${showDetails === offer.bankId ? 'expanded' : ''}`}
                >
                  {isBest && (
                    <div className="best-badge">
                      🏆 Bestes Angebot
                    </div>
                  )}

                  <div className="comparison-card-header">
                    <BankLogo bankName={offer.bank} size="large" />
                    <h3 className="bank-name">{offer.bank}</h3>
                    <div className="bank-specialties">
                      {bank.specialties.map((spec, idx) => (
                        <span key={idx} className="specialty-tag">{spec}</span>
                      ))}
                    </div>
                  </div>

                  <div className="comparison-card-body">
                    {/* Mensualité */}
                    <div className="main-result">
                      <div className="result-label">Monatliche Rate</div>
                      <div className="result-value">€ {offer.monthlyPayment}</div>
                    </div>

                    {/* Détails */}
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-icon">📊</span>
                        <div>
                          <div className="detail-label">Zinssatz</div>
                          <div className="detail-value">{offer.rate}% p.a.</div>
                        </div>
                      </div>

                      <div className="detail-item">
                        <span className="detail-icon">💰</span>
                        <div>
                          <div className="detail-label">Gesamtbetrag</div>
                          <div className="detail-value">€ {offer.totalAmount}</div>
                        </div>
                      </div>

                      <div className="detail-item">
                        <span className="detail-icon">📈</span>
                        <div>
                          <div className="detail-label">Gesamtzinsen</div>
                          <div className="detail-value">€ {offer.totalInterest}</div>
                        </div>
                      </div>

                      <div className="detail-item">
                        <span className="detail-icon">⏱️</span>
                        <div>
                          <div className="detail-label">Bearbeitungszeit</div>
                          <div className="detail-value">{bank.processingTime}</div>
                        </div>
                      </div>
                    </div>

                    {/* Économies */}
                    {index > 0 && parseFloat(offer.savings) > 0 && (
                      <div className="savings-info">
                        <span className="savings-icon">💸</span>
                        <span>
                          Sie zahlen <strong>€ {offer.savings}</strong> mehr als beim besten Angebot
                        </span>
                      </div>
                    )}

                    {isBest && (
                      <div className="best-info">
                        <span className="best-icon">✓</span>
                        <span>Günstigstes Angebot - Sparen Sie bis zu € {sortedComparison[sortedComparison.length - 1]?.savings || 0}</span>
                      </div>
                    )}

                    {/* Détails supplémentaires */}
                    {showDetails === offer.bankId && (
                      <div className="extra-details animate-fade-in">
                        <div className="extra-detail-row">
                          <span>Mindestbetrag:</span>
                          <strong>€ {bank.minAmount.toLocaleString('de-AT')}</strong>
                        </div>
                        <div className="extra-detail-row">
                          <span>Maximalbetrag:</span>
                          <strong>€ {bank.maxAmount.toLocaleString('de-AT')}</strong>
                        </div>
                        <div className="extra-detail-row">
                          <span>Genehmigungsrate:</span>
                          <strong>{bank.approvalRate}%</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="comparison-card-footer">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowDetails(showDetails === offer.bankId ? null : offer.bankId)}
                    >
                      {showDetails === offer.bankId ? 'Weniger anzeigen' : 'Mehr Details'}
                    </button>
                    <button
                      className={`btn ${isBest ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => selectBank(offer.bank)}
                    >
                      {isBest ? '🏆 Dieses Angebot wählen' : 'Auswählen'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section avantages */}
      <section className="advantages-section">
        <div className="container">
          <h2>Warum unseren Vergleich nutzen?</h2>
          <div className="advantages-grid">
            <div className="advantage-card">
              <span className="advantage-icon">⚡</span>
              <h3>Echtzeit-Vergleich</h3>
              <p>Aktuelle Konditionen von allen Partnerbanken in Sekunden</p>
            </div>
            <div className="advantage-card">
              <span className="advantage-icon">💰</span>
              <h3>Geld sparen</h3>
              <p>Finden Sie das günstigste Angebot und sparen Sie Tausende Euro</p>
            </div>
            <div className="advantage-card">
              <span className="advantage-icon">🔒</span>
              <h3>100% Sicher</h3>
              <p>Ihre Daten sind verschlüsselt und werden nicht weitergegeben</p>
            </div>
            <div className="advantage-card">
              <span className="advantage-icon">🎯</span>
              <h3>Unabhängig</h3>
              <p>Objektiver Vergleich ohne versteckte Kosten oder Provisionen</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Bereit für Ihren Kredit?</h2>
          <p>Wählen Sie das beste Angebot und starten Sie Ihre Kreditanfrage in wenigen Minuten</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => selectBank(bestOffer?.bank)}
          >
            🏆 Bestes Angebot wählen
          </button>
        </div>
      </section>
    </div>
  );
};

export default LoanComparator;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
