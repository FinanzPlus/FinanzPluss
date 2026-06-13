const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression des réponses
app.use(compression());

// Logging des requêtes
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'FinanzPlus Austria API est opérationnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Route de test de la base de données
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.status(200).json({
        success: true,
        message: 'Connexion à la base de données réussie'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Échec de la connexion à la base de données'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test de connexion',
      error: error.message
    });
  }
});

// Routes API - FinanzPlus Austria
// Authentication
app.use('/api/auth', require('./routes/auth'));

// Financial Services
app.use('/api/loans', require('./routes/loans'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/credit-score', require('./routes/creditScore'));

// User Services
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/faq', require('./routes/faq'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/contact', require('./routes/contact'));

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      console.error('Vérifiez vos variables d\'environnement dans le fichier .env');
      process.exit(1);
    }

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log('\n🚀 ========================================');
      console.log(`🚀 FinanzPlus Austria API`);
      console.log(`🚀 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🚀 URL: http://localhost:${PORT}`);
      console.log(`🚀 Health check: http://localhost:${PORT}/health`);
      console.log('🚀 ========================================\n');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', promise, 'raison:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Exception non capturée:', error);
  process.exit(1);
});

// Démarrage
startServer();

module.exports = app;

// Made with Bob
