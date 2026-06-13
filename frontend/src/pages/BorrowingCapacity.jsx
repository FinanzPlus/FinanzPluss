import React, { useState } from 'react';
import './BorrowingCapacity.css';

const BorrowingCapacity = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: 3000,
    monthlyExpenses: 1500,
    existingLoans: 0,
    employmentType: 'permanent',
    dependents: 0,
    downPayment: 0
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateCapacity = () => {
    const { monthlyIncome, monthlyExpenses, existingLoans, employmentType, dependents, downPayment } = formData;

    // Calculate disposable income
    const disposableIncome = monthlyIncome - monthlyExpenses - existingLoans;

    // Maximum debt ratio (typically 33-40% of gross income)
    const maxDebtRatio = employmentType === 'permanent' ? 0.40 : 0.33;
    const maxMonthlyPayment = (monthlyIncome * maxDebtRatio) - existingLoans;

    // Adjust for dependents (reduce by 5% per dependent)
    const dependentAdjustment = 1 - (dependents * 0.05);
    const adjustedMaxPayment = maxMonthlyPayment * dependentAdjustment;

    // Calculate maximum loan amount (assuming 4% interest, 20 years)
    const interestRate = 0.04 / 12;
    const months = 240;
    const maxLoanAmount = adjustedMaxPayment * ((Math.pow(1 + interestRate, months) - 1) / (interestRate * Math.pow(1 + interestRate, months)));

    // Total purchasing power (loan + down payment)
    const totalCapacity = maxLoanAmount + downPayment;

    // Calculate recommended loan amount (80% of max for safety)
    const recommendedLoan = maxLoanAmount * 0.8;
    const recommendedCapacity = recommendedLoan + downPayment;

    // Risk assessment
    const debtToIncomeRatio = (adjustedMaxPayment / monthlyIncome) * 100;
    let riskLevel = 'low';
    let riskColor = 'success';
    if (debtToIncomeRatio > 35) {
      riskLevel = 'high';
      riskColor = 'danger';
    } else if (debtToIncomeRatio > 28) {
      riskLevel = 'medium';
      riskColor = 'warning';
    }

    setResult({
      disposableIncome: Math.round(disposableIncome),
      maxMonthlyPayment: Math.round(adjustedMaxPayment),
      maxLoanAmount: Math.round(maxLoanAmount),
      totalCapacity: Math.round(totalCapacity),
      recommendedLoan: Math.round(recommendedLoan),
      recommendedCapacity: Math.round(recommendedCapacity),
      debtToIncomeRatio: Math.round(debtToIncomeRatio * 10) / 10,
      riskLevel,
      riskColor
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskText = (level) => {
    const texts = {
      low: 'Niedriges Risiko - Gute Kreditwürdigkeit',
      medium: 'Mittleres Risiko - Akzeptable Kreditwürdigkeit',
      high: 'Hohes Risiko - Vorsicht geboten'
    };
    return texts[level] || '';
  };

  return (
    <div className="borrowing-capacity">
      <div className="capacity-header">
        <h1>Kreditfähigkeitsrechner</h1>
        <p className="header-subtitle">Ermitteln Sie Ihre maximale Kreditkapazität basierend auf Ihrem Einkommen</p>
      </div>

      <div className="capacity-container">
        {/* Input Form */}
        <div className="input-section">
          <h2>
            <i className="fas fa-edit"></i>
            Ihre Finanzdaten
          </h2>

          <div className="form-group">
            <label>
              Monatliches Nettoeinkommen
              <span className="input-display">{formatCurrency(formData.monthlyIncome)}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="15000"
              step="100"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>€1.000</span>
              <span>€15.000</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              Monatliche Ausgaben (Miete, Nebenkosten, Lebenshaltung)
              <span className="input-display">{formatCurrency(formData.monthlyExpenses)}</span>
            </label>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={formData.monthlyExpenses}
              onChange={(e) => handleInputChange('monthlyExpenses', Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>€500</span>
              <span>€10.000</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              Bestehende Kreditraten pro Monat
              <span className="input-display">{formatCurrency(formData.existingLoans)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={formData.existingLoans}
              onChange={(e) => handleInputChange('existingLoans', Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>€0</span>
              <span>€3.000</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              Eigenkapital / Anzahlung
              <span className="input-display">{formatCurrency(formData.downPayment)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={formData.downPayment}
              onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>€0</span>
              <span>€100.000</span>
            </div>
          </div>

          <div className="form-group">
            <label>Beschäftigungsart</label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              className="select-input"
            >
              <option value="permanent">Unbefristet angestellt</option>
              <option value="temporary">Befristet angestellt</option>
              <option value="self_employed">Selbstständig</option>
              <option value="civil_servant">Beamter</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Anzahl der Unterhaltsberechtigten
              <span className="input-display">{formData.dependents}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={formData.dependents}
              onChange={(e) => handleInputChange('dependents', Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>0</span>
              <span>5</span>
            </div>
          </div>

          <button onClick={calculateCapacity} className="btn btn-primary btn-large">
            <i className="fas fa-calculator"></i>
            Kreditfähigkeit berechnen
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="results-section">
            <h2>
              <i className="fas fa-chart-line"></i>
              Ihre Kreditkapazität
            </h2>

            {/* Main Result Card */}
            <div className="result-card main-result">
              <div className="result-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="result-content">
                <h3>Empfohlene Kreditkapazität</h3>
                <div className="result-amount">{formatCurrency(result.recommendedCapacity)}</div>
                <p className="result-note">Inkl. {formatCurrency(formData.downPayment)} Eigenkapital</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="results-grid">
              <div className="result-item">
                <div className="result-label">Verfügbares Einkommen</div>
                <div className="result-value">{formatCurrency(result.disposableIncome)}/Monat</div>
              </div>

              <div className="result-item">
                <div className="result-label">Max. monatliche Rate</div>
                <div className="result-value">{formatCurrency(result.maxMonthlyPayment)}/Monat</div>
              </div>

              <div className="result-item">
                <div className="result-label">Empfohlener Kreditbetrag</div>
                <div className="result-value">{formatCurrency(result.recommendedLoan)}</div>
              </div>

              <div className="result-item">
                <div className="result-label">Max. Kreditbetrag</div>
                <div className="result-value">{formatCurrency(result.maxLoanAmount)}</div>
              </div>

              <div className="result-item">
                <div className="result-label">Max. Kaufpreis</div>
                <div className="result-value">{formatCurrency(result.totalCapacity)}</div>
              </div>

              <div className="result-item">
                <div className="result-label">Verschuldungsgrad</div>
                <div className="result-value">{result.debtToIncomeRatio}%</div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className={`risk-assessment ${result.riskColor}`}>
              <div className="risk-icon">
                <i className={`fas ${result.riskColor === 'success' ? 'fa-check-circle' : result.riskColor === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'}`}></i>
              </div>
              <div className="risk-content">
                <h4>Risikobewertung</h4>
                <p>{getRiskText(result.riskLevel)}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations">
              <h3>
                <i className="fas fa-lightbulb"></i>
                Empfehlungen
              </h3>
              <ul>
                <li>
                  <i className="fas fa-check"></i>
                  Wir empfehlen einen Kreditbetrag von maximal {formatCurrency(result.recommendedLoan)} für eine sichere Finanzierung
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Ihre monatliche Rate sollte {formatCurrency(result.maxMonthlyPayment)} nicht überschreiten
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Ein höheres Eigenkapital verbessert Ihre Konditionen und reduziert die Zinskosten
                </li>
                {result.riskLevel === 'high' && (
                  <li className="warning-item">
                    <i className="fas fa-exclamation-triangle"></i>
                    Ihr Verschuldungsgrad ist hoch. Erwägen Sie, Ihre Ausgaben zu reduzieren oder mehr Eigenkapital einzubringen
                  </li>
                )}
              </ul>
            </div>

            {/* CTA */}
            <div className="cta-section">
              <p>Bereit für Ihre Kreditanfrage?</p>
              <button className="btn btn-primary btn-large">
                <i className="fas fa-paper-plane"></i>
                Jetzt Kreditanfrage stellen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="info-box">
        <i className="fas fa-info-circle"></i>
        <div>
          <h4>Wichtige Hinweise</h4>
          <ul>
            <li>Diese Berechnung dient nur zur Orientierung und stellt keine verbindliche Zusage dar</li>
            <li>Die tatsächliche Kreditkapazität hängt von Ihrer individuellen Bonität ab</li>
            <li>Banken prüfen zusätzlich Ihre Schufa-Auskunft und weitere Faktoren</li>
            <li>Ein Verschuldungsgrad über 40% gilt als kritisch</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BorrowingCapacity;

// Made with Bob
