const express = require('express');
const router = express.Router();
const FAQController = require('../controllers/faqController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validation');

// ============================================================================
// ROUTES PUBLIQUES
// ============================================================================

/**
 * @route   GET /api/faq
 * @desc    Récupérer toutes les FAQs actives
 * @access  Public
 */
router.get('/',
  [
    query('category')
      .optional()
      .trim()
      .isIn(['general', 'loans', 'documents', 'partners', 'security', 'legal'])
      .withMessage('Catégorie invalide'),
    query('sortBy')
      .optional()
      .isIn(['display_order', 'view_count', 'created_at'])
      .withMessage('Tri invalide'),
    query('order')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Ordre invalide'),
    validate
  ],
  FAQController.getAll
);

/**
 * @route   GET /api/faq/categories
 * @desc    Récupérer toutes les catégories de FAQs
 * @access  Public
 */
router.get('/categories',
  FAQController.getCategories
);

/**
 * @route   GET /api/faq/search
 * @desc    Rechercher dans les FAQs
 * @access  Public
 */
router.get('/search',
  [
    query('q')
      .trim()
      .notEmpty()
      .withMessage('Le terme de recherche est requis')
      .isLength({ min: 2, max: 100 })
      .withMessage('Le terme de recherche doit contenir entre 2 et 100 caractères'),
    validate
  ],
  FAQController.search
);

/**
 * @route   GET /api/faq/most-viewed
 * @desc    Récupérer les FAQs les plus consultées
 * @access  Public
 */
router.get('/most-viewed',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limite invalide'),
    validate
  ],
  FAQController.getMostViewed
);

/**
 * @route   GET /api/faq/category/:category
 * @desc    Récupérer les FAQs par catégorie
 * @access  Public
 */
router.get('/category/:category',
  [
    param('category')
      .trim()
      .isIn(['general', 'loans', 'documents', 'partners', 'security', 'legal'])
      .withMessage('Catégorie invalide'),
    validate
  ],
  FAQController.getByCategory
);

/**
 * @route   GET /api/faq/:id
 * @desc    Récupérer une FAQ par ID
 * @access  Public
 */
router.get('/:id',
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  FAQController.getById
);

// ============================================================================
// ROUTES ADMIN
// ============================================================================

/**
 * @route   GET /api/faq/admin/all
 * @desc    Récupérer toutes les FAQs (inclut les inactives)
 * @access  Admin
 */
router.get('/admin/all',
  authenticate,
  isAdmin,
  [
    query('category')
      .optional()
      .trim()
      .isIn(['general', 'loans', 'documents', 'partners', 'security', 'legal'])
      .withMessage('Catégorie invalide'),
    query('is_active')
      .optional()
      .isBoolean()
      .withMessage('is_active doit être un booléen'),
    query('sortBy')
      .optional()
      .isIn(['display_order', 'view_count', 'created_at', 'updated_at'])
      .withMessage('Tri invalide'),
    query('order')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Ordre invalide'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 200 })
      .withMessage('Limite invalide'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset invalide'),
    validate
  ],
  FAQController.getAllAdmin
);

/**
 * @route   POST /api/faq/admin
 * @desc    Créer une nouvelle FAQ
 * @access  Admin
 */
router.post('/admin',
  authenticate,
  isAdmin,
  [
    body('question_de')
      .trim()
      .notEmpty()
      .withMessage('La question est requise')
      .isLength({ min: 10, max: 500 })
      .withMessage('La question doit contenir entre 10 et 500 caractères'),
    body('answer_de')
      .trim()
      .notEmpty()
      .withMessage('La réponse est requise')
      .isLength({ min: 20, max: 5000 })
      .withMessage('La réponse doit contenir entre 20 et 5000 caractères'),
    body('category')
      .optional()
      .trim()
      .isIn(['general', 'loans', 'documents', 'partners', 'security', 'legal'])
      .withMessage('Catégorie invalide'),
    body('display_order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Ordre d\'affichage invalide'),
    validate
  ],
  FAQController.create
);

/**
 * @route   PUT /api/faq/admin/:id
 * @desc    Mettre à jour une FAQ
 * @access  Admin
 */
router.put('/admin/:id',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    body('question_de')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('La question ne peut pas être vide')
      .isLength({ min: 10, max: 500 })
      .withMessage('La question doit contenir entre 10 et 500 caractères'),
    body('answer_de')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('La réponse ne peut pas être vide')
      .isLength({ min: 20, max: 5000 })
      .withMessage('La réponse doit contenir entre 20 et 5000 caractères'),
    body('category')
      .optional()
      .trim()
      .isIn(['general', 'loans', 'documents', 'partners', 'security', 'legal'])
      .withMessage('Catégorie invalide'),
    body('display_order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Ordre d\'affichage invalide'),
    body('is_active')
      .optional()
      .isBoolean()
      .withMessage('is_active doit être un booléen'),
    validate
  ],
  FAQController.update
);

/**
 * @route   DELETE /api/faq/admin/:id
 * @desc    Supprimer une FAQ
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
  FAQController.delete
);

/**
 * @route   PATCH /api/faq/admin/:id/toggle
 * @desc    Activer/Désactiver une FAQ
 * @access  Admin
 */
router.patch('/admin/:id/toggle',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  FAQController.toggleActive
);

/**
 * @route   POST /api/faq/admin/:id/duplicate
 * @desc    Dupliquer une FAQ
 * @access  Admin
 */
router.post('/admin/:id/duplicate',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  FAQController.duplicate
);

/**
 * @route   PUT /api/faq/admin/reorder
 * @desc    Réorganiser l'ordre des FAQs
 * @access  Admin
 */
router.put('/admin/reorder',
  authenticate,
  isAdmin,
  [
    body('faq_orders')
      .isArray({ min: 1 })
      .withMessage('faq_orders doit être un tableau non vide'),
    body('faq_orders.*.id')
      .isUUID()
      .withMessage('ID invalide'),
    body('faq_orders.*.display_order')
      .isInt({ min: 0 })
      .withMessage('Ordre d\'affichage invalide'),
    validate
  ],
  FAQController.reorder
);

/**
 * @route   GET /api/faq/admin/stats
 * @desc    Récupérer les statistiques des FAQs
 * @access  Admin
 */
router.get('/admin/stats',
  authenticate,
  isAdmin,
  FAQController.getStats
);

module.exports = router;

// Made with Bob
