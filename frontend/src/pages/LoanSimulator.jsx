import React, { useState, useEffect } from 'react';
import FinancialDisclaimer from '../components/common/FinancialDisclaimer';
import './LoanSimulator.css';

const LoanSimulator = () => {
  // Étapes du simulateur
  const [currentStep, setCurrentStep] = useState(1);
  
  // Données des banques partenaires autrichiennes avec leurs taux
  const banks = [
    {
      id: 1,
      name: 'Erste Bank',
      logo: '🏦',
      rate: 2.5,
      specialties: ['Immobilienfinanzierung', 'Wohnkredit', 'Baufinanzierung'],
      minAmount: 5000,
      maxAmount: 500000,
      minDuration: 12,
      maxDuration: 360,
      color: '#E2001A'
    },
    {
      id: 2,
      name: 'Raiffeisen Bank',
      logo: '🏛️',
      rate: 2.8,
      specialties: ['Unternehmenskredite', 'Geschäftskredite', 'Investitionsfinanzierung'],
      minAmount: 10000,
      maxAmount: 1000000,
      minDuration: 12,
      maxDuration: 240,
      color: '#FFED00'
    },
    {
      id: 3,
      name: 'Bank Austria',
      logo: '🏢',
      rate: 3.2,
      specialties: ['Privatkredit', 'Konsumkredit', 'Umschuldung'],
      minAmount: 1000,
      maxAmount: 75000,
      minDuration: 12,
      maxDuration: 120,
      color: '#E2001A'
    },
    {
      id: 4,
      name: 'BAWAG P.S.K.',
      logo: '💼',
      rate: 2.7,
      specialties: ['Privatkredit', 'Konsumkredit', 'Umschuldung'],
      minAmount: 3000,
      maxAmount: 100000,
      minDuration: 12,
      maxDuration: 84,
      color: '#005CA9'
    },
    {
      id: 5,
      name: 'Volksbank',
      logo: '🏢',
      rate: 2.4,
      specialties: ['Unternehmenskredit', 'Investitionskredit', 'Betriebsmittel'],
      minAmount: 10000,
      maxAmount: 400000,
      minDuration: 60,
      maxDuration: 360,
      color: '#009640'
    }
  ];

  // Objets de prêt
  const loanPurposes = [
    { value: 'immobilien', label: 'Immobilienfinanzierung' },
    { value: 'auto', label: 'Autokredit' },
    { value: 'renovation', label: 'Renovierung' },
    { value: 'personal', label: 'Privatkredit' },
    { value: 'business', label: 'Geschäftskredit' },
    { value: 'other', label: 'Sonstiges' }
  ];

  // États du formulaire
  const [selectedBank, setSelectedBank] = useState(null);
  const [formData, setFormData] = useState({
    amount: 25000,
    duration: 60,
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

  // Calcul automatique quand les paramètres changent
  useEffect(() => {
    if (selectedBank) {
      calculateLoan();
    }
  }, [formData.amount, formData.duration, selectedBank]);

  // Sélection d'une banque
  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    // Ajuster les limites si nécessaire
    if (formData.amount < bank.minAmount) {
      setFormData(prev => ({ ...prev, amount: bank.minAmount }));
    }
    if (formData.amount > bank.maxAmount) {
      setFormData(prev => ({ ...prev, amount: bank.maxAmount }));
    }
    if (formData.duration < bank.minDuration) {
      setFormData(prev => ({ ...prev, duration: bank.minDuration }));
    }
    if (formData.duration > bank.maxDuration) {
      setFormData(prev => ({ ...prev, duration: bank.maxDuration }));
    }
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'duration' ? parseFloat(value) || 0 : value
    }));
  };

  // Calcul du prêt avec formule financière
  const calculateLoan = () => {
    if (!selectedBank) return;

    const { amount, duration } = formData;
    const annualRate = selectedBank.rate;
    
    // Formule: M = P × (r/12) / (1 - (1 + r/12)^(-n))
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = duration;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = amount / numberOfPayments;
    } else {
      monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    }
    
    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - amount;
    
    // Tableau d'amortissement
    const table = [];
    let remainingBalance = amount;
    
    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      if (month === numberOfPayments) {
        remainingBalance = 0;
      }
      
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
      effectiveRate: annualRate.toFixed(2)
    });
    
    setAmortizationTable(table);
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
            <div class="summary-item"><strong>Bank:</strong><span>${selectedBank.name}</span></div>
            <div class="summary-item"><strong>Kreditbetrag:</strong><span>€ ${formData.amount.toLocaleString('de-AT')}</span></div>
            <div class="summary-item"><strong>Laufzeit:</strong><span>${formData.duration} Monate</span></div>
            <div class="summary-item"><strong>Verwendungszweck:</strong><span>${purposeLabel}</span></div>
            <div class="summary-item"><strong>Zinssatz:</strong><span>${selectedBank.rate}% p.a.</span></div>
            <div class="summary-item"><strong>Monatliche Rate:</strong><span>€ ${results.monthlyPayment}</span></div>
            <div class="summary-item"><strong>Gesamtbetrag:</strong><span>€ ${results.totalAmount}</span></div>
            <div class="summary-item"><strong>Gesamtzinsen:</strong><span>€ ${results.totalInterest}</span></div>
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
          <p style="margin-top: 10px; font-style: italic;">Dies ist eine unverbindliche Berechnung. Die tatsächlichen Konditionen können abweichen.</p>
        </div>
        
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Envoi de la demande de prêt avec sauvegarde et email automatique
  const handleWhatsAppSubmit = async () => {
    if (!selectedBank || !results) {
      alert('Bitte wählen Sie zuerst eine Bank und berechnen Sie Ihren Kredit.');
      return;
    }

    // Validation des champs personnels
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Bitte füllen Sie alle persönlichen Informationen aus.');
      return;
    }

    const purposeLabel = loanPurposes.find(p => p.value === formData.purpose)?.label || formData.purpose;

    try {
      // ÉTAPE 1 & 2: Sauvegarder dans la base de données et envoyer l'email automatique
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/loans/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          duration: formData.duration,
          purpose: purposeLabel,
          selectedBank: {
            name: selectedBank.name,
            rate: selectedBank.rate
          },
          monthlyPayment: parseFloat(results.monthlyPayment),
          totalAmount: parseFloat(results.totalAmount)
        })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden der Anfrage');
      }

      const data = await response.json();
      console.log('✅ Demande sauvegardée et email envoyé:', data);

      // Afficher un message de confirmation
      alert('✅ Ihre Anfrage wurde erfolgreich gespeichert!\n\nSie erhalten in Kürze eine Bestätigungs-E-Mail.\n\nSie werden jetzt zu WhatsApp weitergeleitet.');

      // ÉTAPE 3: Redirection vers WhatsApp
      const message = `Guten Tag, ich heiße ${formData.firstName} ${formData.lastName}, ich möchte einen Kredit von ${formData.amount.toLocaleString('de-AT')}€ für ${formData.duration} Monate bei ${selectedBank.name} beantragen. Zinssatz: ${selectedBank.rate}%. Monatliche Rate: ${results.monthlyPayment}€. Zweck: ${purposeLabel}. Email: ${formData.email}. Tel: ${formData.phone}`;
      
      const whatsappNumber = '4915565236794';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Ouverture dans un nouvel onglet
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      alert('⚠️ Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per WhatsApp.');
      
      // En cas d'erreur, rediriger quand même vers WhatsApp
      const message = `Guten Tag, ich heiße ${formData.firstName} ${formData.lastName}, ich möchte einen Kredit von ${formData.amount.toLocaleString('de-AT')}€ für ${formData.duration} Monate bei ${selectedBank.name} beantragen. Zinssatz: ${selectedBank.rate}%. Monatliche Rate: ${results.monthlyPayment}€. Zweck: ${purposeLabel}. Email: ${formData.email}. Tel: ${formData.phone}`;
      
      const whatsappNumber = '4915565236794';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Navigation entre étapes
  const goToNextStep = () => {
    if (currentStep === 1 && !selectedBank) {
      alert('Bitte wählen Sie zuerst eine Bank aus.');
      return;
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
              <div className="step-label">Bank wählen</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Kredit berechnen</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Antrag stellen</div>
            </div>
          </div>
        </div>
      
      {/* Avertissement financier obligatoire */}
      <FinancialDisclaimer />
      </section>

      {/* Contenu principal */}
      <section className="simulator-content">
        <div className="container">
          
          {/* ÉTAPE 1 : Sélection de la banque */}
          {currentStep === 1 && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Schritt 1: Wählen Sie Ihre Bank</h2>
              <p className="step-description">
                Jede Bank bietet unterschiedliche Zinssätze und Konditionen. Wählen Sie die Bank, die am besten zu Ihnen passt.
              </p>
              
              <div className="banks-grid">
                {banks.map(bank => (
                  <div
                    key={bank.id}
                    className={`bank-card ${selectedBank?.id === bank.id ? 'selected' : ''}`}
                    onClick={() => handleBankSelect(bank)}
                  >
                    <div className="bank-badge">Offizieller Partner</div>
                    <div className="bank-logo" style={{ color: bank.color }}>
                      {bank.logo}
                    </div>
                    <h3 className="bank-name">{bank.name}</h3>
                    <div className="bank-rate">
                      <span className="rate-label">Zinssatz ab</span>
                      <span className="rate-value">{bank.rate}% p.a.</span>
                    </div>
                    <div className="bank-specialties">
                      {bank.specialties.map((specialty, idx) => (
                        <span key={idx} className="specialty-tag">{specialty}</span>
                      ))}
                    </div>
                    <div className="bank-limits">
                      <div className="limit-item">
                        <span>💰</span>
                        <span>{(bank.minAmount / 1000).toFixed(0)}K - {(bank.maxAmount / 1000).toFixed(0)}K €</span>
                      </div>
                      <div className="limit-item">
                        <span>📅</span>
                        <span>{bank.minDuration} - {bank.maxDuration} Monate</span>
                      </div>
                    </div>
                    {selectedBank?.id === bank.id && (
                      <div className="selected-indicator">✓ Ausgewählt</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="step-actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={goToNextStep}
                  disabled={!selectedBank}
                >
                  Weiter zu Schritt 2 →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Paramètres du prêt */}
          {currentStep === 2 && selectedBank && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Schritt 2: Kreditdetails eingeben</h2>
              <p className="step-description">
                Ausgewählte Bank: <strong>{selectedBank.name}</strong> | Zinssatz: <strong>{selectedBank.rate}% p.a.</strong>
              </p>

              <div className="simulator-grid">
                {/* Formulaire */}
                <div className="simulator-form-card">
                  <h3>Parameter anpassen</h3>
                  
                  <div className="form-group">
                    <label htmlFor="amount">
                      Kreditbetrag
                      <span className="label-value">€ {formData.amount.toLocaleString('de-AT')}</span>
                    </label>
                    <input
                      type="range"
                      id="amount"
                      name="amount"
                      min={selectedBank.minAmount}
                      max={selectedBank.maxAmount}
                      step="1000"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="range-input"
                    />
                    <div className="range-labels">
                      <span>€ {selectedBank.minAmount.toLocaleString('de-AT')}</span>
                      <span>€ {selectedBank.maxAmount.toLocaleString('de-AT')}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">
                      Laufzeit
                      <span className="label-value">{formData.duration} Monate ({(formData.duration / 12).toFixed(1)} Jahre)</span>
                    </label>
                    <input
                      type="range"
                      id="duration"
                      name="duration"
                      min={selectedBank.minDuration}
                      max={selectedBank.maxDuration}
                      step="6"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="range-input"
                    />
                    <div className="range-labels">
                      <span>{selectedBank.minDuration} Monate</span>
                      <span>{selectedBank.maxDuration} Monate</span>
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

                  <div className="form-group">
                    <label>
                      Zinssatz (gemäß {selectedBank.name})
                      <span className="label-value locked">🔒 {selectedBank.rate}% p.a.</span>
                    </label>
                    <div className="locked-info">
                      <span className="info-icon">ℹ️</span>
                      <span>Der Zinssatz ist von der gewählten Bank festgelegt</span>
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
                            <div className="result-item-label">Effektivzins</div>
                            <div className="result-item-value">{results.effectiveRate}%</div>
                          </div>
                        </div>

                        <div className="result-item">
                          <span className="result-icon">🏦</span>
                          <div>
                            <div className="result-item-label">Bank</div>
                            <div className="result-item-value">{selectedBank.name}</div>
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
                <button className="btn btn-outline" onClick={goToPreviousStep}>
                  ← Zurück
                </button>
                <button className="btn btn-primary btn-lg" onClick={goToNextStep}>
                  Weiter zu Schritt 3 →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Informations personnelles et envoi WhatsApp */}
          {currentStep === 3 && selectedBank && results && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Schritt 3: Persönliche Informationen</h2>
              <p className="step-description">
                Füllen Sie Ihre Daten aus und senden Sie Ihre Anfrage direkt per WhatsApp
              </p>

              <div className="final-step-grid">
                {/* Formulaire personnel */}
                <div className="personal-info-card">
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
                    <p>Ihre Daten werden sicher übertragen und nicht gespeichert</p>
                  </div>
                </div>

                {/* Récapitulatif */}
                <div className="summary-card">
                  <h3>Zusammenfassung</h3>
                  
                  <div className="summary-section">
                    <h4>Gewählte Bank</h4>
                    <div className="summary-bank">
                      <span className="bank-logo-small">{selectedBank.logo}</span>
                      <div>
                        <div className="bank-name-small">{selectedBank.name}</div>
                        <div className="bank-rate-small">{selectedBank.rate}% p.a.</div>
                      </div>
                    </div>
                  </div>

                  <div className="summary-section">
                    <h4>Kreditdetails</h4>
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
                        <strong>{selectedBank.rate}% p.a.</strong>
                      </div>
                    </div>
                  </div>

                  <div className="summary-section highlight">
                    <h4>Ihre monatliche Rate</h4>
                    <div className="summary-monthly">€ {results.monthlyPayment}</div>
                  </div>

                  <div className="summary-section">
                    <div className="summary-row">
                      <span>Gesamtbetrag:</span>
                      <strong>€ {results.totalAmount}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Gesamtzinsen:</span>
                      <strong>€ {results.totalInterest}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-outline" onClick={goToPreviousStep}>
                  ← Zurück
                </button>
                <button
                  className="btn btn-whatsapp btn-lg"
                  onClick={handleWhatsAppSubmit}
                >
                  💬 Antrag per WhatsApp absenden
                </button>
              </div>

              <div className="whatsapp-info">
                <p>
                  <strong>Was passiert als Nächstes?</strong><br />
                  Nach dem Klick öffnet sich WhatsApp mit einer vorausgefüllten Nachricht. 
                  Sie können die Nachricht noch anpassen und dann direkt an unsere Berater senden. 
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

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
