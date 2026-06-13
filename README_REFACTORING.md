# 🏦 FinanzPlus Austria - Plateforme Financière Premium

> Votre partenaire financier de confiance en Autriche

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/finanzplus/austria)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org)

---

## 📋 Table des Matières

- [À Propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Documentation](#documentation)
- [Captures d'Écran](#captures-décran)
- [Roadmap](#roadmap)
- [Contact](#contact)

---

## 🎯 À Propos

**FinanzPlus Austria** est une plateforme financière moderne spécialisée dans les offres de prêt en partenariat avec des banques autrichiennes certifiées. Notre mission est de faciliter l'accès au crédit avec transparence, rapidité et professionnalisme.

### 🌟 Points Forts

- ✅ **Taux fixe 3%** - Transparent et compétitif
- ✅ **Réponse sous 24h** - Traitement rapide des demandes
- ✅ **15+ Banques partenaires** - Institutions autrichiennes certifiées
- ✅ **98% de satisfaction** - Clients satisfaits
- ✅ **100% en ligne** - Processus entièrement digital
- ✅ **Conformité DSGVO** - Protection des données garantie

---

## 🚀 Fonctionnalités

### Pour les Utilisateurs

#### 💰 Simulateur de Prêt Avancé
- Calcul instantané des mensualités
- Tableau d'amortissement détaillé
- Export PDF professionnel
- Envoi par email
- Redirection WhatsApp automatique

#### 📊 Dashboard Personnel
- Vue d'ensemble des demandes
- Historique complet
- Upload de documents sécurisé
- Score de crédit estimé
- Centre de notifications
- Gestion du profil

#### 🏦 Comparateur d'Offres
- Comparaison jusqu'à 3 banques
- Taux et conditions détaillés
- Recommandations personnalisées

#### 📱 Multi-Canal
- Site web responsive
- WhatsApp Business
- Email
- Chat support (heures ouverture)

### Pour les Administrateurs

#### 📈 Dashboard Admin Complet
- Statistiques en temps réel
- KPIs et graphiques
- Export de données

#### 🔧 Gestion Complète
- Demandes de prêt (approuver/rejeter)
- Modération des avis clients
- Gestion des utilisateurs
- Gestion des partenaires bancaires
- Configuration des horaires

#### 📧 Notifications Automatiques
- Emails de confirmation
- Alertes nouvelles demandes
- Rappels documents manquants

---

## 🛠️ Technologies

### Frontend
```json
{
  "framework": "React 18.2.0",
  "build": "Vite 5.0",
  "routing": "React Router v6",
  "state": "Context API + Hooks",
  "http": "Axios",
  "styling": "CSS Modules + Variables",
  "icons": "Lucide React",
  "charts": "Chart.js",
  "forms": "React Hook Form"
}
```

### Backend
```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "PostgreSQL 14+",
  "auth": "JWT",
  "security": "Helmet, bcrypt, CORS",
  "email": "Nodemailer",
  "pdf": "PDFKit",
  "upload": "Multer",
  "validation": "Express Validator"
}
```

### Base de Données
```
PostgreSQL 14+
- 14 tables optimisées
- Indexes pour performance
- Triggers automatiques
- Contraintes d'intégrité
```

---

## 📦 Installation

### Prérequis

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0

### Étapes d'Installation

1. **Cloner le repository**
```bash
git clone https://github.com/finanzplus/austria.git
cd austria
```

2. **Installer les dépendances Backend**
```bash
cd backend
npm install
```

3. **Installer les dépendances Frontend**
```bash
cd ../frontend
npm install
```

4. **Configurer la base de données**
```bash
# Créer la base de données
createdb finanzplus_austria

# Exécuter les migrations
cd ../database
psql -U postgres -d finanzplus_austria -f schema-financial.sql
```

5. **Configurer les variables d'environnement**

Backend (`.env`):
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/finanzplus_austria
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

WHATSAPP_NUMBER=+447451267912
```

Frontend (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=+447451267912
```

6. **Démarrer les serveurs**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

7. **Accéder à l'application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 📚 Documentation

### Documents Disponibles

- 📋 [**Résumé Exécutif**](docs/EXECUTIVE_SUMMARY.md) - Vue d'ensemble du projet
- 🗺️ [**Feuille de Route**](docs/IMPLEMENTATION_ROADMAP.md) - Planning détaillé
- 📖 [**Plan de Refactorisation**](docs/REFACTORING_PLAN.md) - Spécifications complètes
- 🏗️ [**Architecture**](docs/ARCHITECTURE_DIAGRAM.md) - Diagrammes système
- 📡 [**API Endpoints**](docs/API_ENDPOINTS.md) - Documentation API complète
- 🚀 [**Guide d'Installation**](docs/INSTALLATION_GUIDE.md) - Installation détaillée
- 🧪 [**Guide de Tests**](docs/TESTING_GUIDE.md) - Procédures de test

### API Documentation

L'API REST complète est documentée dans [`docs/API_ENDPOINTS.md`](docs/API_ENDPOINTS.md).

**Base URL:** `http://localhost:5000/api`

**Endpoints principaux:**
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /loans/calculate` - Calcul de prêt
- `POST /loans/request` - Demande de prêt
- `GET /partners` - Liste des partenaires
- `GET /comments` - Avis clients
- `POST /contact/message` - Contact

---

## 🎨 Design System

### Palette de Couleurs

```css
/* Couleurs principales */
--primary-navy: #0A1628;    /* Bleu marine profond */
--primary-gold: #C9A84C;     /* Or élégant */
--primary-white: #F8F6F1;    /* Blanc cassé */

/* Couleurs d'état */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Typographie

```css
/* Police principale */
font-family: 'Inter', sans-serif;

/* Tailles */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

---

## 📸 Captures d'Écran

### Page d'Accueil
![Accueil](docs/screenshots/home.png)
*Hero section avec CTA principal et badges de confiance*

### Simulateur de Prêt
![Simulateur](docs/screenshots/simulator.png)
*Calcul instantané avec tableau d'amortissement*

### Dashboard Utilisateur
![Dashboard](docs/screenshots/dashboard.png)
*Vue d'ensemble des demandes et documents*

### Dashboard Admin
![Admin](docs/screenshots/admin.png)
*Statistiques et gestion des demandes*

---

## 🗺️ Roadmap

### ✅ Version 2.0 (Actuelle)
- [x] Refactorisation complète en plateforme financière
- [x] Simulateur de prêt avancé
- [x] Dashboard utilisateur enrichi
- [x] Dashboard admin complet
- [x] Conformité DSGVO
- [x] Design premium

### 🔄 Version 2.1 (Q3 2026)
- [ ] Application mobile (iOS/Android)
- [ ] Signature électronique
- [ ] Vérification d'identité automatique
- [ ] Chat support 24/7 avec IA
- [ ] Multi-devises (EUR, CHF)

### 🔮 Version 2.2 (Q4 2026)
- [ ] Marketplace de produits financiers
- [ ] Assurances intégrées
- [ ] Investissements
- [ ] Conseiller financier IA
- [ ] Programme de fidélité

---

## 🔒 Sécurité

### Mesures Implémentées

- ✅ **HTTPS obligatoire** - Chiffrement SSL/TLS
- ✅ **JWT sécurisés** - Authentification robuste
- ✅ **Bcrypt** - Hashage des mots de passe
- ✅ **Rate Limiting** - Protection contre les abus
- ✅ **Helmet.js** - Headers de sécurité
- ✅ **CORS configuré** - Protection cross-origin
- ✅ **Validation inputs** - Prévention injections
- ✅ **Sanitization** - Nettoyage des données
- ✅ **CSRF protection** - Protection contre CSRF
- ✅ **Upload sécurisé** - Validation fichiers

### Conformité DSGVO

- ✅ Bannière cookies conforme
- ✅ Politique de confidentialité
- ✅ Conditions générales
- ✅ Gestion des consentements
- ✅ Droit à l'oubli
- ✅ Export données personnelles
- ✅ Impressum (Autriche)

---

## 🧪 Tests

### Lancer les Tests

```bash
# Tests Backend
cd backend
npm test

# Tests Frontend
cd frontend
npm test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

### Couverture Cible

- ✅ Tests unitaires: > 80%
- ✅ Tests d'intégration: > 70%
- ✅ Tests E2E: Scénarios critiques

---

## 📊 Performance

### Métriques Cibles

- ✅ **Lighthouse Score:** > 90/100
- ✅ **First Contentful Paint:** < 1.5s
- ✅ **Time to Interactive:** < 3s
- ✅ **Largest Contentful Paint:** < 2.5s
- ✅ **Cumulative Layout Shift:** < 0.1

### Optimisations

- Lazy loading des images
- Code splitting
- Minification et compression
- CDN pour assets statiques
- Cache stratégies
- Database indexing

---

## 🌍 Internationalisation

### Langues Supportées

- 🇩🇪 **Allemand (Deutsch)** - Langue principale
- 🇬🇧 **Anglais** - À venir
- 🇫🇷 **Français** - À venir

---

## 🤝 Contribution

Nous n'acceptons pas de contributions externes pour le moment. Ce projet est développé en interne par l'équipe FinanzPlus Austria.

---

## 📄 License

Copyright © 2026 FinanzPlus Austria. Tous droits réservés.

Ce projet est sous licence propriétaire. Toute utilisation, reproduction ou distribution non autorisée est strictement interdite.

---

## 📞 Contact

### Support Client
- **WhatsApp:** +447451267912
- **Email:** support@finanzplus.at
- **Téléphone:** +43 XXX XXX XXX
- **Adresse:** [À compléter]

### Support Technique
- **Email:** tech@finanzplus.at
- **Documentation:** https://docs.finanzplus.at

### Horaires d'Ouverture
- **Lundi - Vendredi:** 09:00 - 18:00
- **Samedi:** 10:00 - 14:00
- **Dimanche:** Fermé

---

## 🙏 Remerciements

Merci à toutes les banques partenaires autrichiennes qui nous font confiance et à nos clients pour leur fidélité.

---

## 📈 Statistiques

![GitHub stars](https://img.shields.io/github/stars/finanzplus/austria?style=social)
![GitHub forks](https://img.shields.io/github/forks/finanzplus/austria?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/finanzplus/austria?style=social)

---

**Fait avec ❤️ en Autriche 🇦🇹**

*Dernière mise à jour: 12 juin 2026*