/**
 * Calculateur de Prêt - FinanzPlus Austria
 * Formules financières pour le calcul des mensualités et tableaux d'amortissement
 */

class LoanCalculator {
  /**
   * Calculer la mensualité d'un prêt
   * Formule: M = P * (r/12) / (1 - (1 + r/12)^(-n))
   * 
   * @param {number} principal - Montant du prêt (capital)
   * @param {number} annualRate - Taux d'intérêt annuel (en pourcentage, ex: 3 pour 3%)
   * @param {number} months - Durée en mois
   * @returns {number} Mensualité arrondie à 2 décimales
   */
  static calculateMonthlyPayment(principal, annualRate, months) {
    // Convertir le taux annuel en taux mensuel décimal
    const monthlyRate = (annualRate / 100) / 12;
    
    // Si le taux est 0, calcul simple
    if (monthlyRate === 0) {
      return Math.round((principal / months) * 100) / 100;
    }

    // Formule de calcul de la mensualité
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(monthlyPayment * 100) / 100;
  }

  /**
   * Calculer le coût total du prêt
   * 
   * @param {number} monthlyPayment - Mensualité
   * @param {number} months - Durée en mois
   * @returns {number} Coût total arrondi à 2 décimales
   */
  static calculateTotalAmount(monthlyPayment, months) {
    return Math.round(monthlyPayment * months * 100) / 100;
  }

  /**
   * Calculer les intérêts totaux
   * 
   * @param {number} totalAmount - Coût total
   * @param {number} principal - Capital emprunté
   * @returns {number} Intérêts totaux arrondis à 2 décimales
   */
  static calculateTotalInterest(totalAmount, principal) {
    return Math.round((totalAmount - principal) * 100) / 100;
  }

  /**
   * Générer le tableau d'amortissement complet
   * 
   * @param {number} principal - Montant du prêt
   * @param {number} annualRate - Taux d'intérêt annuel (%)
   * @param {number} months - Durée en mois
   * @param {number} monthlyPayment - Mensualité (optionnel, sera calculée si non fournie)
   * @returns {Array} Tableau d'amortissement mois par mois
   */
  static generateAmortizationTable(principal, annualRate, months, monthlyPayment = null) {
    // Calculer la mensualité si non fournie
    if (!monthlyPayment) {
      monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, months);
    }

    const monthlyRate = (annualRate / 100) / 12;
    let balance = principal;
    const table = [];

