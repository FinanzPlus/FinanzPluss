# 🚀 Déploiement Backend sur Railway - FinanzPlus Austria

## Pourquoi Railway plutôt que Vercel pour le Backend ?

❌ **Vercel**: Fonctions serverless (limitées pour emails, connexions persistantes)  
✅ **Railway**: Serveur Node.js persistant (parfait pour emails, WebSocket, etc.)

---

## 📋 ÉTAPE 1: Créer un Compte Railway (2 minutes)

1. Allez sur https://railway.app
2. Cliquez sur "Start a New Project"
3. Connectez-vous avec GitHub
4. Autorisez Railway à accéder à vos repos

---

## 📦 ÉTAPE 2: Déployer le Backend (5 minutes)

### 2.1 Créer le Projet

1. Sur Railway, cliquez sur "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez votre repo: **FinanzPlus/FinanzPluss**
4. Railway va détecter automatiquement que c'est un projet Node.js

### 2.2 Configurer le Root Directory

Railway va essayer de déployer tout le repo. Vous devez lui dire de déployer uniquement le dossier `backend`:

1. Cliquez sur votre projet déployé
2. Allez dans "Settings"
3. Trouvez "Root Directory"
4. Entrez: `backend`
5. Cliquez sur "Save"

### 2.3 Configurer les Variables d'Environnement

1. Dans votre projet Railway, cliquez sur "Variables"
2. Ajoutez ces variables une par une:

```env
# Configuration SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at

# Configuration Serveur
NODE_ENV=production
PORT=5000

# Frontend URL (votre site Vercel)
FRONTEND_URL=https://finanz-plus-frontend-aquhkn3zi-finanz-plus-projects.vercel.app

# Informations de contact
COMPANY_NAME=FinanzPlus Austria GmbH
COMPANY_ADDRESS=Hauptstraße 123, 1010 Wien, Österreich
COMPANY_PHONE=+43 123 456 789
COMPANY_EMAIL=kontakt@finanzplus.at
WHATSAPP_PHONE=+43123456789

# JWT (générez une clé aléatoire)
JWT_SECRET=votre_cle_secrete_super_longue_et_aleatoire_123456789
JWT_EXPIRES_IN=7d

# Database (si vous en avez une)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finanzplus_austria
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
```

**IMPORTANT**: Pour `SMTP_PASS`, utilisez un mot de passe d'application Gmail:
- https://myaccount.google.com/security
- "Mots de passe des applications"
- Créez-en un nouveau pour "FinanzPlus Railway"

### 2.4 Déployer

1. Railway va automatiquement déployer après avoir sauvegardé les variables
2. Attendez 2-3 minutes
3. Vous verrez "Deployment successful" ✅

### 2.5 Obtenir l'URL du Backend

1. Dans votre projet Railway, cliquez sur "Settings"
2. Trouvez "Domains"
3. Cliquez sur "Generate Domain"
4. Railway va créer une URL comme: `https://finanzplus-backend-production.up.railway.app`
5. **Copiez cette URL** - vous en aurez besoin pour le frontend

---

## 🔗 ÉTAPE 3: Connecter le Frontend au Backend (3 minutes)

### 3.1 Mettre à Jour le Frontend Vercel

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet frontend
3. Allez dans "Settings" → "Environment Variables"
4. Ajoutez/Modifiez cette variable:

```env
VITE_API_URL=https://finanzplus-backend-production.up.railway.app
```

(Remplacez par votre vraie URL Railway)

5. Cliquez sur "Save"

### 3.2 Redéployer le Frontend

1. Allez dans l'onglet "Deployments"
2. Cliquez sur les 3 points (...) du dernier déploiement
3. Cliquez sur "Redeploy"
4. Attendez 1-2 minutes

---

## ✅ ÉTAPE 4: Tester le Système Complet (5 minutes)

### 4.1 Vérifier le Backend

1. Ouvrez votre URL Railway dans le navigateur:
   ```
   https://finanzplus-backend-production.up.railway.app/health
   ```

2. Vous devriez voir:
   ```json
   {
     "status": "OK",
     "message": "FinanzPlus Austria API est opérationnelle",
     "timestamp": "2026-06-14T13:45:00.000Z",
     "environment": "production"
   }
   ```

### 4.2 Vérifier les Logs Railway

1. Dans Railway, cliquez sur votre projet
2. Allez dans "Deployments" → "View Logs"
3. Vous devriez voir:
   ```
   ✅ Serveur SMTP prêt à envoyer des emails
   Server running on port 5000
   ```

