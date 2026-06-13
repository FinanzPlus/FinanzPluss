# 🚀 DÉMARRAGE RAPIDE - FinanzPlus Austria

## ⚠️ IMPORTANT: Suivez ces étapes dans l'ordre

---

## 📋 ÉTAPE 1: Initialiser la Base de Données (OBLIGATOIRE)

### Méthode Recommandée: pgAdmin 4

1. **Ouvrir pgAdmin 4**
   - Cherchez "pgAdmin 4" dans le menu Démarrer Windows
   - Cliquez pour ouvrir

2. **Se connecter**
   - Entrez le mot de passe que vous avez défini lors de l'installation de PostgreSQL
   - Cliquez sur "OK"

3. **Créer la base de données**
   - Dans le panneau de gauche, clic droit sur "Databases"
   - Sélectionnez "Create" → "Database..."
   - Dans "Database", tapez: `finanzplus_austria`
   - Cliquez sur "Save"

4. **Importer le schéma**
   - Clic droit sur la nouvelle base de données "finanzplus_austria"
   - Sélectionnez "Query Tool"
   - Dans Query Tool, cliquez sur "Open File" (icône dossier)
   - Naviguez vers: `C:\Users\ARISTIDE\Desktop\ARISTIDE404\database\schema.sql`
   - Cliquez sur "Open"
   - Cliquez sur le bouton "Execute" (▶️ triangle vert)
   - Attendez que toutes les requêtes s'exécutent (environ 30 secondes)
   - Vous devriez voir "Query returned successfully" en bas

✅ **Base de données initialisée!**

---

## 📋 ÉTAPE 2: Démarrer le Serveur Backend

1. **Ouvrir un terminal dans VS Code**
   - Dans VS Code, menu: Terminal → New Terminal
   - Ou appuyez sur: `Ctrl + Shift + ù`

2. **Naviguer vers le dossier backend**
   ```powershell
   cd backend
   ```

3. **Démarrer le serveur**
   ```powershell
   npm run dev
   ```

4. **Vérifier que ça fonctionne**
   - Vous devriez voir:
   ```
   ✓ Serveur démarré sur le port 5000
   ✓ Base de données connectée
   ```

⚠️ **IMPORTANT: Laissez ce terminal ouvert!** Le serveur backend doit rester actif.

---

## 📋 ÉTAPE 3: Démarrer le Serveur Frontend

1. **Ouvrir un NOUVEAU terminal**
   - Dans VS Code, cliquez sur le "+" à côté du terminal actuel
   - Ou menu: Terminal → New Terminal

2. **Naviguer vers le dossier frontend**
   ```powershell
   cd frontend
   ```

3. **Démarrer le serveur**
   ```powershell
   npm run dev
   ```

4. **Vérifier que ça fonctionne**
   - Vous devriez voir:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

⚠️ **IMPORTANT: Laissez ce terminal ouvert aussi!**

---

## 📋 ÉTAPE 4: Accéder à l'Application

1. **Ouvrir votre navigateur**
   - Chrome, Firefox, Edge, etc.

2. **Aller sur l'adresse**
   ```
   http://localhost:3000
   ```

3. **Vous devriez voir la page d'accueil de FinanzPlus Austria!** 🎉

---

## 👤 ÉTAPE 5: Créer un Compte Utilisateur

1. **Cliquez sur "Registrieren" (S'inscrire)**

2. **Remplissez le formulaire**
   - Nom complet
   - Email
   - Mot de passe (minimum 6 caractères)

3. **Cliquez sur "Registrieren"**

4. **Vous êtes maintenant connecté!**

---

## 👑 ÉTAPE 6: Devenir Administrateur (Optionnel)

Pour accéder au dashboard admin et ajouter des produits:

1. **Ouvrir pgAdmin 4**

2. **Ouvrir Query Tool**
   - Clic droit sur "finanzplus_austria" → "Query Tool"

3. **Exécuter cette commande**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'votre_email@example.com';
   ```
   - Remplacez `votre_email@example.com` par l'email que vous avez utilisé

4. **Cliquez sur Execute (▶️)**

5. **Déconnectez-vous et reconnectez-vous**
   - Vous verrez maintenant "Admin Dashboard" dans le menu

---

## 🎯 Que Faire Ensuite?

### Explorer l'Application:
- ✅ **Voitures**: Parcourir le catalogue de voitures
- ✅ **Meubles**: Parcourir le catalogue de meubles
- ✅ **Simulateur**: Calculer un prêt
- ✅ **Contact**: Voir les horaires d'ouverture
- ✅ **Panier**: Ajouter des produits au panier

### En tant qu'Admin:
- ✅ **Dashboard Admin**: Ajouter des produits
- ✅ **Gérer les commentaires**: Approuver/rejeter les avis
- ✅ **Voir les statistiques**: Nombre de produits, utilisateurs, etc.

---

## 🆘 Problèmes Courants

### ❌ "Cannot connect to database"
**Solution**: Vérifiez que PostgreSQL est démarré
- Ouvrez "Services" Windows (Win + R → `services.msc`)
- Cherchez "postgresql-x64-18"
- Clic droit → "Start" si arrêté

### ❌ "Port 5000 already in use"
**Solution**: Un autre programme utilise le port
```powershell
# Trouver le processus
netstat -ano | findstr :5000
# Tuer le processus (remplacez PID par le numéro affiché)
taskkill /PID <PID> /F
```

### ❌ "Port 3000 already in use"
**Solution**: Même chose pour le port 3000
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ Page blanche dans le navigateur
**Solution**: 
1. Vérifiez que les deux serveurs (backend ET frontend) sont actifs
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Vérifiez l'URL: doit être `http://localhost:3000` (pas 5000)

---

## 📞 Informations Utiles

### URLs:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **pgAdmin**: http://localhost:5050 (si installé)

### Identifiants Base de Données:
- **Base**: finanzplus_austria
- **Utilisateur**: postgres
- **Port**: 5432
- **Hôte**: localhost

### Commandes Utiles:
```powershell
# Arrêter les serveurs
Ctrl + C (dans chaque terminal)

# Redémarrer le backend
cd backend
npm run dev

# Redémarrer le frontend
cd frontend
npm run dev

# Voir les logs en temps réel
# Les logs s'affichent automatiquement dans les terminaux
```

---

## ✅ Checklist de Vérification

Avant de commencer, assurez-vous que:
- [ ] PostgreSQL est installé et démarré
- [ ] Node.js est installé (v24.16.0)
- [ ] Les dépendances sont installées (node_modules existe dans backend/ et frontend/)
- [ ] Les fichiers .env existent (backend/.env et frontend/.env)
- [ ] La base de données est créée et le schéma importé
- [ ] Les deux serveurs sont démarrés (backend et frontend)
- [ ] Vous pouvez accéder à http://localhost:3000

---

**🎉 Félicitations! Votre application FinanzPlus Austria est maintenant opérationnelle!**

Pour plus d'informations, consultez:
- **SETUP_GUIDE.md** - Guide de configuration détaillé
- **README.md** - Documentation du projet
- **docs/** - Documentation technique complète