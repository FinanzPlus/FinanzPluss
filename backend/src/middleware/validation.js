const { validationResult } = require('express-validator');

/**
 * Middleware de validation des données
 * Vérifie les erreurs de validation et retourne une réponse appropriée
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation échouée',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

module.exports = { validate };

// Made with Bob
