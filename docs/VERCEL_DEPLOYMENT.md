# 🚀 Guide de Déploiement Vercel - FinanzPlus Austria

## 📋 Vue d'ensemble

Ce guide vous accompagne dans le déploiement de FinanzPlus Austria sur Vercel, incluant la configuration complète des variables d'environnement et des protections anti-abus.

---

## 🎯 Prérequis

- [ ] Compte Vercel (gratuit ou Pro)
- [ ] Compte GitHub avec le repository FinanzPlus
- [ ] Clés reCAPTCHA v3 de production
- [ ] Base de données PostgreSQL (Vercel Postgres, Supabase, ou autre)
- [ ] Compte email SMTP (Gmail, SendGrid, etc.)

---

## 📦 Étape 1: Préparation du Repository

### 1.1 Vérifier la structure du projet

```
ARISTIDE404/
├── backend/          # API Node.js/Express
├── frontend/         # Application React/Vite
├── database/         # Scripts SQL
└── docs/            # Documentation
```

### 1.2 Vérifier les fichiers de configuration

**Backend:**
- ✅ `backend/package.json` - Scripts de démarrage
- ✅ `backend/.env.example` - Template des variables
- ✅ `backend/vercel.json` - Configuration Vercel (à créer)

**Frontend:**
- ✅ `frontend/package.json` - Scripts de build
- ✅ `frontend/.env.example` - Template des variables
- ✅ `frontend/vite.config.js` - Configuration Vite

---

## 🔧 Étape 2: Configuration Vercel

### 2.1 Créer deux projets Vercel

#### Projet 1: Backend API
1. Aller sur https://vercel.com/new
2. Importer le repository GitHub
3. **Root Directory:** `backend`
4. **Framework Preset:** Other
5. **Build Command:** `npm install`
6. **Output Directory:** `.`
7. **Install Command:** `npm install`

#### Projet 2: Frontend
1. Créer un nouveau projet
2. Importer le même repository
3. **Root Directory:** `frontend`
4. **Framework Preset:** Vite
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Install Command:** `npm install`

---

## 🔐 Étape 3: Variables d'Environnement Backend

### 3.1 Obtenir les clés reCAPTCHA

1. Aller sur https://www.google.com/recaptcha/admin
2. Cliquer sur **"+"** pour créer un nouveau site
3. **Label:** FinanzPlus Austria Production
4. **Type:** reCAPTCHA v3
5. **Domaines:**
   - `finanzplus.at`
   - `www.finanzplus.at`
   - `api.finanzplus.at`
   - `*.vercel.app` (pour les previews)
6. Accepter les conditions
7. **Copier la clé secrète** (Secret Key)

### 3.2 Configurer les variables Backend sur Vercel

Dans **Settings > Environment Variables** du projet Backend:

```env
# Base de données PostgreSQL
DB_HOST=your-postgres-host.com
DB_PORT=5432
DB_NAME=finanzplus_austria
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

# Serveur
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your_super_secure_jwt_secret_min_32_characters_2024
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://finanzplus.at,https://www.finanzplus.at

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# WhatsApp Business API
WHATSAPP_PHONE_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_NUMBER=+43123456789

# Google reCAPTCHA v3
RECAPTCHA_SECRET_KEY=6Lc...votre_clé_secrète_production
RECAPTCHA_MIN_SCORE=0.5

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET=your_session_secret_super_secure_2024

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CALENDLY_API_KEY=your_calendly_api_key
TEAM_EMAIL=team@finanzplus.at

# Logs
LOG_LEVEL=info
```

### 3.3 Obtenir un mot de passe d'application Gmail

Si vous utilisez Gmail pour les emails:

1. Aller sur https://myaccount.google.com/security
2. Activer la **validation en deux étapes**
3. Aller dans **Mots de passe d'application**
4. Créer un nouveau mot de passe pour "FinanzPlus"
5. Copier le mot de passe généré (16 caractères)
6. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

