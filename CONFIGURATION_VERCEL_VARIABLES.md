# ⚙️ CONFIGURATION VARIABLES D'ENVIRONNEMENT VERCEL

## 🎯 Objectif

Ce guide vous aide à configurer correctement les variables d'environnement sur Vercel pour que le frontend puisse communiquer avec le backend Railway.

---

## 📋 Variables à Configurer sur Vercel

### 1. Accéder aux Variables d'Environnement

1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet frontend
3. Aller dans **Settings** → **Environment Variables**

### 2. Ajouter la Variable VITE_API_URL

**Variable:** `VITE_API_URL`  
**Valeur:** URL de votre backend Railway

**Exemple:**
```
VITE_API_URL=https://finanzplus-backend.up.railway.app
```

**⚠️ IMPORTANT:**
- Pas de `/` à la fin de l'URL
- Pas de `/api` à la fin
- Utiliser l'URL complète fournie par Railway

### 3. Environnements

Configurer pour tous les environnements:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🔍 Comment Trouver l'URL du Backend Railway

### Méthode 1: Dashboard Railway

1. Aller sur https://railway.app/dashboard
2. Sélectionner votre projet backend
3. Onglet **Settings**
4. Section **Domains**
5. Copier l'URL générée (ex: `finanzplus-backend.up.railway.app`)

### Méthode 2: Depuis les Déploiements

1. Railway Dashboard → Votre projet
2. Onglet **Deployments**
3. Cliquer sur le dernier déploiement
4. L'URL est affichée en haut

---

## ✅ Configuration Complète sur Vercel

### Variables Essentielles:

```env
# Backend API URL (OBLIGATOIRE)
VITE_API_URL=https://finanzplus-backend.up.railway.app

# Google reCAPTCHA (si utilisé)
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

# WhatsApp
VITE_WHATSAPP_NUMBER=4915565236794
```

### Variables Optionnelles:

```env
# Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Sentry Error Tracking
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Feature Flags
VITE_FEATURE_CHAT=false
VITE_FEATURE_VIDEO_CALL=true
```

---

## 🚀 Après Configuration

### 1. Redéployer le Frontend

Après avoir ajouté les variables:

**Option A: Redéploiement Automatique**
- Vercel redéploie automatiquement si vous avez activé l'auto-deploy

**Option B: Redéploiement Manuel**
1. Aller dans **Deployments**
2. Cliquer sur les 3 points du dernier déploiement
3. Cliquer sur **Redeploy**

### 2. Vérifier la Configuration

**Test 1: Ouvrir la Console du Navigateur**

1. Aller sur votre site Vercel
2. Ouvrir la console (F12)
3. Aller sur `/simulateur`
4. Remplir et soumettre une demande
5. Chercher dans les logs:

```
📧 [FRONTEND] Tentative d'envoi de la demande au backend...
📧 [FRONTEND] URL API: https://finanzplus-backend.up.railway.app
📧 [FRONTEND] Réponse reçue: 201
✅ [FRONTEND] Demande sauvegardée et email envoyé
```

**Test 2: Vérifier l'URL dans le Code**

Dans la console, taper:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Devrait afficher: `https://finanzplus-backend.up.railway.app`

---

## 🐛 Résolution des Problèmes

### Problème 1: Variable Non Définie

**Symptôme:**
```
📧 [FRONTEND] URL API: undefined
```

**Cause:** Variable `VITE_API_URL` non configurée sur Vercel

**Solution:**
1. Vérifier que la variable est bien ajoutée sur Vercel
2. Vérifier l'orthographe: `VITE_API_URL` (pas `REACT_APP_API_URL`)
3. Redéployer le frontend

### Problème 2: CORS Error

**Symptôme:**
```
Access to fetch at 'https://backend.railway.app' from origin 'https://frontend.vercel.app' has been blocked by CORS policy
```

**Cause:** Backend ne permet pas les requêtes depuis le frontend

**Solution:**

1. **Sur Railway**, vérifier la variable `FRONTEND_URL`:
```env
FRONTEND_URL=https://votre-frontend.vercel.app
```

2. **Vérifier le code backend** (`backend/src/server.js`):
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

3. **Redéployer le backend** sur Railway

### Problème 3: Erreur 404 Not Found

**Symptôme:**
```
❌ [FRONTEND] Erreur API: 404 Not Found
```