    for (let month = 1; month <= months; month++) {
      // Calculer les intérêts du mois
      const interestPayment = Math.round(balance * monthlyRate * 100) / 100;
      
      // Calculer le capital remboursé
      let principalPayment = Math.round((monthlyPayment - interestPayment) * 100) / 100;
      
      // Ajuster le dernier mois pour éviter les erreurs d'arrondi
      if (month === months) {
        principalPayment = balance;
        monthlyPayment = Math.round((principalPayment + interestPayment) * 100) / 100;
      }

      // Nouveau solde
      balance = Math.round((balance - principalPayment) * 100) / 100;
      
      // Éviter les soldes négatifs dus aux arrondis
      if (balance < 0) balance = 0;

      table.push({
        month: month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }

    return table;
  }

  /**
   * Calculer la capacité d'emprunt
   * Basé sur le taux d'endettement maximum (33%)
   * 
   * @param {number} monthlyIncome - Revenus mensuels nets
   * @param {number} monthlyExpenses - Charges mensuelles
   * @param {number} months - Durée souhaitée en mois
   * @param {number} annualRate - Taux d'intérêt annuel (%)
   * @returns {Object} Capacité d'emprunt et détails
   */
  static calculateBorrowingCapacity(monthlyIncome, monthlyExpenses, months, annualRate = 3) {
    // Revenus disponibles
    const availableIncome = monthlyIncome - monthlyExpenses;
    
    // Capacité de remboursement mensuelle (33% des revenus)
    const maxMonthlyPayment = Math.round(monthlyIncome * 0.33 * 100) / 100;
    
    // Capacité de remboursement réelle (ne peut pas dépasser les revenus disponibles)
    const actualMonthlyPayment = Math.min(maxMonthlyPayment, availableIncome);

    // Calculer le montant maximum empruntable
    const monthlyRate = (annualRate / 100) / 12;
    let maxLoanAmount;

    if (monthlyRate === 0) {
      maxLoanAmount = actualMonthlyPayment * months;
    } else {
      maxLoanAmount = actualMonthlyPayment * 
        (Math.pow(1 + monthlyRate, months) - 1) / 
        (monthlyRate * Math.pow(1 + monthlyRate, months));
    }

    maxLoanAmount = Math.round(maxLoanAmount * 100) / 100;

    // Taux d'endettement
    const debtRatio = Math.round((actualMonthlyPayment / monthlyIncome) * 100);

    return {
      maxLoanAmount: maxLoanAmount,
      monthlyCapacity: actualMonthlyPayment,
      debtRatio: debtRatio,
      availableIncome: availableIncome,
      isViable: debtRatio <= 33 && actualMonthlyPayment > 0
    };
  }

  /**
   * Comparer plusieurs offres de prêt
   * 
   * @param {number} amount - Montant du prêt
   * @param {number} months - Durée en mois
   * @param {Array} partners - Liste des partenaires avec leurs taux
   * @returns {Array} Comparaison des offres triées par coût total
   */
  static compareOffers(amount, months, partners) {
    const comparisons = partners.map(partner => {
      // Utiliser le taux minimum du partenaire
      const rate = partner.interest_rate_min || 3;
      
      const monthlyPayment = this.calculateMonthlyPayment(amount, rate, months);
      const totalAmount = this.calculateTotalAmount(monthlyPayment, months);
      const totalInterest = this.calculateTotalInterest(totalAmount, amount);

      return {
        partnerId: partner.id,
        partnerName: partner.name,
        partnerLogo: partner.logo_url,
        interestRate: rate,
        monthlyPayment: monthlyPayment,
        totalAmount: totalAmount,
        totalInterest: totalInterest,
        savings: 0 // Sera calculé après tri
      };
    });

    // Trier par coût total croissant
    comparisons.sort((a, b) => a.totalAmount - b.totalAmount);

    // Calculer les économies par rapport à l'offre la plus chère
    const mostExpensive = comparisons[comparisons.length - 1].totalAmount;
    comparisons.forEach(offer => {
      offer.savings = Math.round((mostExpensive - offer.totalAmount) * 100) / 100;
    });

    return comparisons;
  }

  /**
   * Calculer le coût d'un remboursement anticipé
   * 
   * @param {number} remainingBalance - Solde restant
   * @param {number} monthsRemaining - Mois restants
   * @param {number} annualRate - Taux d'intérêt annuel (%)
   * @returns {Object} Détails du remboursement anticipé
   */
  static calculateEarlyRepayment(remainingBalance, monthsRemaining, annualRate) {
    // Pas de pénalité de remboursement anticipé (politique FinanzPlus)
    const penalty = 0;
    
    // Calculer les intérêts qui auraient été payés
    const monthlyPayment = this.calculateMonthlyPayment(remainingBalance, annualRate, monthsRemaining);
    const totalWithInterest = this.calculateTotalAmount(monthlyPayment, monthsRemaining);
    const interestSaved = this.calculateTotalInterest(totalWithInterest, remainingBalance);

    return {
      remainingBalance: remainingBalance,
      penalty: penalty,
      totalToPay: remainingBalance + penalty,
      interestSaved: interestSaved,
      monthsSaved: monthsRemaining
    };
  }

  /**
   * Valider les paramètres d'un prêt
   * 
   * @param {number} amount - Montant
   * @param {number} months - Durée
   * @param {number} rate - Taux
   * @returns {Object} Résultat de validation
   */
  static validateLoanParams(amount, months, rate) {
    const errors = [];

    // Validation du montant
    if (!amount || amount < 1000) {
      errors.push('Le montant minimum est de 1 000€');
    }
    if (amount > 100000) {
      errors.push('Le montant maximum est de 100 000€');
    }

    // Validation de la durée
    if (!months || months < 12) {
      errors.push('La durée minimum est de 12 mois');
    }
    if (months > 96) {
      errors.push('La durée maximum est de 96 mois');
    }

    // Validation du taux
    if (!rate || rate < 0) {
      errors.push('Le taux d\'intérêt doit être positif');
    }
    if (rate > 20) {
      errors.push('Le taux d\'intérêt semble anormalement élevé');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Formater un montant en euros
   * 
   * @param {number} amount - Montant
   * @returns {string} Montant formaté
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  /**
   * Calculer le TAEG (Taux Annuel Effectif Global)
   * Pour l'instant, identique au taux nominal car pas de frais
   * 
   * @param {number} annualRate - Taux nominal
   * @param {number} fees - Frais éventuels
   * @returns {number} TAEG
   */
  static calculateAPR(annualRate, fees = 0) {
    // Simplification: TAEG = taux nominal si pas de frais
    if (fees === 0) {
      return annualRate;
    }
    
    // Calcul plus complexe si frais (à implémenter si nécessaire)
    return annualRate;
  }
}

module.exports = LoanCalculator;

// Made with Bob
