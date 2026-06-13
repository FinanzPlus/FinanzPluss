# 🚀 Démarrage Rapide - FinanzPlus Austria

## ✅ Ce qui est déjà fait

- ✅ Node.js v24.16.0 installé
- ✅ npm 11.13.0 installé
- ✅ Fichiers .env créés (backend et frontend)
- ✅ Dépendances installées (backend et frontend)

## ⚠️ Ce qu'il reste à faire

### 1. Installer PostgreSQL

**Téléchargez PostgreSQL :**
👉 https://www.postgresql.org/download/windows/

**Pendant l'installation :**
- Choisissez le mot de passe : `postgres`
- Port : `5432` (par défaut)
- Cochez "pgAdmin 4" et "Command Line Tools"

**Après l'installation :**
- Redémarrez VSCode pour que `psql` soit reconnu

---

### 2. Créer la Base de Données

**Dans le terminal VSCode, tapez :**

```powershell
# Se connecter à PostgreSQL
psql -U postgres
```

**Mot de passe :** `postgres`

**Puis copiez-collez ces commandes :**

```sql
-- Créer la base de données
CREATE DATABASE finanzplus_austria;

-- Se connecter à la base
\c finanzplus_austria

-- Importer le schéma
\i 'C:/Users/ARISTIDE/Desktop/ARISTIDE404/database/schema.sql'

-- Quitter
\q
```

---

### 3. Démarrer le Backend

**Ouvrez un terminal dans VSCode (Ctrl+ù) et tapez :**

```powershell
cd backend
npm start
```

**Vous devriez voir :**
```
✓ Base de données connectée
✓ Serveur démarré sur le port 5000
```

**⚠️ LAISSEZ CE TERMINAL OUVERT !**

---

### 4. Démarrer le Frontend

**Ouvrez un NOUVEAU terminal (cliquez sur le + en haut du terminal) et tapez :**

```powershell
cd frontend
npm run dev
```

**Vous devriez voir :**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

**⚠️ LAISSEZ CE TERMINAL OUVERT AUSSI !**

---

### 5. Ouvrir l'Application

**Dans votre navigateur, allez sur :**
👉 http://localhost:3000

**🎉 Vous devriez voir la page d'accueil de FinanzPlus Austria !**

---

## 🆘 Problèmes Courants

### Erreur : "psql n'est pas reconnu"

**Solution :**
1. PostgreSQL n'est pas installé → Installez-le
2. Redémarrez VSCode après l'installation
3. Si ça ne marche toujours pas, ajoutez PostgreSQL au PATH :
   - Cherchez "Variables d'environnement" dans Windows
   - Ajoutez `C:\Program Files\PostgreSQL\16\bin` au PATH

### Erreur : "Cannot connect to database"

**Solution :**
1. Vérifiez que PostgreSQL est démarré (cherchez "Services" dans Windows)
2. Vérifiez le mot de passe dans `backend/.env` (doit être `postgres`)
3. Recréez la base de données (étape 2)

### Erreur : "Port 5000 already in use"

**Solution :**
```powershell
# Trouver le processus
netstat -ano | findstr :5000

# Tuer le processus (remplacez <PID> par le numéro)
taskkill /PID <PID> /F
```

### Erreur : "Module not found"

**Solution :**
```powershell
# Réinstaller les dépendances
cd backend
npm install

cd ../frontend
npm install
```

---

## 📋 Résumé des Commandes

```powershell
# 1. Installer PostgreSQL (une seule fois)
# Télécharger depuis https://www.postgresql.org/download/windows/

# 2. Créer la base de données (une seule fois)
psql -U postgres
CREATE DATABASE finanzplus_austria;
\c finanzplus_austria
\i 'C:/Users/ARISTIDE/Desktop/ARISTIDE404/database/schema.sql'
\q

# 3. Démarrer le backend (Terminal 1)
cd backend
npm start

# 4. Démarrer le frontend (Terminal 2)
cd frontend
npm run dev

# 5. Ouvrir http://localhost:3000
```

---

## 🎯 Prochaines Étapes

Une fois que l'application fonctionne :

1. **Tester les fonctionnalités** :
   - Créer un compte utilisateur
   - Simuler un prêt
   - Soumettre une demande
   - Tester le dashboard

2. **Configurer les services externes** (optionnel) :
   - Google Maps API (pour la carte)
   - Email (pour les notifications)
   - WhatsApp Business API (pour le chat)

3. **Ajouter des données de test** :
   - Partenaires bancaires
   - Offres de prêt
   - Avis clients

4. **Préparer le déploiement** :
   - Lire `PRODUCTION_CHECKLIST.md`
   - Configurer un serveur VPS
   - Acheter un nom de domaine

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans les terminaux
2. Consultez `docs/INSTALLATION_GUIDE.md`
3. Vérifiez que tous les services sont démarrés
4. Redémarrez VSCode et réessayez

---

**Bonne chance ! 🚀**