---

## 🎨 Étape 4: Variables d'Environnement Frontend

### 4.1 Obtenir la clé site reCAPTCHA

Dans la console reCAPTCHA (même site que l'étape 3.1):
- **Copier la clé du site** (Site Key)

### 4.2 Configurer les variables Frontend sur Vercel

Dans **Settings > Environment Variables** du projet Frontend:

```env
# API Backend
VITE_API_URL=https://api.finanzplus.at/api

# Application
VITE_APP_NAME=FinanzPlus Austria
VITE_APP_VERSION=1.0.0

# Google reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=6Lc...votre_clé_site_production

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Calendly
VITE_CALENDLY_URL=https://calendly.com/finanzplus-austria

# Contact
VITE_WHATSAPP_NUMBER=+43123456789
VITE_CONTACT_EMAIL=kontakt@finanzplus.at
VITE_CONTACT_PHONE=+43 1 234 5678

# Office Address
VITE_OFFICE_ADDRESS=Stephansplatz 1, 1010 Wien, Österreich
VITE_OFFICE_LAT=48.2082
VITE_OFFICE_LNG=16.3738

# Social Media
VITE_FACEBOOK_URL=https://facebook.com/finanzplus.austria
VITE_LINKEDIN_URL=https://linkedin.com/company/finanzplus-austria
VITE_INSTAGRAM_URL=https://instagram.com/finanzplus.austria

# Features
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true

# Environment
VITE_NODE_ENV=production
```

---

## 🗄️ Étape 5: Configuration Base de Données

### Option A: Vercel Postgres (Recommandé)

1. Dans le projet Backend sur Vercel
2. Aller dans **Storage**
3. Cliquer sur **Create Database**
4. Choisir **Postgres**
5. Suivre les instructions
6. Les variables `DB_*` seront automatiquement ajoutées

### Option B: Supabase

1. Créer un projet sur https://supabase.com
2. Aller dans **Settings > Database**
3. Copier les informations de connexion
4. Ajouter manuellement les variables `DB_*` sur Vercel

### 5.1 Initialiser la base de données

```bash
# Depuis votre machine locale
cd database

# Exécuter le schéma
psql -h your-host -U your-user -d finanzplus_austria -f schema.sql

# Insérer les données de test (optionnel)
psql -h your-host -U your-user -d finanzplus_austria -f seed-data.sql
```

---

## 🌐 Étape 6: Configuration DNS

### 6.1 Configurer le domaine Backend

1. Dans le projet Backend sur Vercel
2. Aller dans **Settings > Domains**
3. Ajouter `api.finanzplus.at`
4. Suivre les instructions DNS

**Enregistrements DNS à ajouter:**
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### 6.2 Configurer le domaine Frontend

1. Dans le projet Frontend sur Vercel
2. Aller dans **Settings > Domains**
3. Ajouter `finanzplus.at` et `www.finanzplus.at`
4. Suivre les instructions DNS

**Enregistrements DNS à ajouter:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🚀 Étape 7: Déploiement

### 7.1 Déployer le Backend

1. Commit et push sur GitHub
2. Vercel déploie automatiquement
3. Vérifier les logs de déploiement
4. Tester l'endpoint: `https://api.finanzplus.at/health`

### 7.2 Déployer le Frontend

1. Commit et push sur GitHub
2. Vercel déploie automatiquement
3. Vérifier les logs de build
4. Tester le site: `https://finanzplus.at`

---

## ✅ Étape 8: Tests Post-Déploiement

### 8.1 Tests Backend

```bash
# Test de santé
curl https://api.finanzplus.at/health

# Test de connexion DB
curl https://api.finanzplus.at/api/test-db

# Test rate limiting (devrait bloquer après 100 requêtes)
for i in {1..105}; do curl https://api.finanzplus.at/health; done
```

### 8.2 Tests Frontend

- [ ] Page d'accueil charge correctement
- [ ] Formulaire de contact fonctionne
- [ ] Formulaire de connexion fonctionne
- [ ] Formulaire d'inscription fonctionne
- [ ] Badge reCAPTCHA s'affiche
- [ ] Simulateur de crédit fonctionne
- [ ] Navigation entre les pages

### 8.3 Tests reCAPTCHA

1. Aller sur https://www.google.com/recaptcha/admin
2. Sélectionner votre site
3. Vérifier les statistiques:
   - Requêtes reçues
   - Score moyen
   - Taux de blocage

### 8.4 Tests de sécurité

```bash
# Test rate limiting sur login
for i in {1..10}; do
  curl -X POST https://api.finanzplus.at/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Devrait bloquer après 5 tentatives

# Test rate limiting sur register
for i in {1..5}; do
  curl -X POST https://api.finanzplus.at/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@test.com","password":"Test1234!"}'
done
# Devrait bloquer après 2 inscriptions
```

---

## 🔍 Étape 9: Monitoring

### 9.1 Vercel Analytics

1. Activer **Vercel Analytics** dans les deux projets
2. Suivre les métriques:
   - Temps de réponse
   - Taux d'erreur
   - Trafic

### 9.2 Logs Backend

```bash
# Voir les logs en temps réel
vercel logs --follow

# Filtrer par erreur
vercel logs --filter error
```

### 9.3 Console reCAPTCHA

Vérifier quotidiennement:
- Score moyen des utilisateurs
- Tentatives bloquées
- Alertes de sécurité

---

## 🛠️ Dépannage

### Problème: Backend ne démarre pas

**Solution:**
1. Vérifier les logs Vercel
2. Vérifier la connexion DB
3. Vérifier toutes les variables d'environnement

### Problème: reCAPTCHA ne fonctionne pas

**Solution:**
1. Vérifier que `VITE_RECAPTCHA_SITE_KEY` est correcte
2. Vérifier que le domaine est ajouté dans la console reCAPTCHA
3. Vérifier la console du navigateur pour les erreurs

### Problème: Rate limiting trop strict

**Solution:**
1. Ajuster `RECAPTCHA_MIN_SCORE` (augmenter pour être plus permissif)
2. Ajuster `RATE_LIMIT_MAX_REQUESTS` dans les limiters

### Problème: Emails ne s'envoient pas

**Solution:**
1. Vérifier `EMAIL_USER` et `EMAIL_PASSWORD`
2. Vérifier que le mot de passe d'application est correct
3. Vérifier les logs backend pour les erreurs SMTP

---

## 📊 Checklist Finale

### Avant le lancement

- [ ] Toutes les variables d'environnement configurées
- [ ] Base de données initialisée avec le schéma
- [ ] DNS configuré et propagé (24-48h)
- [ ] SSL/HTTPS actif sur tous les domaines
- [ ] Tests de tous les formulaires réussis
- [ ] reCAPTCHA fonctionne sur tous les formulaires
- [ ] Rate limiting testé et fonctionnel
- [ ] Emails de confirmation testés
- [ ] Monitoring activé
- [ ] Backup de la base de données configuré

### Après le lancement

- [ ] Surveiller les logs pendant 24h
- [ ] Vérifier les statistiques reCAPTCHA
- [ ] Tester depuis différents appareils
- [ ] Vérifier les performances (Lighthouse)
- [ ] Configurer les alertes Vercel
- [ ] Documenter les incidents

---

## 📞 Support

En cas de problème:
1. Consulter les logs Vercel
2. Vérifier la documentation reCAPTCHA
3. Consulter la documentation Vercel
4. Contacter le support Vercel (Pro plan)

---

## 🔄 Mises à jour

Pour déployer une mise à jour:
1. Commit et push sur GitHub
2. Vercel redéploie automatiquement
3. Vérifier les logs de déploiement
4. Tester les nouvelles fonctionnalités

---

**Déploiement créé avec ❤️ par Bob pour FinanzPlus Austria**