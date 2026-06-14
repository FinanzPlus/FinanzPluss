/**
 * RECAPTCHA VERIFICATION MIDDLEWARE - FINANZPLUS AUSTRIA
 * Vérifie les tokens Google reCAPTCHA v3 côté serveur
 * Protection contre les bots et les abus automatisés
 */

const axios = require('axios');

/**
 * Vérifie un token reCAPTCHA v3 auprès de Google
 * @param {string} token - Token reCAPTCHA généré côté client
 * @param {string} remoteip - Adresse IP du client (optionnel)
 * @returns {Promise<Object>} Résultat de la vérification avec score
 */
const verifyRecaptchaToken = async (token, remoteip = null) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('[RECAPTCHA] Secret key non configurée dans .env');
      return {
        success: false,
        error: 'Configuration reCAPTCHA manquante'
      };
    }

    // Appel à l'API Google reCAPTCHA
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
          ...(remoteip && { remoteip })
        }
      }
    );

    const data = response.data;

    // Log pour le monitoring
    console.log('[RECAPTCHA] Vérification:', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      timestamp: new Date().toISOString()
    });

    return {
      success: data.success,
      score: data.score || 0,
      action: data.action,
      hostname: data.hostname,
      challenge_ts: data.challenge_ts,
      error_codes: data['error-codes'] || []
    };

  } catch (error) {
    console.error('[RECAPTCHA] Erreur lors de la vérification:', error.message);
    return {
      success: false,
      error: 'Erreur de vérification reCAPTCHA',
      details: error.message
    };
  }
};

/**
 * Middleware Express pour vérifier reCAPTCHA
 * Vérifie le token et le score minimum requis
 * @param {number} minScore - Score minimum requis (0.0 à 1.0)
 */
const verifyRecaptcha = (minScore = 0.5) => {
  return async (req, res, next) => {
    try {
      // Récupérer le token depuis le header ou le body
      const token = req.headers['x-recaptcha-token'] || req.body.recaptchaToken;

      if (!token) {
        console.warn('[RECAPTCHA] Token manquant dans la requête');
        return res.status(400).json({
          success: false,
          error: 'Token reCAPTCHA manquant',
          message: 'Bitte bestätigen Sie, dass Sie kein Roboter sind.'
        });
      }

      // Vérifier le token auprès de Google
      const remoteip = req.ip || req.connection.remoteAddress;
      const verification = await verifyRecaptchaToken(token, remoteip);

      // Vérifier le résultat
      if (!verification.success) {
        console.warn('[RECAPTCHA] Vérification échouée:', verification.error_codes);
        return res.status(400).json({
          success: false,
          error: 'Vérification reCAPTCHA échouée',
          message: 'Die reCAPTCHA-Überprüfung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
          details: verification.error_codes
        });
      }

      // Vérifier le score minimum
      const score = verification.score;
      if (score < minScore) {
        console.warn(`[RECAPTCHA] Score trop faible: ${score} < ${minScore} (IP: ${remoteip})`);
        
        // Log pour analyse de sécurité
        console.error('[SECURITY ALERT] Activité suspecte détectée:', {
          ip: remoteip,
          score: score,
          action: verification.action,
          path: req.path,
          method: req.method,
          timestamp: new Date().toISOString()
        });

        return res.status(403).json({
          success: false,
          error: 'Score reCAPTCHA insuffisant',
          message: 'Verdächtige Aktivität erkannt. Ihr Zugriff wurde aus Sicherheitsgründen blockiert.',
          score: score,
          required: minScore
        });
      }

      // Succès - Ajouter les infos reCAPTCHA à la requête
      req.recaptcha = {
        score: score,
        action: verification.action,
        hostname: verification.hostname,
        verified: true
      };

      console.log(`[RECAPTCHA] ✅ Vérification réussie - Score: ${score} (IP: ${remoteip})`);
      next();

    } catch (error) {
      console.error('[RECAPTCHA] Erreur middleware:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification reCAPTCHA',
        message: 'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      });
    }
  };
};

/**
 * Middleware reCAPTCHA avec score standard (0.5)
 * Utilisation : router.post('/route', verifyRecaptchaStandard, controller)
 */
const verifyRecaptchaStandard = verifyRecaptcha(0.5);

/**
 * Middleware reCAPTCHA avec score strict (0.7)
 * Pour les opérations sensibles (transactions, changement de mot de passe)
 * Utilisation : router.post('/route', verifyRecaptchaStrict, controller)
 */
const verifyRecaptchaStrict = verifyRecaptcha(0.7);

/**
 * Middleware reCAPTCHA avec score permissif (0.3)
 * Pour les formulaires moins critiques (contact, newsletter)
 * Utilisation : router.post('/route', verifyRecaptchaLenient, controller)
 */
const verifyRecaptchaLenient = verifyRecaptcha(0.3);

module.exports = {
  verifyRecaptchaToken,
  verifyRecaptcha,
  verifyRecaptchaStandard,
  verifyRecaptchaStrict,
  verifyRecaptchaLenient
};

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
