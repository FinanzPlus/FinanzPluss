const express = require('express');
const router = express.Router();
const PartnerController = require('../controllers/partnerController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validation');

// ============================================================================
// ROUTES PUBLIQUES
// ============================================================================

/**
 * @route   GET /api/partners
 * @desc    Récupérer tous les partenaires
 * @access  Public
 */
router.get('/',
  [
    query('active')
      .optional()
      .isBoolean()
      .withMessage('Active doit être un booléen'),
    query('sortBy')
      .optional()
      .isIn(['display_order', 'name', 'interest_rate_min', 'created_at'])
      .withMessage('Tri invalide'),
    query('order')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Ordre invalide'),
    validate
  ],
  PartnerController.getAll
);

/**
 * @route   GET /api/partners/active-for-comparison
 * @desc    Récupérer les partenaires actifs pour une comparaison
 * @access  Public
 */
router.get('/active-for-comparison',
  [
    query('amount')
      .isFloat({ min: 1000, max: 100000 })
      .withMessage('Montant invalide'),
    query('duration')
      .isInt({ min: 12, max: 96 })
      .withMessage('Durée invalide'),
    validate
  ],
  PartnerController.getActiveForComparison
);

/**
 * @route   GET /api/partners/:id
 * @desc    Récupérer un partenaire par ID
 * @access  Public
 */
router.get('/:id',
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  PartnerController.getById
);

// ============================================================================
// ROUTES ADMIN
// ============================================================================

/**
 * @route   POST /api/partners
 * @desc    Créer un nouveau partenaire
 * @access  Admin
 */
router.post('/',
  authenticate,
  isAdmin,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Le nom est requis'),
    body('logo_url')
      .optional()
      .trim()
      .isURL()
      .withMessage('URL du logo invalide'),
    body('description')
      .optional()
      .trim(),
    body('official_website')
      .optional()
      .trim()
      .isURL()
      .withMessage('URL du site web invalide'),
    body('interest_rate_min')
      .isFloat({ min: 0, max: 20 })
      .withMessage('Taux minimum invalide'),
    body('interest_rate_max')
      .isFloat({ min: 0, max: 20 })
      .withMessage('Taux maximum invalide'),
    body('min_loan_amount')
      .isFloat({ min: 0 })
      .withMessage('Montant minimum invalide'),
    body('max_loan_amount')
      .isFloat({ min: 0 })
      .withMessage('Montant maximum invalide'),
    body('min_duration_months')
      .isInt({ min: 1 })
      .withMessage('Durée minimum invalide'),
    body('max_duration_months')
      .isInt({ min: 1 })
      .withMessage('Durée maximum invalide'),
    body('certifications')
      .optional()
      .isArray()
      .withMessage('Les certifications doivent être un tableau'),
    body('is_active')
      .optional()
      .isBoolean()
      .withMessage('is_active doit être un booléen'),
    body('display_order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Ordre d\'affichage invalide'),
    validate
  ],
  PartnerController.create
);

/**
 * @route   PUT /api/partners/:id
 * @desc    Mettre à jour un partenaire
 * @access  Admin
 */
router.put('/:id',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Le nom ne peut pas être vide'),
    body('logo_url')
      .optional()
      .trim()
      .isURL()
      .withMessage('URL du logo invalide'),
    body('description')
      .optional()
      .trim(),
    body('official_website')
      .optional()
      .trim()
      .isURL()
      .withMessage('URL du site web invalide'),
    body('interest_rate_min')
      .optional()
      .isFloat({ min: 0, max: 20 })
      .withMessage('Taux minimum invalide'),
    body('interest_rate_max')
      .optional()
      .isFloat({ min: 0, max: 20 })
      .withMessage('Taux maximum invalide'),
    body('min_loan_amount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Montant minimum invalide'),
    body('max_loan_amount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Montant maximum invalide'),
    body('min_duration_months')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Durée minimum invalide'),
    body('max_duration_months')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Durée maximum invalide'),
    body('certifications')
      .optional()
      .isArray()
      .withMessage('Les certifications doivent être un tableau'),
    body('is_active')
      .optional()
      .isBoolean()
      .withMessage('is_active doit être un booléen'),
    body('display_order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Ordre d\'affichage invalide'),
    validate
  ],
  PartnerController.update
);

/**
 * @route   DELETE /api/partners/:id
 * @desc    Supprimer un partenaire
 * @access  Admin
 */
router.delete('/:id',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  PartnerController.delete
);

/**
 * @route   GET /api/partners/stats/overview
 * @desc    Récupérer les statistiques des partenaires
 * @access  Admin
 */
router.get('/stats/overview',
  authenticate,
  isAdmin,
  PartnerController.getStats
);

module.exports = router;

// Made with Bob
