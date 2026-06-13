# 🚀 Guide de Démarrage Rapide - FinanzPlus Austria

Ce guide vous permet de démarrer rapidement le projet FinanzPlus Austria.

## ⚡ Démarrage Rapide (5 minutes)

### 1. Prérequis
- Node.js v18+ installé
- PostgreSQL 14+ installé et démarré
- Git installé

### 2. Installation Express

```bash
# Cloner le projet
git clone <repository-url>
cd finanzplus-austria

# Installer les dépendances Backend
cd backend
npm install

# Installer les dépendances Frontend
cd ../frontend
npm install
```

### 3. Configuration Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE finanzplus_austria;
\q

# Exécuter le schéma
psql -U postgres -d finanzplus_austria -f database/schema.sql
```

### 4. Configuration des Variables d'Environnement

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Éditer `backend/.env` avec vos valeurs minimales :
```env
DB_PASSWORD=votre_mot_de_passe_postgres
JWT_SECRET=votre_secret_jwt_unique
```

**Frontend (.env):**
```bash
cd ../frontend
cp .env.example .env
```

Le fichier frontend/.env peut rester avec les valeurs par défaut pour le développement local.

### 5. Démarrer l'Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend démarre sur http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend démarre sur http://localhost:3000

### 6. Tester l'Application

Ouvrez votre navigateur sur http://localhost:3000

Vous devriez voir la page d'accueil de FinanzPlus Austria ! 🎉

## 📋 Vérifications

### Backend
- ✅ http://localhost:5000/health - Doit retourner `{"status":"OK"}`
- ✅ http://localhost:5000/api/test-db - Doit confirmer la connexion DB

### Frontend
- ✅ http://localhost:3000 - Page d'accueil
- ✅ http://localhost:3000/anmelden - Page de connexion
- ✅ http://localhost:3000/registrieren - Page d'inscription

## 🎯 Prochaines Étapes

1. **Créer un compte admin** (via l'API ou directement en DB)
2. **Ajouter des produits de test**
3. **Tester les fonctionnalités**

## 🐛 Problèmes Courants

### Erreur de connexion PostgreSQL
```bash
# Vérifier que PostgreSQL est démarré
pg_isready

# Vérifier les identifiants dans backend/.env
```

### Port déjà utilisé
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Modules non trouvés
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation Complète

Pour plus de détails, consultez :
- [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) - Guide d'installation complet
- [README.md](../README.md) - Vue d'ensemble du projet
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - Architecture du projet

## 🆘 Support

- 📧 Email : info@finanzplus-austria.com
- 💬 WhatsApp : +447451267912

---

**Bon développement ! 🚀**