import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CreditScore.css';

const CreditScore = () => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchCreditScore();
  }, []);

  const fetchCreditScore = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/credit-score/my-score', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setScoreData(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du score:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    try {
      setCalculating(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/credit-score/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setScoreData(data.data);
        alert('Kredit-Score erfolgreich berechnet!');
      } else {
        alert(data.error || 'Fehler bei der Berechnung');
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      alert('Fehler bei der Berechnung des Kredit-Scores');
    } finally {
      setCalculating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 750) return 'excellent';
    if (score >= 650) return 'good';
    if (score >= 550) return 'fair';
    return 'poor';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Ausgezeichnet';
    if (score >= 650) return 'Gut';
    if (score >= 550) return 'Befriedigend';
    return 'Verbesserungsbedürftig';
  };

  const getScoreDescription = (score) => {
    if (score >= 750) return 'Ihre Kreditwürdigkeit ist ausgezeichnet. Sie haben sehr gute Chancen auf günstige Kreditkonditionen.';
    if (score >= 650) return 'Ihre Kreditwürdigkeit ist gut. Sie sollten gute Kreditangebote erhalten können.';
    if (score >= 550) return 'Ihre Kreditwürdigkeit ist befriedigend. Es gibt Verbesserungspotenzial für bessere Konditionen.';
    return 'Ihre Kreditwürdigkeit sollte verbessert werden. Folgen Sie unseren Empfehlungen.';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFactorIcon = (factor) => {
    const icons = {
      payment_history: 'fa-history',
      credit_utilization: 'fa-chart-pie',
      credit_age: 'fa-calendar-alt',
      credit_mix: 'fa-layer-group',
      recent_inquiries: 'fa-search'
    };
    return icons[factor] || 'fa-info-circle';
  };

  const getFactorLabel = (factor) => {
    const labels = {
      payment_history: 'Zahlungshistorie',
      credit_utilization: 'Kreditauslastung',
      credit_age: 'Kredithistorie',
      credit_mix: 'Kreditmix',
      recent_inquiries: 'Kreditanfragen'
    };
    return labels[factor] || factor;
  };

  const getFactorWeight = (factor) => {
    const weights = {
      payment_history: '35%',
      credit_utilization: '30%',
      credit_age: '15%',
      credit_mix: '10%',
      recent_inquiries: '10%'
    };
    return weights[factor] || '0%';
  };

  const getImprovementTips = () => {
    return [
      {
        icon: 'fa-check-circle',
        title: 'Pünktliche Zahlungen',
        description: 'Zahlen Sie alle Rechnungen und Kreditraten immer pünktlich. Dies ist der wichtigste Faktor für Ihren Score.'
      },
      {
        icon: 'fa-credit-card',
        title: 'Kreditauslastung reduzieren',
        description: 'Halten Sie Ihre Kreditkartenauslastung unter 30% des verfügbaren Limits.'
      },
      {
        icon: 'fa-clock',
        title: 'Kredithistorie aufbauen',
        description: 'Je länger Ihre Kredithistorie, desto besser. Schließen Sie alte Konten nicht vorschnell.'
      },
      {
        icon: 'fa-balance-scale',
        title: 'Kreditmix diversifizieren',
        description: 'Eine gesunde Mischung verschiedener Kreditarten kann Ihren Score verbessern.'
      },
      {
        icon: 'fa-ban',
        title: 'Anfragen begrenzen',
        description: 'Vermeiden Sie zu viele Kreditanfragen in kurzer Zeit. Jede Anfrage kann Ihren Score senken.'
      },
      {
        icon: 'fa-file-invoice',
        title: 'Fehler korrigieren',
        description: 'Überprüfen Sie Ihre Kreditauskunft regelmäßig und lassen Sie Fehler korrigieren.'
      }
    ];
  };

  if (loading) {
    return (
      <div className="credit-score-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="credit-score-page">
      <div className="page-header">
        <div className="header-content">
          <Link to="/user/dashboard" className="back-link">
            <i className="fas fa-arrow-left"></i>
            Zurück zum Dashboard
          </Link>
          <h1>Mein Kredit-Score</h1>
          <p className="header-subtitle">Verstehen und verbessern Sie Ihre Kreditwürdigkeit</p>
        </div>
        <button 
          onClick={handleCalculate} 
          className="btn btn-primary"
          disabled={calculating}
        >
          {calculating ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Berechnung läuft...
            </>
          ) : (
            <>
              <i className="fas fa-calculator"></i>
              Score neu berechnen
            </>
          )}
        </button>
      </div>

      {scoreData ? (
        <>
          {/* Score Display */}
          <div className="score-display">
            <div className="score-circle-container">
              <svg className="score-circle" viewBox="0 0 200 200">
                <circle
                  className="score-circle-bg"
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="15"
                />
                <circle
                  className={`score-circle-progress ${getScoreColor(scoreData.score)}`}
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  strokeWidth="15"
                  strokeDasharray={`${(scoreData.score / 850) * 534} 534`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="score-value">
                <span className={`score-number ${getScoreColor(scoreData.score)}`}>
                  {scoreData.score}
                </span>
                <span className="score-max">/ 850</span>
              </div>
            </div>
            <div className="score-info">
              <h2 className={`score-label ${getScoreColor(scoreData.score)}`}>
                {getScoreLabel(scoreData.score)}
              </h2>
              <p className="score-description">{getScoreDescription(scoreData.score)}</p>
              <p className="score-date">
                <i className="far fa-calendar"></i>
                Zuletzt berechnet: {formatDate(scoreData.calculated_at)}
              </p>
            </div>
          </div>

          {/* Score Range */}
          <div className="score-range">
            <h3>Kredit-Score Skala</h3>
            <div className="range-bar">
              <div className="range-segment poor">
                <span className="range-label">300-549</span>
                <span className="range-text">Schwach</span>
              </div>
              <div className="range-segment fair">
                <span className="range-label">550-649</span>
                <span className="range-text">Befriedigend</span>
              </div>
              <div className="range-segment good">
                <span className="range-label">650-749</span>
                <span className="range-text">Gut</span>
              </div>
              <div className="range-segment excellent">
                <span className="range-label">750-850</span>
                <span className="range-text">Ausgezeichnet</span>
              </div>
            </div>
            <div 
              className="score-indicator" 
              style={{ left: `${((scoreData.score - 300) / 550) * 100}%` }}
            >
              <i className="fas fa-caret-down"></i>
            </div>
          </div>

          {/* Score Factors */}
          <div className="score-factors">
            <h3>Score-Faktoren</h3>
            <p className="factors-description">
              Ihr Kredit-Score wird aus verschiedenen Faktoren berechnet. Hier sehen Sie, wie sich jeder Faktor auf Ihren Score auswirkt.
            </p>
            <div className="factors-grid">
              {scoreData.factors && Object.entries(scoreData.factors).map(([factor, value]) => (
                <div key={factor} className="factor-card">
                  <div className="factor-header">
                    <div className="factor-icon">
                      <i className={`fas ${getFactorIcon(factor)}`}></i>
                    </div>
                    <div className="factor-info">
                      <h4>{getFactorLabel(factor)}</h4>
                      <span className="factor-weight">Gewichtung: {getFactorWeight(factor)}</span>
                    </div>
                  </div>
                  <div className="factor-progress">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${value >= 80 ? 'excellent' : value >= 60 ? 'good' : value >= 40 ? 'fair' : 'poor'}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="progress-value">{value}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="improvement-section">
            <h3>
              <i className="fas fa-lightbulb"></i>
              Tipps zur Verbesserung Ihres Scores
            </h3>
            <div className="tips-grid">
              {getImprovementTips().map((tip, index) => (
                <div key={index} className="tip-card">
                  <div className="tip-icon">
                    <i className={`fas ${tip.icon}`}></i>
                  </div>
                  <h4>{tip.title}</h4>
                  <p>{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="info-box">
            <i className="fas fa-info-circle"></i>
            <div>
              <h4>Wichtige Hinweise</h4>
              <ul>
                <li>Ihr Kredit-Score wird regelmäßig aktualisiert basierend auf Ihren Finanzaktivitäten</li>
                <li>Verbesserungen des Scores können mehrere Monate dauern</li>
                <li>Ein höherer Score erhöht Ihre Chancen auf bessere Kreditkonditionen</li>
                <li>Überprüfen Sie Ihren Score regelmäßig, um Ihre Fortschritte zu verfolgen</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <i className="fas fa-chart-line"></i>
          <h3>Noch kein Kredit-Score berechnet</h3>
          <p>Klicken Sie auf "Score berechnen", um Ihre Kreditwürdigkeit zu ermitteln.</p>
          <button onClick={handleCalculate} className="btn btn-primary" disabled={calculating}>
            {calculating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Berechnung läuft...
              </>
            ) : (
              <>
                <i className="fas fa-calculator"></i>
                Jetzt berechnen
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreditScore;

// Made with Bob
