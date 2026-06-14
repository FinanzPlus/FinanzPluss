/**
 * RATE LIMITER MIDDLEWARE - FINANZPLUS AUSTRIA
 * Protection contre les abus et attaques par force brute
 * Conforme aux standards de sécurité autrichiens
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter général pour toutes les routes
 * 100 requêtes par 15 minutes par IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par fenêtre
  message: {
    error: 'Zu viele Anfragen von dieser IP-Adresse. Bitte versuchen Sie es später erneut.',
    retryAfter: '15 Minuten'
  },
  standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  handler: (req, res) => {
    console.warn(`[RATE LIMIT] IP ${req.ip} a dépassé la limite générale`);
    res.status(429).json({
      error: 'Zu viele Anfragen von dieser IP-Adresse. Bitte versuchen Sie es später erneut.',
      retryAfter: '15 Minuten'
    });
  }
});

/**
 * Rate limiter strict pour l'authentification
 * 5 tentatives par 15 minutes par IP
 * Protection contre les attaques par force brute
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite de 5 tentatives
  skipSuccessfulRequests: true, // Ne compte pas les requêtes réussies
  message: {
    error: 'Zu viele fehlgeschlagene Anmeldeversuche. Ihr Konto wurde vorübergehend gesperrt.',
    retryAfter: '15 Minuten',
    security: 'Aus Sicherheitsgründen wurde Ihre IP-Adresse vorübergehend blockiert.'
  },
  handler: (req, res) => {
    console.error(`[SECURITY ALERT] IP ${req.ip} - Tentatives de connexion excessives`);
    res.status(429).json({
      error: 'Zu viele fehlgeschlagene Anmeldeversuche. Ihr Konto wurde vorübergehend gesperrt.',
      retryAfter: '15 Minuten',
      security: 'Aus Sicherheitsgründen wurde Ihre IP-Adresse vorübergehend blockiert.'
    });
  }
});

/**
 * Rate limiter pour les formulaires de contact
 * 3 soumissions par heure par IP
 * Prévient le spam
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Limite de 3 soumissions
  message: {
    error: 'Sie haben zu viele Kontaktanfragen gesendet. Bitte warten Sie eine Stunde.',
    retryAfter: '1 Stunde'
  },
  handler: (req, res) => {
    console.warn(`[SPAM PROTECTION] IP ${req.ip} - Trop de soumissions de formulaire de contact`);
    res.status(429).json({
      error: 'Sie haben zu viele Kontaktanfragen gesendet. Bitte warten Sie eine Stunde.',
      retryAfter: '1 Stunde'
    });
  }
});

/**
 * Rate limiter pour les simulations financières
 * 20 simulations par 10 minutes par IP
 * Prévient l'abus des calculateurs
 */
const financialLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Limite de 20 simulations
  message: {
    error: 'Sie haben zu viele Kreditsimulationen durchgeführt. Bitte warten Sie 10 Minuten.',
    retryAfter: '10 Minuten'
  },
  handler: (req, res) => {
    console.warn(`[RATE LIMIT] IP ${req.ip} - Trop de simulations financières`);
    res.status(429).json({
      error: 'Sie haben zu viele Kreditsimulationen durchgeführt. Bitte warten Sie 10 Minuten.',
      retryAfter: '10 Minuten'
    });
  }
});

/**
 * Rate limiter pour la création de compte
 * 2 créations par heure par IP
 * Prévient la création de comptes en masse
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 2, // Limite de 2 créations
  message: {
    error: 'Sie haben zu viele Konten erstellt. Bitte warten Sie eine Stunde.',
    retryAfter: '1 Stunde'
  },
  handler: (req, res) => {
    console.warn(`[SECURITY] IP ${req.ip} - Tentatives de création de comptes multiples`);
    res.status(429).json({
      error: 'Sie haben zu viele Konten erstellt. Bitte warten Sie eine Stunde.',
      retryAfter: '1 Stunde'
    });
  }
});

/**
 * Rate limiter pour la réinitialisation de mot de passe
 * 3 tentatives par heure par IP
 * Prévient l'abus du système de récupération
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Limite de 3 tentatives
  message: {
    error: 'Zu viele Anfragen zur Passwortzurücksetzung. Bitte warten Sie eine Stunde.',
    retryAfter: '1 Stunde'
  },
  handler: (req, res) => {
    console.warn(`[SECURITY] IP ${req.ip} - Tentatives de réinitialisation de mot de passe excessives`);
    res.status(429).json({
      error: 'Zu viele Anfragen zur Passwortzurücksetzung. Bitte warten Sie eine Stunde.',
      retryAfter: '1 Stunde'
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  contactLimiter,
  financialLimiter,
  registerLimiter,
  passwordResetLimiter
};

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
