# Guide de Configuration - FinanzPlus Austria

## 🚀 Configuration Rapide

### Étape 1: Initialiser la Base de Données PostgreSQL

Ouvrez **pgAdmin 4** (installé avec PostgreSQL) ou utilisez les commandes suivantes dans un terminal PowerShell :

#### Option A: Via pgAdmin 4 (Recommandé pour débutants)

1. Ouvrez **pgAdmin 4** depuis le menu Démarrer
2. Connectez-vous avec le mot de passe que vous avez défini lors de l'installation
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom: `finanzplus_austria`
5. Cliquez sur "Save"
6. Clic droit sur la nouvelle base de données → "Query Tool"
7. Ouvrez le fichier `database/schema.sql` dans un éditeur de texte
8. Copiez tout le contenu et collez-le dans Query Tool
9. Cliquez sur le bouton "Execute" (▶️)

#### Option B: Via Ligne de Commande

```powershell
# 1. Ouvrir PowerShell en tant qu'administrateur

# 2. Créer la base de données
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE finanzplus_austria;"

# 3. Créer l'utilisateur
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE USER finanzplus_user WITH PASSWORD 'FinanzPlus2024!Secure';"

# 4. Donner les privilèges
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE finanzplus_austria TO finanzplus_user;"

# 5. Importer le schéma
cd C:\Users\ARISTIDE\Desktop\ARISTIDE404\database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d finanzplus_austria -f schema.sql
```

### Étape 2: Démarrer le Serveur Backend

```powershell
# Dans un nouveau terminal PowerShell
cd C:\Users\ARISTIDE\Desktop\ARISTIDE404\backend
npm run dev
```

Le serveur backend démarrera sur **http://localhost:5000**

### Étape 3: Démarrer le Serveur Frontend

```powershell
# Dans un AUTRE terminal PowerShell (gardez le backend en cours d'exécution)
cd C:\Users\ARISTIDE\Desktop\ARISTIDE404\frontend
npm run dev
```

Le serveur frontend démarrera sur **http://localhost:3000**

### Étape 4: Accéder à l'Application

Ouvrez votre navigateur et allez sur: **http://localhost:3000**

---

## 📋 Vérifications

### Vérifier que Node.js est installé
```powershell
node --version
# Devrait afficher: v24.16.0 ou similaire
```

### Vérifier que PostgreSQL est installé
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" --version
# Devrait afficher: psql (PostgreSQL) 18.4
```

### Vérifier que les dépendances sont installées
```powershell
# Backend
Test-Path "C:\Users\ARISTIDE\Desktop\ARISTIDE404\backend\node_modules"
# Devrait afficher: True

# Frontend
Test-Path "C:\Users\ARISTIDE\Desktop\ARISTIDE404\frontend\node_modules"
# Devrait afficher: True
```

---

## 🔧 Résolution des Problèmes

### Problème: "psql n'est pas reconnu"
**Solution**: Utilisez le chemin complet:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
```

### Problème: "node n'est pas reconnu"
**Solution**: 
1. Fermez complètement VS Code
2. Rouvrez VS Code
3. Réessayez

### Problème: "La base de données existe déjà"
**Solution**: C'est normal, continuez avec l'import du schéma

### Problème: Port 5000 ou 3000 déjà utilisé
**Solution**: 
```powershell
# Trouver le processus utilisant le port
netstat -ano | findstr :5000
# Tuer le processus (remplacez PID par le numéro affiché)
taskkill /PID <PID> /F
```

---

## 📝 Informations de Connexion

### Base de Données
- **Hôte**: localhost
- **Port**: 5432
- **Base de données**: finanzplus_austria
- **Utilisateur**: finanzplus_user
- **Mot de passe**: FinanzPlus2024!Secure

### Serveurs
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Compte Admin (à créer après le premier démarrage)
1. Inscrivez-vous via l'interface: http://localhost:3000/register
2. Connectez-vous à PostgreSQL et exécutez:
```sql
UPDATE users SET role = 'admin' WHERE email = 'votre_email@example.com';
```

---

## 🎯 Prochaines Étapes

1. ✅ Initialiser la base de données (Étape 1)
2. ✅ Démarrer le backend (Étape 2)
3. ✅ Démarrer le frontend (Étape 3)
4. ✅ Créer un compte utilisateur
5. ✅ Promouvoir votre compte en admin
6. ✅ Ajouter des produits via le dashboard admin
7. ✅ Tester toutes les fonctionnalités

---

## 📞 Support

Si vous rencontrez des problèmes, vérifiez:
1. Les logs du terminal backend
2. Les logs du terminal frontend
3. La console du navigateur (F12)

Bonne configuration! 🚀