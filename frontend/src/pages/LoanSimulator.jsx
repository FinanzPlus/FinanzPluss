import React, { useState, useEffect } from 'react';
import FinancialDisclaimer from '../components/common/FinancialDisclaimer';
import './LoanSimulator.css';

const FIXED_RATE = 2.8; // Taux d'intérêt fixe en %

const LoanSimulator = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Objets de prêt
  const loanPurposes = [
    { value: 'immobilien', label: 'Immobilienfinanzierung' },
    { value: 'auto', label: 'Autokredit' },
    { value: 'renovation', label: 'Renovierung' },
    { value: 'personal', label: 'Privatkredit' },
    { value: 'business', label: 'Geschäftskredit' },
    { value: 'other', label: 'Sonstiges' }
  ];

  // Valeurs saisies (strings pour permettre champ vide)
  const [amountInput, setAmountInput] = useState('');
  const [durationInput, setDurationInput] = useState('');

  // Autres données du formulaire
  const [formData, setFormData] = useState({
    amount: 0,
    duration: 0,
    purpose: 'personal',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Résultats du calcul
  const [results, setResults] = useState(null);
  const [amortizationTable, setAmortizationTable] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // Recalcul automatique dès que montant ou durée change
  useEffect(() => {
    const amount = parseFloat(amountInput);
    const duration = parseInt(durationInput);
    if (amount > 0 && duration > 0) {
      setFormData(prev => ({ ...prev, amount, duration }));
      computeLoan(amount, duration);
    } else {
      setResults(null);
      setAmortizationTable([]);
    }
  }, [amountInput, durationInput]);

  // Gestion des changements texte (nom, email, tel, objet)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calcul du prêt avec taux fixe 2.8%
  // M = (Capital × 0,028/12) / (1 - (1 + 0,028/12)^-Durée)
  const computeLoan = (amount, duration) => {
    const monthlyRate = FIXED_RATE / 100 / 12;

    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
    const totalAmount = monthlyPayment * duration;
    const totalInterest = totalAmount - amount;

    // Tableau d'amortissement
    const table = [];
    let remainingBalance = amount;

    for (let month = 1; month <= duration; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      if (month === duration) remainingBalance = 0;

      table.push({
        month,
        monthlyPayment: monthlyPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        remainingBalance: Math.max(0, remainingBalance).toFixed(2)
      });
    }

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      effectiveRate: FIXED_RATE.toFixed(2)
    });

    setAmortizationTable(table);
  };

  // Alias pour garder la compatibilité avec exportToPDF
  const calculateLoan = () => {
    const amount = parseFloat(amountInput);
    const duration = parseInt(durationInput);
    if (amount > 0 && duration > 0) computeLoan(amount, duration);
  };

  // Export PDF
  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    const purposeLabel = loanPurposes.find(p => p.value === formData.purpose)?.label || formData.purpose;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Tilgungsplan - FinanzPlus Austria</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #0A1628; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #C9A84C; padding-bottom: 20px; }
          .header h1 { color: #0A1628; margin: 0; font-size: 28px; }
          .header p { color: #C9A84C; margin: 5px 0 0 0; font-size: 16px; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .summary-item { display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 4px; }
          .summary-item strong { color: #0A1628; }
          .summary-item span { color: #C9A84C; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #0A1628; color: white; padding: 12px; text-align: left; font-weight: 600; }
          td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
          tr:nth-child(even) { background: #f8f9fa; }
          tr:hover { background: #fff8e1; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏦 FinanzPlus Austria</h1>
          <p>Tilgungsplan - Kreditberechnung</p>
        </div>
        
        <div class="summary">
          <h2 style="margin-top: 0; color: #0A1628;">Kreditdetails</h2>
          <div class="summary-grid">
            <div class="summary-item"><strong>Kreditbetrag:</strong><span>€ ${formData.amount.toLocaleString('de-AT')}</span></div>
            <div class="summary-item"><strong>Laufzeit:</strong><span>${formData.duration} Monate</span></div>
            <div class="summary-item"><strong>Verwendungszweck:</strong><span>${purposeLabel}</span></div>
            <div class="summary-item"><strong>Zinssatz:</strong><span>2,8% fest</span></div>
            <div class="summary-item"><strong>Monatliche Rate:</strong><span>€ ${results?.monthlyPayment}</span></div>
            <div class="summary-item"><strong>Gesamtbetrag:</strong><span>€ ${results?.totalAmount}</span></div>
            <div class="summary-item"><strong>Gesamtzinsen:</strong><span>€ ${results?.totalInterest}</span></div>
          </div>
        </div>
        
        <h2 style="color: #0A1628;">Tilgungsplan</h2>
        <table>
          <thead>
            <tr>
              <th>Monat</th>
              <th>Rate</th>
              <th>Tilgung</th>
              <th>Zinsen</th>
              <th>Restschuld</th>
            </tr>
          </thead>
          <tbody>
            ${amortizationTable.map(row => `
              <tr>
                <td>${row.month}</td>
                <td>€ ${row.monthlyPayment}</td>
                <td>€ ${row.principalPayment}</td>
                <td>€ ${row.interestPayment}</td>
                <td>€ ${row.remainingBalance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p><strong>FinanzPlus Austria GmbH</strong></p>
          <p>Stephansplatz 1, 1010 Wien | Tel: +49 155 65236794 | Email: Kontakt_finanzplusaustria@proton.me</p>
          <p>Erstellt am: ${new Date().toLocaleDateString('de-AT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin-top: 10px; font-style: italic;">Dies ist eine unverbindliche Berechnung. Zinssatz: 2,8% fest.</p>
        </div>
        
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Envoi de la demande via WhatsApp
  const handleWhatsAppSubmit = async () => {
    if (!results) return;

    // Validation des champs personnels
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Bitte füllen Sie alle persönlichen Informationen aus.');
      return;
    }

    const purposeLabel = loanPurposes.find(p => p.value === formData.purpose)?.label || formData.purpose;

    // Message WhatsApp avec taux fixe 2,8%
    const message = `Guten Tag, ich heiße ${formData.firstName} ${formData.lastName}, ich möchte einen Kredit von ${formData.amount.toLocaleString('de-AT')}€ für ${formData.duration} Monate beantragen. Zinssatz: 2,8%. Monatliche Rate: ${results.monthlyPayment}€. Zweck: ${purposeLabel}. Email: ${formData.email}. Tel: ${formData.phone}`;
    const whatsappNumber = '4915565236794';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    try {
      const apiUrl = import.meta.env.VITE_API_URL ||
                     window.location.origin.replace('finanzplus-frontend', 'finanzplus-backend').replace(':3000', ':5000') ||
                     'https://finanzplus-backend.up.railway.app';

      const response = await fetch(`${apiUrl}/api/loans/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          duration: formData.duration,
          purpose: purposeLabel,
          interestRate: FIXED_RATE,
          monthlyPayment: parseFloat(results.monthlyPayment),
          totalAmount: parseFloat(results.totalAmount)
        })
      });

      if (response.ok) {
        alert('✅ Ihre Anfrage wurde erfolgreich gespeichert!\n\n📧 Sie erhalten in Kürze eine Bestätigungs-E-Mail.\n\n💬 Sie werden jetzt zu WhatsApp weitergeleitet.');
      } else {
        throw new Error('API Fehler');
      }
    } catch (error) {
      alert(`⚠️ Hinweis: Die E-Mail-Benachrichtigung konnte nicht gesendet werden.\n\nSie werden trotzdem zu WhatsApp weitergeleitet.`);
    }

    window.open(whatsappUrl, '_blank');
  };

  // État de l'envoi email
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | sending | sent | error

  // Envoi email via le backend (Resend) → arrive directement dans la boîte
  const handleEmailSubmit = async () => {
    const purposeLabel = loanPurposes.find(p => p.value === formData.purpose)?.label || formData.purpose;

    setEmailStatus('sending');

    try {
      const apiUrl = import.meta.env.VITE_API_URL ||
                     window.location.origin.replace('finanzplus-frontend', 'finanzplus-backend').replace(':3000', ':5000') ||
                     'https://finanzplus-backend.up.railway.app';

      const response = await fetch(`${apiUrl}/api/loans/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          duration: formData.duration,
          purpose: purposeLabel,
          interestRate: FIXED_RATE,
          monthlyPayment: parseFloat(results?.monthlyPayment),
          totalAmount: parseFloat(results?.totalAmount)
        })
      });

      if (response.ok) {
        setEmailStatus('sent');
      } else {
        throw new Error('API Fehler');
      }
    } catch (error) {
      setEmailStatus('error');
    }
  };

  // Navigation entre étapes avec validation complète
  const goToNextStep = () => {

    // Étape 1 : montant et durée obligatoires
    if (currentStep === 1) {
      const amount = parseFloat(amountInput);
      const duration = parseInt(durationInput);
      if (!amountInput || !durationInput) {
        alert('Bitte füllen Sie Betrag und Laufzeit aus.');
        return;
      }
      if (isNaN(amount) || amount <= 0) {
        alert('Bitte geben Sie einen gültigen Kreditbetrag ein (z.B. 25000).');
        return;
      }
      if (isNaN(duration) || duration <= 0) {
        alert('Bitte geben Sie eine gültige Laufzeit in Monaten ein (z.B. 60).');
        return;
      }
    }

    // Étape 2 : prénom, nom, email, téléphone obligatoires
    if (currentStep === 2) {
      const { firstName, lastName, email, phone } = formData;
      if (!firstName.trim()) {
        alert('Bitte geben Sie Ihren Vornamen ein.');
        return;
      }
      if (!lastName.trim()) {
        alert('Bitte geben Sie Ihren Nachnamen ein.');
        return;
      }
      if (!email.trim()) {
        alert('Bitte geben Sie Ihre E-Mail-Adresse ein.');
        return;
      }
      // Validation format email basique
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return;
      }
      if (!phone.trim()) {
        alert('Bitte geben Sie Ihre Telefonnummer ein.');
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="loan-simulator">
      {/* Hero Section */}
      <section className="simulator-hero">
        <div className="container">
          <h1>🧮 Kreditrechner</h1>
          <p className="hero-subtitle">
            In 3 einfachen Schritten zu Ihrem Wunschkredit
          </p>

          {/* Indicateur d'étapes */}
          <div className="steps-indicator">
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Betrag & Laufzeit</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Ihre Daten</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Zusammenfassung</div>
            </div>
          </div>
        </div>

        {/* Avertissement financier obligatoire */}
        <FinancialDisclaimer />
      </section>

      {/* Contenu principal */}
      <section className="simulator-content">
        <div className="container">

          {/* ÉTAPE 1 : Montant et durée */}
          {currentStep === 1 && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Schritt 1: Betrag und Laufzeit</h2>
              <p className="step-description">
                Geben Sie Ihren Wunschbetrag und die gewünschte Laufzeit ein.
              </p>

              <div className="simulator-grid">
                {/* Formulaire */}
                <div className="simulator-form-card">
                  <h3>Parameter eingeben</h3>

                  <div className="form-group">
                    <label htmlFor="amount">Kreditbetrag (€)</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        className="text-input"
                        placeholder="z.B. 25000"
                        min="1"
                      />
                      <span className="input-suffix">€</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Laufzeit (Monate)</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={durationInput}
                        onChange={(e) => setDurationInput(e.target.value)}
                        className="text-input"
                        placeholder="z.B. 60"
                        min="1"
                      />
                      <span className="input-suffix">Monate</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="purpose">Verwendungszweck</label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="select-input"
                    >
                      {loanPurposes.map(purpose => (
                        <option key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Taux fixe affiché en lecture seule */}
                  <div className="form-group">
                    <label>Zinssatz</label>
                    <div className="fixed-rate-display">
                      🔒 <strong>Zinssatz: 2,8% fest</strong>
                    </div>
                    <div className="locked-info">
                      <span className="info-icon">ℹ️</span>
                      <span>Ihr fester Zinssatz – keine Überraschungen</span>
                    </div>
                  </div>
                </div>

                {/* Résultats */}
                <div className="simulator-results-card">
                  <h3>Ihre Kreditberechnung</h3>

                  {results && (
                    <>
                      <div className="result-highlight">
                        <div className="result-label">Monatliche Rate</div>
                        <div className="result-value">€ {results.monthlyPayment}</div>
                        <div className="result-note">für {formData.duration} Monate</div>
                      </div>

                      <div className="results-grid">
                        <div className="result-item">
                          <span className="result-icon">💰</span>
                          <div>
                            <div className="result-item-label">Gesamtbetrag</div>
                            <div className="result-item-value">€ {results.totalAmount}</div>
                          </div>
                        </div>

                        <div className="result-item">
                          <span className="result-icon">📊</span>
                          <div>
                            <div className="result-item-label">Gesamtzinsen</div>
                            <div className="result-item-value">€ {results.totalInterest}</div>
                          </div>
                        </div>

                        <div className="result-item">
                          <span className="result-icon">📈</span>
                          <div>
                            <div className="result-item-label">Zinssatz</div>
                            <div className="result-item-value">2,8% fest</div>
                          </div>
                        </div>

                        <div className="result-item">
                          <span className="result-icon">📅</span>
                          <div>
                            <div className="result-item-label">Laufzeit</div>
                            <div className="result-item-value">{formData.duration} Monate</div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline btn-block"
                        onClick={() => setShowTable(!showTable)}
                      >
                        {showTable ? '📋 Tilgungsplan ausblenden' : '📋 Tilgungsplan anzeigen'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tableau d'amortissement */}
              {showTable && amortizationTable.length > 0 && (
                <div className="amortization-section animate-fade-in">
                  <div className="amortization-header">
                    <h3>📋 Detaillierter Tilgungsplan</h3>
                    <button className="btn btn-outline" onClick={exportToPDF}>
                      📄 Als PDF exportieren
                    </button>
                  </div>

                  <div className="table-container">
                    <table className="amortization-table">
                      <thead>
                        <tr>
                          <th>Monat</th>
                          <th>Rate</th>
                          <th>Tilgung</th>
                          <th>Zinsen</th>
                          <th>Restschuld</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationTable.map((row, index) => (
                          <tr key={index}>
                            <td>{row.month}</td>
                            <td>€ {row.monthlyPayment}</td>
                            <td>€ {row.principalPayment}</td>
                            <td>€ {row.interestPayment}</td>
                            <td>€ {row.remainingBalance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="step-actions">
                <button className="btn btn-primary btn-lg" onClick={goToNextStep}>
                  Weiter zu Schritt 2 →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Informations personnelles */}
          {currentStep === 2 && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Schritt 2: Persönliche Informationen</h2>
              <p className="step-description">
                Geben Sie Ihre Kontaktdaten ein, damit wir Sie persönlich beraten können.
              </p>

              <div className="personal-info-card" style={{ maxWidth: '540px', margin: '0 auto' }}>
                <h3>Ihre Kontaktdaten</h3>

                <div className="form-group">
                  <label htmlFor="firstName">Vorname *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="text-input"
                    placeholder="Max"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Nachname *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="text-input"
                    placeholder="Mustermann"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-Mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="text-input"
                    placeholder="max.mustermann@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-input"
                    placeholder="+43 664 123 4567"
                    required
                  />
                </div>

                <div className="info-box">
                  <span className="info-icon">🔒</span>
                  <p>Ihre Daten werden sicher übertragen und nicht an Dritte weitergegeben</p>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-outline" onClick={goToPreviousStep}>
                  ← Zurück
                </button>
                <button className="btn btn-primary btn-lg" onClick={goToNextStep}>
                  Weiter zu Schritt 3 →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Récapitulatif et choix du canal de contact */}
          {currentStep === 3 && results && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Schritt 3: Zusammenfassung</h2>
              <p className="step-description">
                Überprüfen Sie Ihre Daten und wählen Sie, wie Sie uns kontaktieren möchten.
              </p>

              <div className="summary-card" style={{ maxWidth: '560px', margin: '0 auto' }}>
                <h3>Kreditdetails</h3>

                <div className="summary-items">
                  <div className="summary-row">
                    <span>Kreditbetrag:</span>
                    <strong>€ {formData.amount.toLocaleString('de-AT')}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Laufzeit:</span>
                    <strong>{formData.duration} Monate</strong>
                  </div>
                  <div className="summary-row">
                    <span>Verwendungszweck:</span>
                    <strong>{loanPurposes.find(p => p.value === formData.purpose)?.label}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Zinssatz:</span>
                    <strong>2,8% fest 🔒</strong>
                  </div>
                </div>

                <div className="summary-section highlight" style={{ marginTop: '16px' }}>
                  <h4>Ihre monatliche Rate</h4>
                  <div className="summary-monthly">€ {results.monthlyPayment}</div>
                </div>

                <div className="summary-items" style={{ marginTop: '16px' }}>
                  <div className="summary-row">
                    <span>Gesamtbetrag:</span>
                    <strong>€ {results.totalAmount}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Gesamtzinsen:</span>
                    <strong>€ {results.totalInterest}</strong>
                  </div>
                </div>

                <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />

                <h3>Ihre Kontaktdaten</h3>
                <div className="summary-items">
                  <div className="summary-row">
                    <span>Name:</span>
                    <strong>{formData.firstName} {formData.lastName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>E-Mail:</span>
                    <strong>{formData.email}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Telefon:</span>
                    <strong>{formData.phone}</strong>
                  </div>
                </div>
              </div>

              {/* Choix du canal de contact */}
              <div className="contact-choice-section">
                <h3 className="contact-choice-title">Wie möchten Sie uns kontaktieren?</h3>
                <div className="contact-choice-grid">

                  {/* Option WhatsApp */}
                  <div className="contact-choice-card">
                    <div className="contact-choice-icon whatsapp-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <h4>WhatsApp</h4>
                    <p>Sofortige Antwort – direkte Verbindung mit unserem Team</p>
                    <button
                      className="btn btn-whatsapp btn-lg contact-choice-btn"
                      onClick={handleWhatsAppSubmit}
                    >
                      💬 Per WhatsApp senden
                    </button>
                  </div>

                  {/* Option Email */}
                  <div className={`contact-choice-card ${emailStatus === 'sent' ? 'card-success' : ''}`}>
                    <div className={`contact-choice-icon email-icon ${emailStatus === 'sent' ? 'icon-success' : ''}`}>
                      {emailStatus === 'sent' ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      )}
                    </div>
                    <h4>E-Mail</h4>

                    {emailStatus === 'sent' ? (
                      <>
                        <p className="status-success-text">✅ Anfrage erfolgreich gesendet!<br />Wir melden uns bald bei Ihnen.</p>
                      </>
                    ) : emailStatus === 'error' ? (
                      <>
                        <p className="status-error-text">❌ Fehler beim Senden. Bitte versuchen Sie es erneut.</p>
                        <button
                          className="btn btn-primary btn-lg contact-choice-btn"
                          onClick={handleEmailSubmit}
                        >
                          🔄 Erneut versuchen
                        </button>
                      </>
                    ) : (
                      <>
                        <p>Ihre Anfrage wird direkt an unser Team gesendet – Antwort innerhalb von 24 Stunden</p>
                        <button
                          className="btn btn-primary btn-lg contact-choice-btn"
                          onClick={handleEmailSubmit}
                          disabled={emailStatus === 'sending'}
                        >
                          {emailStatus === 'sending' ? '⏳ Wird gesendet...' : '✉️ Per E-Mail senden'}
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>

              <div className="step-actions" style={{ justifyContent: 'flex-start', marginTop: '16px' }}>
                <button className="btn btn-outline" onClick={goToPreviousStep}>
                  ← Zurück
                </button>
              </div>

              <div className="whatsapp-info">
                <p>
                  <strong>Was passiert als Nächstes?</strong><br />
                  Wählen Sie WhatsApp für eine sofortige Antwort oder E-Mail für eine detaillierte Bearbeitung.
                  Wir melden uns innerhalb von 24 Stunden bei Ihnen!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LoanSimulator;
