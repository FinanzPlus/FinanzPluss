const express = require('express');
const router = express.Router();
const CreditScoreController = require('../controllers/creditScoreController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validation');
const { financialLimiter } = require('../middleware/rateLimiter');

// ============================================================================
// ROUTES UTILISATEUR AUTHENTIFIÉ
// ============================================================================

/**
 * @route   GET /api/credit-score/my-score
 * @desc    Récupérer le score de crédit de l'utilisateur connecté
 * @access  Authentifié
 */
router.get('/my-score',
  authenticate,
  CreditScoreController.getMyCreditScore
);

/**
 * @route   POST /api/credit-score/calculate
 * @desc    Calculer et enregistrer le score de crédit de l'utilisateur
 * @access  Authentifié
 * @protection Rate limit: 20 calculs par 10 minutes par IP
 */
router.post('/calculate',
  financialLimiter,
  authenticate,
  [
    body('credit_history_length_months')
      .optional()
      .isInt({ min: 0, max: 600 })
      .withMessage('Durée d\'historique de crédit invalide'),
    body('number_of_active_credits')
      .optional()
      .isInt({ min: 0, max: 20 })
      .withMessage('Nombre de crédits actifs invalide'),
    body('total_debt_amount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Montant total de la dette invalide'),
    body('payment_history_rating')
      .optional()
      .isIn(['excellent', 'good', 'fair', 'poor', 'unknown'])
      .withMessage('Évaluation de l\'historique de paiement invalide'),
    body('recent_credit_inquiries')
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage('Nombre de demandes de crédit récentes invalide'),
    body('negative_records')
      .optional()
      .isArray()
      .withMessage('Les enregistrements négatifs doivent être un tableau'),
    body('assessment_notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Les notes d\'évaluation ne peuvent pas dépasser 1000 caractères'),
    validate
  ],
  CreditScoreController.calculateMyCreditScore
);

// ============================================================================
// ROUTES ADMIN
// ============================================================================

/**
 * @route   GET /api/credit-score/admin/all
 * @desc    Récupérer tous les scores de crédit
 * @access  Admin
 */
router.get('/admin/all',
  authenticate,
  isAdmin,
  [
    query('min_score')
      .optional()
      .isInt({ min: 300, max: 850 })
      .withMessage('Score minimum invalide'),
    query('max_score')
      .optional()
      .isInt({ min: 300, max: 850 })
      .withMessage('Score maximum invalide'),
    query('payment_history_rating')
      .optional()
      .isIn(['excellent', 'good', 'fair', 'poor', 'unknown'])
      .withMessage('Évaluation invalide'),
    query('score_provider')
      .optional()
      .trim(),
    query('sortBy')
      .optional()
      .isIn(['score', 'last_updated', 'created_at', 'debt_to_income_ratio'])
      .withMessage('Tri invalide'),
    query('order')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Ordre invalide'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limite invalide'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset invalide'),
    validate
  ],
  CreditScoreController.getAll
);

/**
 * @route   GET /api/credit-score/admin/:id
 * @desc    Récupérer un score de crédit par ID
 * @access  Admin
 */
router.get('/admin/:id',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  CreditScoreController.getById
);

/**
 * @route   GET /api/credit-score/admin/user/:userId
 * @desc    Récupérer le score de crédit d'un utilisateur spécifique
 * @access  Admin
 */
router.get('/admin/user/:userId',
  authenticate,
  isAdmin,
  [
    param('userId')
      .isUUID()
      .withMessage('ID utilisateur invalide'),
    validate
  ],
  CreditScoreController.getByUserId
);

/**
 * @route   POST /api/credit-score/admin/upsert
 * @desc    Créer ou mettre à jour un score de crédit
 * @access  Admin
 */
router.post('/admin/upsert',
  authenticate,
  isAdmin,
  [
    body('user_id')
      .isUUID()
      .withMessage('ID utilisateur invalide'),
    body('score')
      .isInt({ min: 300, max: 850 })
      .withMessage('Score invalide (300-850)'),
    body('score_provider')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Fournisseur de score invalide'),
    body('credit_history_length_months')
      .optional()
      .isInt({ min: 0, max: 600 })
      .withMessage('Durée d\'historique de crédit invalide'),
    body('number_of_active_credits')
      .optional()
      .isInt({ min: 0, max: 20 })
      .withMessage('Nombre de crédits actifs invalide'),
    body('total_debt_amount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Montant total de la dette invalide'),
    body('payment_history_rating')
      .optional()
      .isIn(['excellent', 'good', 'fair', 'poor', 'unknown'])
      .withMessage('Évaluation de l\'historique de paiement invalide'),
    body('debt_to_income_ratio')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Ratio dette/revenu invalide'),
    body('recent_credit_inquiries')
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage('Nombre de demandes de crédit récentes invalide'),
    body('negative_records')
      .optional()
      .isArray()
      .withMessage('Les enregistrements négatifs doivent être un tableau'),
    body('assessment_notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Les notes d\'évaluation ne peuvent pas dépasser 1000 caractères'),
    validate
  ],
  CreditScoreController.upsertScore
);

/**
 * @route   DELETE /api/credit-score/admin/:id
 * @desc    Supprimer un score de crédit
 * @access  Admin
 */
router.delete('/admin/:id',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  CreditScoreController.deleteScore
);

/**
 * @route   GET /api/credit-score/admin/stats/overview
 * @desc    Récupérer les statistiques des scores de crédit
 * @access  Admin
 */
router.get('/admin/stats/overview',
  authenticate,
  isAdmin,
  CreditScoreController.getStats
);

/**
 * @route   GET /api/credit-score/admin/top-scores
 * @desc    Récupérer les meilleurs scores
 * @access  Admin
 */
router.get('/admin/top-scores',
  authenticate,
  isAdmin,
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limite invalide'),
    validate
  ],
  CreditScoreController.getTopScores
);

/**
 * @route   GET /api/credit-score/admin/outdated
 * @desc    Récupérer les scores obsolètes nécessitant une mise à jour
 * @access  Admin
 */
router.get('/admin/outdated',
  authenticate,
  isAdmin,
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Nombre de jours invalide'),
    validate
  ],
  CreditScoreController.getOutdatedScores
);

module.exports = router;

// Made with Bob
