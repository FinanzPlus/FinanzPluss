const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'finanzplus_austria',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Temps avant qu'un client inactif soit fermé
  connectionTimeoutMillis: 2000, // Temps d'attente pour obtenir une connexion
});

// Gestion des erreurs de connexion
pool.on('error', (err, client) => {
  console.error('Erreur inattendue sur le client PostgreSQL inactif', err);
  process.exit(-1);
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion à la base de données PostgreSQL établie');
});

// Fonction pour exécuter des requêtes
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Requête exécutée', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête', { text, error: error.message });
    throw error;
  }
};

// Fonction pour obtenir un client du pool (pour les transactions)
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Timeout pour libérer automatiquement le client après 5 secondes
  const timeout = setTimeout(() => {
    console.error('Un client n\'a pas été libéré dans les 5 secondes!');
    console.error('Le dernier appel de requête était:', client.lastQuery);
  }, 5000);

  // Wrapper pour tracer les requêtes
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release();
  };

  return client;
};

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Test de connexion réussi:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Échec du test de connexion:', error.message);
    return false;
  }
};

// Fonction pour fermer le pool proprement
const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Pool de connexions fermé proprement');
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture du pool:', error.message);
  }
};

module.exports = {
  query,
  getClient,
  pool,
  testConnection,
  closePool
};

// Made with Bob
