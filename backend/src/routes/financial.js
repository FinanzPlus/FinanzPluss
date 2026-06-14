/**
 * ROUTES FINANCIÈRES - FINANZPLUS AUSTRIA
 * Routes pour les simulations et demandes de crédit
 */

const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticate } = require('../middleware/auth');

console.log('🛣️  [ROUTES FINANCIAL] Module de routes chargé');

// ============================================
// ROUTES PUBLIQUES (sans authentification)
// ============================================

/**
 * POST /api/loans/applications
 * Soumettre une demande de crédit
 */
router.post(
  '/applications',
  loanController.validateApplication,
  loanController.submitApplication
);

/**
 * POST /api/loans/test-email
 * Tester l'envoi d'email (endpoint de diagnostic)
 */
router.post('/test-email', loanController.testEmail);

/**
 * POST /api/loans/send-confirmation
 * Envoyer un email de confirmation simple
 */
router.post('/send-confirmation', loanController.sendConfirmation);

// ============================================
// ROUTES PROTÉGÉES (authentification requise)
// ============================================

/**
 * POST /api/loans/simulations
 * Sauvegarder une simulation de crédit
 */
router.post('/simulations', authenticate, loanController.saveSimulation);

/**
 * GET /api/loans/simulations
 * Récupérer les simulations de l'utilisateur
 */
router.get('/simulations', authenticate, loanController.getUserSimulations);

console.log('✅ [ROUTES FINANCIAL] Routes configurées:');
console.log('   - POST /api/loans/applications (public)');
console.log('   - POST /api/loans/test-email (public)');
console.log('   - POST /api/loans/send-confirmation (public)');
console.log('   - POST /api/loans/simulations (protégé)');
console.log('   - GET /api/loans/simulations (protégé)');

module.exports = router;

// Made with Bob
