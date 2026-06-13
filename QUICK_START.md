# 🚀 Guide de Démarrage Rapide - FinanzPlus Austria

Ce guide vous permet de démarrer le projet en quelques minutes.

---

## ⚡ Démarrage en 5 minutes

### 1. Prérequis

Assurez-vous d'avoir installé :
- **Node.js** v18+ : [nodejs.org](https://nodejs.org)
- **PostgreSQL** v14+ : [postgresql.org](https://www.postgresql.org/download/)
- **Git** : [git-scm.com](https://git-scm.com)

### 2. Cloner le projet

```bash
git clone https://github.com/votre-repo/finanzplus-austria.git
cd finanzplus-austria
```

### 3. Configuration de la base de données

```bash
# Démarrer PostgreSQL
# Windows : Démarrer le service PostgreSQL depuis les services
# Mac : brew services start postgresql
# Linux : sudo systemctl start postgresql

# Créer la base de données
psql -U postgres

# Dans psql :
CREATE DATABASE finanzplus_dev;
CREATE USER finanzplus_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE finanzplus_dev TO finanzplus_user;
\q

# Importer le schéma
psql -U finanzplus_user -d finanzplus_dev -f database/schema.sql
```

### 4. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos paramètres
# Minimum requis :
# DB_HOST=localhost
# DB_NAME=finanzplus_dev
# DB_USER=finanzplus_user
# DB_PASSWORD=dev_password
# JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
# JWT_REFRESH_SECRET=votre_secret_refresh_tres_long_et_aleatoire

# Démarrer le serveur
npm run dev
```

Le backend démarre sur **http://localhost:5000**

### 5. Configuration du Frontend

```bash
# Dans un nouveau terminal
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Le fichier .env devrait contenir :
# VITE_API_URL=http://localhost:5000

# Démarrer l'application
npm run dev
```

Le frontend démarre sur **http://localhost:3000**

---

## 🎯 Premiers pas

### 1. Créer un compte utilisateur

1. Ouvrir **http://localhost:3000**
2. Cliquer sur **"Registrieren"** (S'inscrire)
3. Remplir le formulaire :
   - Prénom : Test
   - Nom : User
   - Email : test@example.com
   - Mot de passe : Test123!
4. Cliquer sur **"Konto erstellen"**

### 2. Se connecter

1. Cliquer sur **"Anmelden"** (Se connecter)
2. Email : test@example.com
3. Mot de passe : Test123!
4. Cliquer sur **"Anmelden"**

### 3. Explorer les fonctionnalités

#### Catalogue de voitures
- Aller sur **"Autos"** dans le menu
- Utiliser les filtres (marque, année, prix, carburant)
- Cliquer sur un produit pour voir les détails

#### Catalogue de meubles
- Aller sur **"Möbel"** dans le menu
- Utiliser les filtres (type, matériau, style)
- Cliquer sur un produit pour voir les détails

#### Panier
- Ajouter des produits au panier
- Cliquer sur l'icône panier (🛒) dans le header
- Modifier les quantités
- Voir le total et les frais de port

#### Simulateur de crédit
- Aller sur **"Kreditrechner"** dans le menu
- Ajuster le montant et la durée avec les sliders
- Voir le calcul en temps réel
- Consulter le tableau d'amortissement
- Soumettre une demande de crédit

#### Système de commentaires
- Aller sur une page produit
- Descendre à la section "Bewertungen"
- Cliquer sur **"Bewertung schreiben"**
- Donner une note (1-5 étoiles)
- Écrire un commentaire
- Soumettre (nécessite modération admin)

#### Contact
- Aller sur **"Kontakt"** dans le menu
- Voir les horaires d'ouverture
- Voir le statut ouvert/fermé en temps réel
- Remplir le formulaire de contact
- Voir la carte Google Maps

---

## 👨‍💼 Accès Administrateur

### 1. Créer un compte admin

```bash
# Se connecter à PostgreSQL
psql -U finanzplus_user -d finanzplus_dev

# Mettre à jour le rôle d'un utilisateur
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
\q
```

### 2. Accéder au dashboard

1. Se reconnecter avec le compte admin
2. Cliquer sur **"Admin"** dans le menu utilisateur
3. Accéder au dashboard administrateur

### 3. Fonctionnalités admin

- **Statistiques** : Vue d'ensemble des données
- **Produits** : Gérer les voitures et meubles
- **Commentaires** : Modérer les avis clients
- **Messages** : Gérer les demandes de contact
- **Prêts** : Gérer les demandes de crédit
- **Horaires** : Modifier les heures d'ouverture

---

## 🧪 Tester les APIs

### Avec curl

```bash
# Test de santé
curl http://localhost:5000/health

# Test de connexion DB
curl http://localhost:5000/api/test-db

# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@example.com",
    "password": "Test123!",
    "first_name": "API",
    "last_name": "User"
  }'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@example.com",
    "password": "Test123!"
  }'

# Récupérer les produits
curl http://localhost:5000/api/products

# Calculer un prêt
curl -X POST http://localhost:5000/api/financial/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "duration": 24,
    "interest_rate": 3
  }'
