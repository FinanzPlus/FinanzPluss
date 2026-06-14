/**
 * LOAN ROUTES - FINANZPLUS AUSTRIA
 * Routes pour la gestion des simulations et demandes de crédit
 */

const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticate } = require('../middleware/auth');
const { financialLimiter } = require('../middleware/rateLimiter');

/**
 * @route   POST /api/loans/simulations
 * @desc    Sauvegarde une simulation de crédit
 * @access  Public (Private si authentifié)
 * @protection Rate limit: 20 simulations par 10 minutes par IP
 */
router.post('/simulations', financialLimiter, loanController.saveSimulation);

/**
 * @route   GET /api/loans/simulations
 * @desc    Récupère les simulations de l'utilisateur connecté
 * @access  Private
 */
router.get('/simulations', authenticate, loanController.getUserSimulations);

/**
 * @route   POST /api/loans/applications
 * @desc    Soumet une demande de crédit complète
 * @access  Public
 */
router.post(
  '/applications',
  loanController.validateApplication,
  loanController.submitApplication
);

/**
 * @route   POST /api/loans/send-confirmation
 * @desc    Envoie un email de confirmation
 * @access  Public
 */
router.post('/send-confirmation', loanController.sendConfirmation);

module.exports = router;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
