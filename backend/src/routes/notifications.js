const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validation');

// ============================================================================
// ROUTES UTILISATEUR AUTHENTIFIÉ
// ============================================================================

/**
 * @route   GET /api/notifications/my-notifications
 * @desc    Récupérer toutes les notifications de l'utilisateur connecté
 * @access  Authentifié
 */
router.get('/my-notifications',
  authenticate,
  [
    query('type')
      .optional()
      .isIn(['loan_status', 'document_verified', 'new_message', 'system'])
      .withMessage('Type de notification invalide'),
    query('is_read')
      .optional()
      .isBoolean()
      .withMessage('is_read doit être un booléen'),
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
  NotificationController.getMyNotifications
);

/**
 * @route   GET /api/notifications/unread
 * @desc    Récupérer les notifications non lues
 * @access  Authentifié
 */
router.get('/unread',
  authenticate,
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limite invalide'),
    validate
  ],
  NotificationController.getUnreadNotifications
);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Compter les notifications non lues
 * @access  Authentifié
 */
router.get('/unread-count',
  authenticate,
  NotificationController.getUnreadCount
);

/**
 * @route   GET /api/notifications/my-stats
 * @desc    Récupérer les statistiques des notifications de l'utilisateur
 * @access  Authentifié
 */
router.get('/my-stats',
  authenticate,
  NotificationController.getMyStats
);

/**
 * @route   GET /api/notifications/:id
 * @desc    Récupérer une notification par ID
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
  NotificationController.getById
);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Marquer une notification comme lue
 * @access  Authentifié (propriétaire ou admin)
 */
router.patch('/:id/read',
  authenticate,
  [
    param('id')
      .isUUID()
      .withMessage('ID invalide'),
    validate
  ],
  NotificationController.markAsRead
);

/**
 * @route   PATCH /api/notifications/mark-all-read
 * @desc    Marquer toutes les notifications comme lues
 * @access  Authentifié
 */
router.patch('/mark-all-read',
  authenticate,
  NotificationController.markAllAsRead
);

/**
 * @route   PATCH /api/notifications/mark-multiple-read
 * @desc    Marquer plusieurs notifications comme lues
 * @access  Authentifié
 */
router.patch('/mark-multiple-read',
  authenticate,
  [
    body('notification_ids')
      .isArray({ min: 1 })
      .withMessage('notification_ids doit être un tableau non vide'),
    body('notification_ids.*')
      .isUUID()
      .withMessage('ID de notification invalide'),
    validate
  ],
  NotificationController.markMultipleAsRead
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Supprimer une notification
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
  NotificationController.deleteNotification
);

/**
 * @route   DELETE /api/notifications/delete-all
 * @desc    Supprimer toutes les notifications de l'utilisateur
 * @access  Authentifié
 */
router.delete('/delete-all',
  authenticate,
  NotificationController.deleteAllNotifications
);

// ============================================================================
// ROUTES ADMIN
// ============================================================================

/**
 * @route   GET /api/notifications/admin/all
 * @desc    Récupérer toutes les notifications
 * @access  Admin
 */
router.get('/admin/all',
  authenticate,
  isAdmin,
  [
    query('user_id')
      .optional()
      .isUUID()
      .withMessage('ID utilisateur invalide'),
    query('type')
      .optional()
      .isIn(['loan_status', 'document_verified', 'new_message', 'system'])
      .withMessage('Type de notification invalide'),
    query('is_read')
      .optional()
      .isBoolean()
      .withMessage('is_read doit être un booléen'),
    query('sortBy')
      .optional()
      .isIn(['created_at', 'type', 'is_read'])
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
  NotificationController.getAllNotifications
);

/**
 * @route   POST /api/notifications/admin/create
 * @desc    Créer une notification
 * @access  Admin
 */
router.post('/admin/create',
  authenticate,
  isAdmin,
  [
    body('user_id')
      .isUUID()
      .withMessage('ID utilisateur invalide'),
    body('type')
      .isIn(['loan_status', 'document_verified', 'new_message', 'system'])
      .withMessage('Type de notification invalide'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Le titre est requis')
      .isLength({ max: 200 })
      .withMessage('Le titre ne peut pas dépasser 200 caractères'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Le message est requis')
      .isLength({ max: 1000 })
      .withMessage('Le message ne peut pas dépasser 1000 caractères'),
    body('related_entity_type')
      .optional()
      .trim()
      .isIn(['loan_request', 'document', 'comment', 'user'])
      .withMessage('Type d\'entité invalide'),
    body('related_entity_id')
      .optional()
      .isUUID()
      .withMessage('ID d\'entité invalide'),
    body('action_url')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('L\'URL d\'action ne peut pas dépasser 500 caractères'),
    validate
  ],
  NotificationController.createNotification
);

/**
 * @route   POST /api/notifications/admin/broadcast
 * @desc    Envoyer une notification à tous les utilisateurs
 * @access  Admin
 */
router.post('/admin/broadcast',
  authenticate,
  isAdmin,
  [
    body('type')
      .isIn(['loan_status', 'document_verified', 'new_message', 'system'])
      .withMessage('Type de notification invalide'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Le titre est requis')
      .isLength({ max: 200 })
      .withMessage('Le titre ne peut pas dépasser 200 caractères'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Le message est requis')
      .isLength({ max: 1000 })
      .withMessage('Le message ne peut pas dépasser 1000 caractères'),
    body('action_url')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('L\'URL d\'action ne peut pas dépasser 500 caractères'),
    validate
  ],
  NotificationController.broadcastNotification
);

/**
 * @route   GET /api/notifications/admin/stats
 * @desc    Récupérer les statistiques globales des notifications
 * @access  Admin
 */
router.get('/admin/stats',
  authenticate,
  isAdmin,
  NotificationController.getStats
);

/**
 * @route   DELETE /api/notifications/admin/delete-old-read
 * @desc    Supprimer les anciennes notifications lues
 * @access  Admin
 */
router.delete('/admin/delete-old-read',
  authenticate,
  isAdmin,
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Nombre de jours invalide'),
    validate
  ],
  NotificationController.deleteOldRead
);

module.exports = router;

// Made with Bob
