# 🏦 FinanzPlus Austria - Plateforme E-commerce

## 📖 Description

FinanzPlus Austria est une plateforme e-commerce complète en langue allemande, spécialisée dans la vente de voitures, de meubles et l'offre de services financiers (crédit, leasing, financement).

## ✨ Fonctionnalités Principales

### 🚗 Catalogue de Voitures
- Filtres avancés (marque, année, prix, kilométrage, carburant, transmission)
- Fiches détaillées avec galerie photos
- Calcul de financement intégré

### 🪑 Catalogue de Meubles
- Filtres par type, matériau, style, couleur
- Visualisation détaillée des produits
- Options de financement disponibles

### 💰 Services Financiers
- **Simulateur de prêt interactif** avec taux fixe de 3%
- Tableau d'amortissement complet
- Demandes de financement en ligne
- Partenariats avec banques autrichiennes

### 👥 Gestion Utilisateurs
- Inscription/Connexion sécurisée (JWT)
- Profils utilisateurs
- Historique des commandes
- Système de favoris

### 🛒 Panier d'Achat
- Ajout/suppression de produits
- Calcul automatique du total
- Persistance des données (localStorage)

### ⭐ Système d'Avis
- Notation par étoiles (1-5)
- Commentaires clients
- Modération par les administrateurs
- Statistiques de satisfaction

### 📞 Contact & Support
- Horaires d'ouverture dynamiques
- Formulaire de contact
- Intégration WhatsApp (+447451267912)
- Carte Google Maps

### 👑 Dashboard Administrateur
- Gestion des produits (CRUD)
- Modération des commentaires
- Statistiques en temps réel
- Gestion des utilisateurs

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** v24.16.0
- **Express.js** - Framework web
- **PostgreSQL** 18.4 - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hachage des mots de passe
- **Multer** - Upload de fichiers
- **Nodemailer** - Envoi d'emails

### Frontend
- **React** 18.3.1 - Bibliothèque UI
- **Vite** 5.4.11 - Build tool
- **React Router** v6 - Routing
- **Axios** - Requêtes HTTP
- **Context API** - Gestion d'état

### Base de Données
- **PostgreSQL** 18.4
- 20+ tables relationnelles
- Indexes optimisés
- Contraintes d'intégrité

## 📁 Structure du Projet

```
ARISTIDE404/
├── backend/                 # Serveur Node.js/Express
│   ├── src/
│   │   ├── config/         # Configuration (DB, JWT)
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/     # Middleware (auth, validation)
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   └── server.js       # Point d'entrée
│   ├── .env                # Variables d'environnement
│   └── package.json        # Dépendances backend
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── context/       # Context API (Auth, Cart)
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── styles/        # Styles globaux
│   │   └── utils/         # Utilitaires
│   ├── .env               # Variables d'environnement
│   └── package.json       # Dépendances frontend
│
├── database/              # Base de données
│   ├── schema.sql        # Schéma complet
│   ├── init-db.bat       # Script d'initialisation
│   └── init-db.ps1       # Script PowerShell
│
├── docs/                  # Documentation
│   ├── INSTALLATION_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── TESTING_GUIDE.md
│   └── QUICK_START.md
│
├── START_HERE.md         # 🚀 Guide de démarrage rapide
├── SETUP_GUIDE.md        # Guide de configuration
└── README.md             # Ce fichier
```

## 🚀 Démarrage Rapide

### Prérequis
- ✅ Node.js v24.16.0 installé
- ✅ PostgreSQL 18.4 installé
- ✅ Git (optionnel)

### Installation en 6 Étapes

**📖 Pour un guide détaillé étape par étape, consultez [START_HERE.md](START_HERE.md)**

#### 1. Initialiser la Base de Données

**Via pgAdmin 4 (Recommandé):**
1. Ouvrir pgAdmin 4
2. Créer une base de données: `finanzplus_austria`
3. Ouvrir Query Tool
4. Importer `database/schema.sql`
5. Exécuter

**Via Terminal:**
```powershell
cd database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d finanzplus_austria -f schema.sql
```

#### 2. Démarrer le Backend