**Causes possibles:**

1. **URL incorrecte:**
   - ❌ `https://backend.railway.app/api/loans/applications`
   - ✅ `https://backend.railway.app` (sans `/api`)

2. **Route non déployée:**
   - Vérifier que le backend est bien déployé
   - Vérifier les logs Railway

**Solution:**
```env
# Correct
VITE_API_URL=https://finanzplus-backend.up.railway.app

# Incorrect
VITE_API_URL=https://finanzplus-backend.up.railway.app/api
```

### Problème 4: Erreur 500 Internal Server Error

**Symptôme:**
```
❌ [FRONTEND] Erreur API: 500 Internal Server Error
```

**Cause:** Erreur côté backend

**Solution:**

1. **Vérifier les logs Railway:**
   - Railway Dashboard → Deployments → Logs
   - Chercher les erreurs

2. **Vérifier les variables backend:**
   - `RESEND_API_KEY` présente?
   - `EMAIL_FROM` correcte?
   - `DB_*` variables configurées?

3. **Tester l'endpoint directement:**
```bash
curl -X POST https://finanzplus-backend.up.railway.app/api/loans/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 📊 Checklist de Validation

### Configuration Vercel:
- [ ] Variable `VITE_API_URL` ajoutée
- [ ] Valeur = URL Railway complète (sans `/api`)
- [ ] Configurée pour Production, Preview, Development
- [ ] Frontend redéployé après ajout

### Configuration Railway:
- [ ] Variable `FRONTEND_URL` = URL Vercel
- [ ] Variable `RESEND_API_KEY` présente
- [ ] Variable `EMAIL_FROM` = noreply@finanzplus.xyz
- [ ] Backend redéployé

### Tests:
- [ ] Console navigateur montre l'URL correcte
- [ ] Pas d'erreur CORS
- [ ] Demande de prêt fonctionne
- [ ] Email de confirmation reçu
- [ ] Redirection WhatsApp fonctionne

---

## 🎯 Configuration Finale Recommandée

### Sur Vercel (Frontend):

```env
# API Backend
VITE_API_URL=https://finanzplus-backend.up.railway.app

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

# WhatsApp
VITE_WHATSAPP_NUMBER=4915565236794

# Analytics (optionnel)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Sur Railway (Backend):

```env
# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://finanzplus-frontend-fip6s81ap-finanz-plus-projects.vercel.app

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=finanzplus_austria
DB_USER=postgres
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Resend Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@finanzplus.xyz
ADMIN_EMAIL=admin@finanzplus.xyz

# reCAPTCHA
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
RECAPTCHA_MIN_SCORE=0.5
```

---

## 🔄 Workflow de Déploiement

### 1. Modifier le Code

```bash
# Faire vos modifications
git add .
git commit -m "Vos changements"
git push origin main
```

### 2. Déploiements Automatiques

- **Railway:** Détecte le push et redéploie le backend (2-3 min)
- **Vercel:** Détecte le push et redéploie le frontend (1-2 min)

### 3. Vérifier les Déploiements

**Railway:**
- Dashboard → Deployments → Vérifier le statut
- Logs → Chercher les erreurs

**Vercel:**
- Dashboard → Deployments → Vérifier le statut
- Function Logs → Chercher les erreurs

### 4. Tester

1. Ouvrir le site Vercel
2. Aller sur `/simulateur`
3. Soumettre une demande de test
4. Vérifier:
   - Email reçu
   - Redirection WhatsApp
   - Pas d'erreur dans la console

---

## 📞 Support

**Si les problèmes persistent:**

1. **Vérifier les logs:**
   - Railway: Dashboard → Logs
   - Vercel: Dashboard → Function Logs
   - Navigateur: Console (F12)

2. **Tester les endpoints:**
   ```bash
   # Test backend
   curl https://finanzplus-backend.up.railway.app/health
   
   # Test email
   curl -X POST https://finanzplus-backend.up.railway.app/api/loans/test-email \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

3. **Consulter la documentation:**
   - `docs/EMAIL_TESTING_GUIDE.md`
   - `SOLUTION_EMAILS_RESEND.md`
   - `DEPLOIEMENT_BACKEND_RAILWAY.md`

---

**Dernière mise à jour:** 14 juin 2026  
**Version:** 1.0  
**Auteur:** Bob pour FinanzPlus Austria