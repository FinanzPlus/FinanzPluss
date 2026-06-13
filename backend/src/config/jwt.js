const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

/**
 * Génère un token JWT d'accès
 * @param {Object} payload - Données à encoder dans le token
 * @returns {String} Token JWT
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Génère un token JWT de rafraîchissement
 * @param {Object} payload - Données à encoder dans le token
 * @returns {String} Token JWT de rafraîchissement
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE
  });
};

/**
 * Vérifie et décode un token JWT d'accès
 * @param {String} token - Token à vérifier
 * @returns {Object} Payload décodé
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};

/**
 * Vérifie et décode un token JWT de rafraîchissement
 * @param {String} token - Token à vérifier
 * @returns {Object} Payload décodé
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Token de rafraîchissement invalide ou expiré');
  }
};

/**
 * Génère les deux tokens (accès et rafraîchissement)
 * @param {Object} user - Données utilisateur
 * @returns {Object} Objet contenant les deux tokens
 */
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens
};

// Made with Bob