```powershell
cd backend
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

#### 3. Démarrer le Frontend

```powershell
# Dans un nouveau terminal
cd frontend
npm run dev
```

L'application démarre sur **http://localhost:3000**

#### 4. Accéder à l'Application

Ouvrez votre navigateur: **http://localhost:3000**

#### 5. Créer un Compte

Cliquez sur "Registrieren" et créez votre compte

#### 6. Devenir Admin (Optionnel)

```sql
-- Dans pgAdmin Query Tool
UPDATE users SET role = 'admin' WHERE email = 'votre_email@example.com';
```

## 📊 Base de Données

### Tables Principales

- **users** - Utilisateurs et administrateurs
- **products** - Produits (table parent)
- **cars** - Détails des voitures
- **furniture** - Détails des meubles
- **financial_offers** - Offres de financement
- **loan_requests** - Demandes de prêt
- **comments** - Avis clients
- **orders** - Commandes
- **order_items** - Détails des commandes
- **opening_hours** - Horaires d'ouverture
- **contact_messages** - Messages de contact

### Schéma Relationnel

```
users (1) ----< (N) orders
users (1) ----< (N) comments
users (1) ----< (N) loan_requests

products (1) ----< (1) cars
products (1) ----< (1) furniture
products (1) ----< (N) comments
products (1) ----< (N) order_items

orders (1) ----< (N) order_items
```

## 🔐 Sécurité

- ✅ Authentification JWT avec refresh tokens
- ✅ Mots de passe hachés avec bcrypt (10 rounds)
- ✅ Protection CSRF
- ✅ Rate limiting sur les API
- ✅ Validation des entrées
- ✅ Sanitization des données
- ✅ CORS configuré
- ✅ Headers de sécurité (Helmet)

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Modifier le profil

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Voitures
- `GET /api/products/cars` - Liste des voitures
- `GET /api/products/cars/:id` - Détail d'une voiture

### Meubles
- `GET /api/products/furniture` - Liste des meubles
- `GET /api/products/furniture/:id` - Détail d'un meuble

### Services Financiers
- `POST /api/financial/calculate` - Calculer un prêt
- `POST /api/financial/request` - Demander un financement
- `GET /api/financial/requests` - Liste des demandes (admin)

### Commentaires
- `GET /api/comments/product/:productId` - Commentaires d'un produit
- `POST /api/comments` - Ajouter un commentaire
- `PUT /api/comments/:id/approve` - Approuver (admin)
- `DELETE /api/comments/:id` - Supprimer (admin)

### Contact
- `GET /api/contact/hours` - Horaires d'ouverture
- `GET /api/contact/status` - Statut ouvert/fermé
- `POST /api/contact/message` - Envoyer un message

## 🎨 Design

- **Couleurs principales**: Noir, gris foncé, rouge, or
- **Police**: System fonts (optimisé pour la performance)
- **Responsive**: Mobile-first design
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablette: 768px - 1024px
  - Desktop: > 1024px

## 🌍 Langue

Toute l'interface est en **allemand (Deutsch)**:
- Textes de l'interface
- Messages d'erreur
- Emails
- Documentation utilisateur

## 📱 Fonctionnalités Mobiles

- ✅ Design responsive
- ✅ Menu hamburger
- ✅ Touch-friendly
- ✅ Images optimisées
- ✅ Bouton WhatsApp flottant

## 🧪 Tests

Pour exécuter les tests:

```powershell
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test

# Tests E2E
npm run test:e2e
```

Consultez [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) pour plus de détails.

## 📦 Déploiement

Pour déployer en production, consultez [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

### Checklist de Déploiement
- [ ] Configurer les variables d'environnement de production
- [ ] Sécuriser la base de données
- [ ] Configurer HTTPS/SSL
- [ ] Configurer le reverse proxy (Nginx)
- [ ] Mettre en place les sauvegardes
- [ ] Configurer le monitoring
- [ ] Tester en environnement de staging

## 🤝 Contribution

Ce projet a été développé pour FinanzPlus Austria.

## 📄 Licence

Propriétaire - FinanzPlus Austria © 2024

## 📞 Support

- **Email**: support@finanzplus-austria.com
- **WhatsApp**: +447451267912
- **Documentation**: Consultez le dossier `docs/`

## 🎯 Roadmap

### Version 1.1 (À venir)
- [ ] Système de paiement en ligne
- [ ] Notifications push
- [ ] Chat en direct
- [ ] Application mobile (React Native)
- [ ] Comparateur de produits
- [ ] Wishlist partageable

### Version 1.2
- [ ] Multi-langue (anglais, français)
- [ ] Programme de fidélité
- [ ] Recommandations personnalisées
- [ ] Blog intégré

## 📈 Statistiques du Projet

- **Lignes de code**: ~15,000+
- **Fichiers**: 100+
- **Composants React**: 30+
- **Endpoints API**: 40+
- **Tables DB**: 20+
- **Temps de développement**: 3 semaines

## 🙏 Remerciements

Merci d'utiliser FinanzPlus Austria!

---

**Développé avec ❤️ pour FinanzPlus Austria**

Pour commencer, consultez [START_HERE.md](START_HERE.md) 🚀