# 📖 Guide d'Installation - FinanzPlus Austria

Ce guide vous accompagne pas à pas dans l'installation et la configuration du projet FinanzPlus Austria.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** v18 ou supérieur ([Télécharger](https://nodejs.org/))
- **PostgreSQL** 14 ou supérieur ([Télécharger](https://www.postgresql.org/download/))
- **npm** ou **yarn** (inclus avec Node.js)
- **Git** ([Télécharger](https://git-scm.com/))

## 🚀 Installation

### Étape 1 : Cloner le projet

```bash
git clone <repository-url>
cd finanzplus-austria
```

### Étape 2 : Installation des dépendances Backend

```bash
cd backend
npm install
```

**Dépendances principales installées :**
- Express.js (serveur web)
- PostgreSQL (base de données)
- JWT (authentification)
- bcrypt (sécurité)
- Stripe (paiements)
- Et bien d'autres...

### Étape 3 : Configuration Backend

1. **Créer le fichier `.env`** :
```bash
cp .env.example .env
```

2. **Éditer le fichier `.env`** avec vos valeurs :

```env
# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finanzplus_austria
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRE=7d

# Email (Gmail exemple)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application

# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe

# WhatsApp
WHATSAPP_NUMBER=+447451267912
```

### Étape 4 : Configuration de la Base de Données

1. **Démarrer PostgreSQL** :
```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# macOS/Linux
sudo service postgresql start
```

2. **Créer la base de données** :
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE finanzplus_austria;

# Quitter
\q
```

3. **Exécuter le schéma SQL** :
```bash
psql -U postgres -d finanzplus_austria -f ../database/schema.sql
```

4. **Vérifier la création des tables** :
```bash
psql -U postgres -d finanzplus_austria

# Lister les tables
\dt

# Vous devriez voir toutes les tables créées
```

### Étape 5 : Installation des dépendances Frontend

```bash
cd ../frontend
npm install
```

**Dépendances principales installées :**
- React 18
- Vite (build tool)
- React Router (navigation)
- Axios (requêtes HTTP)
- Chart.js (graphiques)
- Et bien d'autres...

### Étape 6 : Configuration Frontend

1. **Créer le fichier `.env`** :
```bash
cp .env.example .env
```

2. **Éditer le fichier `.env`** :

```env
# API
VITE_API_URL=http://localhost:5000/api

# WhatsApp
VITE_WHATSAPP_NUMBER=+447451267912

# Stripe (clé publique)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe

# Google Maps (optionnel)
VITE_GOOGLE_MAPS_API_KEY=votre_cle_google_maps
```

## 🎯 Démarrage du Projet

### Option 1 : Démarrage manuel (2 terminaux)

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

Le serveur backend démarre sur `http://localhost:5000`

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

L'application frontend démarre sur `http://localhost:3000`

### Option 2 : Démarrage avec un seul terminal (optionnel)

Vous pouvez créer un script pour démarrer les deux en même temps :

**Windows (PowerShell) :**
```powershell
# Créer start.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

**macOS/Linux (Bash) :**
```bash
# Créer start.sh
#!/bin/bash
cd backend && npm run dev &
cd frontend && npm run dev &
```

## ✅ Vérification de l'Installation

### 1. Tester le Backend

Ouvrez votre navigateur et accédez à :
- **Health Check** : http://localhost:5000/health
- **Test DB** : http://localhost:5000/api/test-db

Vous devriez voir des réponses JSON confirmant que tout fonctionne.

### 2. Tester le Frontend

Ouvrez votre navigateur et accédez à :
- **Application** : http://localhost:3000

Vous devriez voir la page d'accueil de FinanzPlus Austria.

### 3. Tester l'API d'authentification

Utilisez un outil comme **Postman** ou **curl** :

```bash
# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "Test",
    "lastName": "User"
  }'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

## 🔧 Configuration Avancée

### Configuration Email (Gmail)

1. Activer l'authentification à deux facteurs sur votre compte Gmail
2. Générer un mot de passe d'application :
   - Aller dans Paramètres Google > Sécurité
   - Mots de passe des applications
   - Créer un nouveau mot de passe
3. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

### Configuration Stripe

1. Créer un compte sur [Stripe](https://stripe.com)
2. Obtenir vos clés API (mode test) :
   - Clé secrète (backend) : `sk_test_...`
   - Clé publique (frontend) : `pk_test_...`
3. Configurer les webhooks si nécessaire

### Configuration Google Maps (optionnel)

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activer l'API Maps JavaScript
3. Créer une clé API
4. Ajouter la clé dans `VITE_GOOGLE_MAPS_API_KEY`

## 🐛 Résolution des Problèmes

### Problème : Erreur de connexion à PostgreSQL

**Solution :**
```bash
# Vérifier que PostgreSQL est démarré
pg_isready

# Vérifier les identifiants dans .env
# Vérifier que la base de données existe
psql -U postgres -l
```

### Problème : Port déjà utilisé

**Solution :**
```bash
# Windows - Trouver le processus sur le port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Problème : Modules non trouvés

**Solution :**
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : Erreur CORS

**Solution :**
Vérifier que `FRONTEND_URL` dans backend/.env correspond à l'URL du frontend.

## 📚 Prochaines Étapes

Maintenant que l'installation est terminée :

1. ✅ Créer un compte administrateur
2. ✅ Ajouter des produits de test
3. ✅ Configurer les horaires d'ouverture
4. ✅ Tester toutes les fonctionnalités
5. ✅ Personnaliser le design si nécessaire

## 🆘 Besoin d'Aide ?

- 📧 Email : info@finanzplus-austria.com
- 💬 WhatsApp : +447451267912
- 📖 Documentation : Consultez les autres fichiers dans `/docs`

## 🎉 Félicitations !

Votre installation de FinanzPlus Austria est terminée ! Vous pouvez maintenant commencer à utiliser la plateforme.

---

**Dernière mise à jour :** Juin 2026