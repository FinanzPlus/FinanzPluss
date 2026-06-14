const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/opening-hours', contactController.getOpeningHours);
router.get('/opening-hours/:day', contactController.getOpeningHoursByDay);
router.get('/is-open', contactController.checkIfOpen);

/**
 * @route   POST /api/contact/messages
 * @desc    Créer un message de contact
 * @access  Public
 * @protection Rate limit: 3 messages par heure par IP (anti-spam)
 */
router.post('/messages', contactLimiter, contactController.createContactMessage);

// Protected routes (authenticated users)
router.get('/messages/my', authenticate, contactController.getUserMessages);

// Admin routes
router.put('/opening-hours/:day', authenticate, isAdmin, contactController.updateOpeningHours);
router.post('/opening-hours/initialize', authenticate, isAdmin, contactController.initializeOpeningHours);
router.get('/messages', authenticate, isAdmin, contactController.getAllMessages);
router.get('/messages/:id', authenticate, isAdmin, contactController.getMessageById);
router.patch('/messages/:id/status', authenticate, isAdmin, contactController.updateMessageStatus);
router.delete('/messages/:id', authenticate, isAdmin, contactController.deleteMessage);

module.exports = router;

// Made with Bob
