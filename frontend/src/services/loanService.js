/**
 * LOAN SERVICE - FINANZPLUS AUSTRIA
 * Gestion des simulations de crédit et communications
 */

import api from './api';

/**
 * Sauvegarde une simulation dans localStorage
 */
export const saveSimulationLocally = (simulationData) => {
  try {
    const simulations = getLocalSimulations();
    const newSimulation = {
      id: Date.now().toString(),
      ...simulationData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    simulations.push(newSimulation);
    localStorage.setItem('loan_simulations', JSON.stringify(simulations));
    
    return { success: true, simulation: newSimulation };
  } catch (error) {
    console.error('Erreur sauvegarde locale:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupère toutes les simulations locales
 */
export const getLocalSimulations = () => {
  try {
    const data = localStorage.getItem('loan_simulations');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lecture simulations:', error);
    return [];
  }
};

/**
 * Récupère une simulation par ID
 */
export const getSimulationById = (id) => {
  const simulations = getLocalSimulations();
  return simulations.find(sim => sim.id === id);
};

/**
 * Supprime une simulation locale
 */
export const deleteLocalSimulation = (id) => {
  try {
    const simulations = getLocalSimulations();
    const filtered = simulations.filter(sim => sim.id !== id);
    localStorage.setItem('loan_simulations', JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sauvegarde une simulation sur le serveur (avec authentification)
 */
export const saveSimulationToServer = async (simulationData) => {
  try {
    const response = await api.post('/api/loans/simulations', simulationData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erreur sauvegarde serveur:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur de sauvegarde'
    };
  }
};

/**
 * Récupère les simulations de l'utilisateur connecté
 */
export const getUserSimulations = async () => {
  try {
    const response = await api.get('/api/loans/simulations');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erreur récupération simulations:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur de récupération'
    };
  }
};

/**
 * Envoie une demande de crédit complète
 */
export const submitLoanApplication = async (applicationData) => {
  try {
    const response = await api.post('/api/loans/applications', applicationData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erreur soumission demande:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur de soumission'
    };
  }
};

/**
 * Envoie un email de confirmation
 */
export const sendConfirmationEmail = async (emailData) => {
  try {
    const response = await api.post('/api/loans/send-confirmation', emailData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur d\'envoi email'
    };
  }
};

/**
 * Compare les offres de plusieurs banques
 */
export const compareOffers = (amount, duration, banks) => {
  return banks.map(bank => {
    const monthlyRate = bank.rate / 100 / 12;
    const numberOfPayments = duration;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = amount / numberOfPayments;
    } else {
      monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    }
    
    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - amount;
    
    return {
      bank: bank.name,
      bankId: bank.id,
      rate: bank.rate,
      monthlyPayment: monthlyPayment.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      savings: 0 // Calculé après tri
    };
  }).sort((a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount))
    .map((offer, index, array) => {
      if (index > 0) {
        offer.savings = (parseFloat(array[index].totalAmount) - parseFloat(array[0].totalAmount)).toFixed(2);
      }
      return offer;
    });
};

/**
 * Génère un PDF de simulation
 */
export const generatePDF = (simulationData) => {
  // Cette fonction sera appelée côté serveur pour générer un vrai PDF
  // Pour l'instant, on utilise window.print() côté client
  return {
    success: true,
    message: 'Utilisez la fonction d\'impression du navigateur'
  };
};

/**
 * Exporte les données de simulation en JSON
 */
export const exportSimulationJSON = (simulation) => {
  const dataStr = JSON.stringify(simulation, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `simulation_${simulation.id}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Calcule la capacité d'emprunt
 */
export const calculateBorrowingCapacity = (monthlyIncome, monthlyExpenses, duration, rate) => {
  const availableIncome = monthlyIncome - monthlyExpenses;
  const maxMonthlyPayment = availableIncome * 0.33; // 33% du revenu disponible
  
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = duration;
  
  let maxAmount;
  if (monthlyRate === 0) {
    maxAmount = maxMonthlyPayment * numberOfPayments;
  } else {
    maxAmount = maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate;
  }
  
  return {
    maxAmount: Math.floor(maxAmount),
    maxMonthlyPayment: maxMonthlyPayment.toFixed(2),
    debtRatio: 33,
    recommendation: maxAmount > 0 ? 'Vous pouvez emprunter' : 'Capacité insuffisante'
  };
};

/**
 * Valide les données de simulation
 */
export const validateSimulation = (data) => {
  const errors = [];
  
  if (!data.amount || data.amount < 1000) {
    errors.push('Le montant doit être au moins 1.000€');
  }
  
  if (!data.duration || data.duration < 12) {
    errors.push('La durée doit être au moins 12 mois');
  }
  
  if (!data.selectedBank) {
    errors.push('Veuillez sélectionner une banque');
  }
  
  if (!data.firstName || !data.lastName) {
    errors.push('Nom et prénom requis');
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Email valide requis');
  }
  
  if (!data.phone || data.phone.length < 10) {
    errors.push('Numéro de téléphone valide requis');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formate un montant en euros
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

/**
 * Formate une date en allemand
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('de-AT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export default {
  saveSimulationLocally,
  getLocalSimulations,
  getSimulationById,
  deleteLocalSimulation,
  saveSimulationToServer,
  getUserSimulations,
  submitLoanApplication,
  sendConfirmationEmail,
  compareOffers,
  generatePDF,
  exportSimulationJSON,
  calculateBorrowingCapacity,
  validateSimulation,
  formatCurrency,
  formatDate
};

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