```

### Avec Postman

1. Importer la collection (à créer)
2. Tester les endpoints
3. Voir les réponses

---

## 📝 Ajouter des données de test

### Produits de test

```sql
-- Se connecter à la base de données
psql -U finanzplus_user -d finanzplus_dev

-- Ajouter une voiture
INSERT INTO products (name, description, price, category, stock) 
VALUES ('BMW 320d', 'Berline sportive diesel', 25000, 'car', 1)
RETURNING id;

-- Utiliser l'ID retourné (par exemple 1)
INSERT INTO cars (product_id, brand, model, year, mileage, fuel_type, transmission, color, horsepower)
VALUES (1, 'BMW', '320d', 2020, 45000, 'Diesel', 'Automatique', 'Noir', 190);

-- Ajouter un meuble
INSERT INTO products (name, description, price, category, stock)
VALUES ('Canapé en cuir', 'Canapé 3 places en cuir véritable', 1200, 'furniture', 5)
RETURNING id;

-- Utiliser l'ID retourné (par exemple 2)
INSERT INTO furniture (product_id, type, material, style, color, dimensions)
VALUES (2, 'Canapé', 'Cuir', 'Moderne', 'Marron', '220x90x85 cm');
```

### Horaires d'ouverture

```bash
# Initialiser les horaires par défaut
cd backend
node -e "
const Contact = require('./src/models/Contact');
Contact.initializeOpeningHours().then(() => {
  console.log('✅ Horaires initialisés');
  process.exit(0);
}).catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
"
```

---

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier que PostgreSQL est démarré
# Windows : services.msc
# Mac : brew services list
# Linux : sudo systemctl status postgresql

# Vérifier les logs
cd backend
npm run dev
# Lire les messages d'erreur
```

### Erreur de connexion à la base de données

```bash
# Vérifier les credentials dans .env
cat backend/.env

# Tester la connexion manuellement
psql -U finanzplus_user -d finanzplus_dev

# Si échec, recréer l'utilisateur
psql -U postgres
DROP USER IF EXISTS finanzplus_user;
CREATE USER finanzplus_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE finanzplus_dev TO finanzplus_user;
```

### Le frontend ne se connecte pas au backend

```bash
# Vérifier que le backend est démarré
curl http://localhost:5000/health

# Vérifier l'URL dans frontend/.env
cat frontend/.env
# Doit contenir : VITE_API_URL=http://localhost:5000

# Redémarrer le frontend
cd frontend
npm run dev
```

### Erreur JWT

```bash
# Régénérer les secrets JWT
cd backend

# Générer un nouveau secret (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copier le résultat dans .env
# JWT_SECRET=le_nouveau_secret
# JWT_REFRESH_SECRET=un_autre_secret

# Redémarrer le backend
npm run dev
```

---

## 📚 Documentation complète

- **Installation** : `docs/INSTALLATION_GUIDE.md`
- **Tests** : `docs/TESTING_GUIDE.md`
- **Déploiement** : `docs/DEPLOYMENT_GUIDE.md`
- **Progression** : `docs/PROGRESS_REPORT.md`

---

## 🆘 Support

### Problèmes courants

1. **Port déjà utilisé** : Changer le port dans `.env`
2. **Modules manquants** : Relancer `npm install`
3. **Base de données vide** : Réimporter `schema.sql`
4. **Token expiré** : Se reconnecter

### Ressources

- **Documentation Node.js** : https://nodejs.org/docs
- **Documentation React** : https://react.dev
- **Documentation PostgreSQL** : https://www.postgresql.org/docs
- **Documentation Express** : https://expressjs.com

---

## ✅ Checklist de démarrage

- [ ] PostgreSQL installé et démarré
- [ ] Base de données créée
- [ ] Schéma importé
- [ ] Backend configuré (.env)
- [ ] Backend démarré (port 5000)
- [ ] Frontend configuré (.env)
- [ ] Frontend démarré (port 3000)
- [ ] Compte utilisateur créé
- [ ] Connexion réussie
- [ ] Produits de test ajoutés
- [ ] Horaires initialisés
- [ ] Toutes les pages testées

---

**Bon développement ! 🚀**

Si vous rencontrez des problèmes, consultez la documentation complète ou créez une issue sur GitHub.