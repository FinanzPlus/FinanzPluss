const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter, registerLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 * @protection Rate limit: 2 inscriptions par heure par IP
 */
router.post('/register', registerLimiter, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 * @protection Rate limit: 5 tentatives par 15 minutes par IP
 */
router.post('/login', authLimiter, authController.login);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Vérification de l'email
 * @access  Public
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Demande de réinitialisation du mot de passe
 * @access  Public
 * @protection Rate limit: 3 tentatives par heure par IP
 */
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Réinitialisation du mot de passe
 * @access  Public
 * @protection Rate limit: 3 tentatives par heure par IP
 */
router.post('/reset-password/:token', passwordResetLimiter, authController.resetPassword);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Mettre à jour le profil
 * @access  Private
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route   POST /api/auth/change-password
 * @desc    Changer le mot de passe
 * @access  Private
 */
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;

// Made with Bob