### 4.3 Tester une Demande de Prêt

1. Allez sur votre site Vercel:
   ```
   https://finanz-plus-frontend-aquhkn3zi-finanz-plus-projects.vercel.app/kreditrechner
   ```

2. Remplissez le formulaire:
   - Sélectionnez une banque
   - Ajustez montant et durée
   - Remplissez vos coordonnées (utilisez votre vrai email)
   - Cliquez sur "ENVOYER LA DEMANDE VIA WHATSAPP"

3. Vérifications:
   - ✅ Message de confirmation affiché
   - ✅ Pas d'erreur dans la console (F12)
   - ✅ Email reçu dans votre boîte (vérifiez spam)
   - ✅ Redirection WhatsApp fonctionne

### 4.4 Vérifier les Logs d'Envoi

1. Dans Railway, regardez les logs en temps réel
2. Vous devriez voir:
   ```
   ✅ Email de confirmation envoyé au client: <message-id>
   ✅ Notification envoyée à l'équipe: <message-id>
   ```

---

## 🐛 RÉSOLUTION DES PROBLÈMES

### Problème: "Application failed to respond"

**Cause**: Le backend ne démarre pas

**Solutions**:
1. Vérifiez les logs Railway
2. Vérifiez que `ROOT_DIRECTORY=backend` est configuré
3. Vérifiez que toutes les variables d'environnement sont présentes

### Problème: "SMTP connection failed"

**Cause**: Credentials SMTP incorrects

**Solutions**:
1. Vérifiez `SMTP_USER` et `SMTP_PASS`
2. Régénérez un mot de passe d'application Gmail
3. Vérifiez que l'authentification à 2 facteurs est activée

### Problème: "CORS error"

**Cause**: `FRONTEND_URL` incorrect

**Solutions**:
1. Vérifiez que `FRONTEND_URL` dans Railway correspond à votre URL Vercel
2. Redémarrez le backend Railway
3. Videz le cache du navigateur

### Problème: Emails non reçus

**Causes possibles**:
1. Emails dans spam (normal avec Gmail)
2. Credentials SMTP incorrects
3. Limite Gmail atteinte (500/jour)

**Solutions**:
1. Vérifiez le dossier spam
2. Vérifiez les logs Railway pour les erreurs
3. Passez à SendGrid pour la production

---

## 💰 COÛTS RAILWAY

### Plan Gratuit (Hobby)
- ✅ $5 de crédit gratuit par mois
- ✅ Suffisant pour 500+ heures de serveur
- ✅ Parfait pour commencer

### Plan Pro ($20/mois)
- Plus de ressources
- Support prioritaire
- Recommandé pour production

---

## 🚀 ALTERNATIVE: Render.com

Si Railway ne fonctionne pas, essayez Render:

1. Allez sur https://render.com
2. Créez un "Web Service"
3. Connectez votre repo GitHub
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Ajoutez les mêmes variables d'environnement
8. Déployez

---

## 📊 CHECKLIST FINALE

### Backend Railway
- [ ] Projet créé sur Railway
- [ ] Root Directory configuré (`backend`)
- [ ] Variables d'environnement ajoutées (SMTP, JWT, etc.)
- [ ] Déploiement réussi
- [ ] URL générée et copiée
- [ ] `/health` endpoint accessible
- [ ] Logs montrent "✅ Serveur SMTP prêt"

### Frontend Vercel
- [ ] Variable `VITE_API_URL` mise à jour
- [ ] Frontend redéployé
- [ ] Site accessible
- [ ] Formulaire de prêt fonctionne

### Tests
- [ ] Demande de prêt soumise avec succès
- [ ] Email client reçu
- [ ] Email équipe reçu
- [ ] Redirection WhatsApp fonctionne
- [ ] Aucune erreur dans les consoles

---

## 🎉 RÉSULTAT FINAL

Après avoir suivi ce guide, vous aurez:

✅ Backend déployé sur Railway (serveur persistant)  
✅ Frontend déployé sur Vercel (site statique)  
✅ Emails automatiques fonctionnels  
✅ Système complet opérationnel en production  
✅ Coût: Gratuit (plans gratuits Railway + Vercel)

---

**Temps total**: 15-20 minutes  
**Difficulté**: Facile  
**Support**: Si problème, vérifiez les logs Railway en premier

**Bon déploiement ! 🚀**