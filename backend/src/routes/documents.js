const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validation');

// ============================================================================
// ROUTES UTILISATEUR AUTHENTIFIÉ
// ============================================================================

/**
 * @route   POST /api/documents/upload
 * @desc    Télécharger un nouveau document
 * @access  Authentifié
 */
router.post('/upload',
  authenticate,
  // Le middleware multer est géré dans le contrôleur
  DocumentController.uploadDocument
);

/**
 * @route   GET /api/documents/my-documents
 * @desc    Récupérer tous les documents de l'utilisateur connecté
 * @access  Authentifié
 */
router.get('/my-documents',
  authenticate,
  [
    query('document_type')
      .optional()
      .isIn(['identity_card', 'proof_of_income', 'proof_of_residence', 'bank_statement', 'tax_return', 'employment_contract', 'other'])
      .withMessage('Type de document invalide'),
    query('verification_status')
      .optional()
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Statut de vérification invalide'),
    query('loan_request_id')
      .optional()
      .isUUID()
      .withMessage('ID de demande de prêt invalide'),
    validate
  ],
  DocumentController.getMyDocuments
);

/**
 * @route   GET /api/documents/:id
 * @desc    Récupérer un document par ID
 * @access  Authentifié (propriétaire ou admin)
 */
router.get('/:id',
  authenticate,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  DocumentController.getById
);

/**
 * @route   GET /api/documents/:id/download
 * @desc    Télécharger un fichier document
 * @access  Authentifié (propriétaire ou admin)
 */
router.get('/:id/download',
  authenticate,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  DocumentController.downloadDocument
);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Supprimer un document
 * @access  Authentifié (propriétaire ou admin)
 */
router.delete('/:id',
  authenticate,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  DocumentController.deleteDocument
);

// ============================================================================
// ROUTES ADMIN
// ============================================================================

/**
 * @route   GET /api/documents/admin/all
 * @desc    Récupérer tous les documents (admin)
 * @access  Admin
 */
router.get('/admin/all',
  authenticate,
  isAdmin,
  [
    query('verification_status')
      .optional()
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Statut de vérification invalide'),
    query('document_type')
      .optional()
      .isIn(['identity_card', 'proof_of_income', 'proof_of_residence', 'bank_statement', 'tax_return', 'employment_contract', 'other'])
      .withMessage('Type de document invalide'),
    query('user_id')
      .optional()
      .isUUID()
      .withMessage('ID utilisateur invalide'),
    query('sortBy')
      .optional()
      .isIn(['created_at', 'verification_status', 'document_type', 'file_size'])
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
  DocumentController.getAllDocuments
);

/**
 * @route   PUT /api/documents/:id/verify
 * @desc    Mettre à jour le statut de vérification d'un document
 * @access  Admin
 */
router.put('/:id/verify',
  authenticate,
  isAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    body('status')
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Statut invalide'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Les notes ne peuvent pas dépasser 500 caractères'),
    validate
  ],
  DocumentController.updateVerificationStatus
);

/**
 * @route   GET /api/documents/admin/stats
 * @desc    Récupérer les statistiques des documents
 * @access  Admin
 */
router.get('/admin/stats',
  authenticate,
  isAdmin,
  DocumentController.getStats
);

/**
 * @route   GET /api/documents/admin/pending
 * @desc    Récupérer les documents en attente de vérification
 * @access  Admin
 */
router.get('/admin/pending',
  authenticate,
  isAdmin,
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limite invalide'),
    validate
  ],
  DocumentController.getPendingVerification
);

module.exports = router;

// Made with Bob
