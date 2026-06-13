# 🧪 Guide de Tests et Optimisation - FinanzPlus Austria

## Vue d'ensemble

Ce guide détaille les stratégies de tests, d'optimisation des performances, d'accessibilité et de SEO pour la plateforme FinanzPlus Austria.

---

## 📋 Table des Matières

1. [Tests Fonctionnels](#tests-fonctionnels)
2. [Tests de Performance](#tests-de-performance)
3. [Tests d'Accessibilité](#tests-daccessibilité)
4. [Optimisation SEO](#optimisation-seo)
5. [Optimisation des Performances](#optimisation-des-performances)
6. [Monitoring et Analytics](#monitoring-et-analytics)

---

## 🧪 Tests Fonctionnels

### Tests Manuels Essentiels

#### 1. Authentification
```
✓ Inscription avec email valide
✓ Inscription avec email invalide (erreur)
✓ Connexion avec identifiants corrects
✓ Connexion avec identifiants incorrects (erreur)
✓ Déconnexion
✓ Token JWT persistant après refresh
✓ Redirection si non authentifié
```

#### 2. Simulateur de Prêt
```
✓ Calcul avec montant valide (1000-500000€)
✓ Calcul avec durée valide (12-360 mois)
✓ Affichage tableau d'amortissement
✓ Export PDF fonctionnel
✓ Validation des champs obligatoires
✓ Messages d'erreur appropriés
```

#### 3. Demande de Prêt
```
✓ Formulaire complet soumis avec succès
✓ Validation des champs (email, téléphone, montant)
✓ Upload de documents (PDF, max 5MB)
✓ Email de confirmation envoyé
✓ Notification admin créée
✓ Redirection vers dashboard
```

#### 4. Dashboard Utilisateur
```
✓ Affichage des demandes en cours
✓ Historique des prêts
✓ Upload de documents
✓ Téléchargement de documents
✓ Consultation score crédit
✓ Lecture des notifications
```

#### 5. Dashboard Admin
```
✓ Statistiques KPIs correctes
✓ Liste des demandes récentes
✓ Filtrage par statut
✓ Approbation/rejet de demandes
✓ Envoi d'emails aux clients
✓ Gestion des partenaires
```

### Tests Automatisés (Recommandés)

#### Configuration Jest (Frontend)
```json
{
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"],
  "moduleNameMapper": {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}",
    "!src/index.jsx",
    "!src/reportWebVitals.js"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}
```

#### Exemple de Test React
```javascript
// src/components/__tests__/LoanSimulator.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoanSimulator from '../LoanSimulator';

describe('LoanSimulator', () => {
  test('calcule correctement le prêt', () => {
    render(<LoanSimulator />);
    
    const amountInput = screen.getByLabelText(/montant/i);
    const durationInput = screen.getByLabelText(/durée/i);
    const calculateBtn = screen.getByText(/calculer/i);
    
    fireEvent.change(amountInput, { target: { value: '50000' } });
    fireEvent.change(durationInput, { target: { value: '240' } });
    fireEvent.click(calculateBtn);
    
    expect(screen.getByText(/mensualité/i)).toBeInTheDocument();
  });
});
```

#### Configuration Mocha (Backend)
```json
{
  "scripts": {
    "test": "mocha 'src/**/*.test.js' --timeout 5000",
    "test:watch": "mocha 'src/**/*.test.js' --watch"
  }
}
```

#### Exemple de Test Backend
```javascript
// backend/src/controllers/__tests__/authController.test.js
const request = require('supertest');
const app = require('../../server');

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });
  });
});
```

---

## ⚡ Tests de Performance

### Métriques Cibles

| Métrique | Cible | Critique |
|----------|-------|----------|
| **First Contentful Paint (FCP)** | < 1.8s | < 3s |
| **Largest Contentful Paint (LCP)** | < 2.5s | < 4s |
| **Time to Interactive (TTI)** | < 3.8s | < 7.3s |
| **Total Blocking Time (TBT)** | < 200ms | < 600ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 | < 0.25 |
| **Speed Index** | < 3.4s | < 5.8s |

### Outils de Test

#### 1. Google Lighthouse
```bash
# Installation
npm install -g lighthouse

# Exécution
lighthouse https://finanzplus.at --output html --output-path ./report.html

# Avec options
lighthouse https://finanzplus.at \
  --only-categories=performance,accessibility,seo \
  --throttling.cpuSlowdownMultiplier=4 \
  --output json \
  --output-path ./lighthouse-report.json
```

**Objectifs Lighthouse:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

#### 2. WebPageTest
```
URL: https://www.webpagetest.org/
Configuration:
- Location: Frankfurt, Germany
- Browser: Chrome
- Connection: 4G
- Number of Tests: 3
```

#### 3. Chrome DevTools Performance
```
1. Ouvrir DevTools (F12)
2. Onglet Performance
3. Cliquer sur Record
4. Naviguer sur le site
5. Stop Recording
6. Analyser:
   - Scripting time
   - Rendering time
   - Painting time
   - Loading time
```

### Optimisations Recommandées

#### Images
```javascript
// Lazy loading
<img 
  src="placeholder.jpg" 
  data-src="real-image.jpg" 
  loading="lazy"
  alt="Description"
/>

// Responsive images
<img 
  srcset="
    image-320w.jpg 320w,
    image-640w.jpg 640w,
    image-1024w.jpg 1024w
  "
  sizes="(max-width: 640px) 100vw, 640px"
  src="image-640w.jpg"
  alt="Description"
/>

// WebP avec fallback
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description">
</picture>
```

#### Code Splitting (React)
```javascript
// Lazy loading des routes
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

#### Minification et Compression
```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts']
        }
      }
    }
  }
};
```

#### Caching
```javascript
// Service Worker (frontend/public/sw.js)
const CACHE_NAME = 'finanzplus-v1';
const urlsToCache = [
  '/',
  '/styles/global.css',
  '/styles/responsive.css',
  '/assets/logos/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

---

## ♿ Tests d'Accessibilité

### Outils Automatisés

#### 1. axe DevTools
```bash
# Installation extension Chrome
https://chrome.google.com/webstore/detail/axe-devtools

# Utilisation
1. Ouvrir DevTools
2. Onglet axe DevTools
3. Scan All of My Page
4. Corriger les erreurs critiques
```

#### 2. WAVE
```
URL: https://wave.webaim.org/
1. Entrer l'URL du site
2. Analyser les erreurs
3. Vérifier les contrastes
4. Tester la navigation clavier
```

#### 3. Lighthouse Accessibility
```bash
lighthouse https://finanzplus.at --only-categories=accessibility
```

### Tests Manuels

#### Navigation Clavier
```
✓ Tab: Navigation entre éléments interactifs
✓ Shift+Tab: Navigation inverse
✓ Enter: Activation des boutons/liens
✓ Space: Activation des checkboxes
✓ Esc: Fermeture des modals
✓ Arrow keys: Navigation dans les menus
```

#### Lecteurs d'Écran
```
Windows: NVDA (gratuit)
macOS: VoiceOver (intégré)
Linux: Orca

Tests:
✓ Tous les éléments sont annoncés
✓ Les landmarks sont identifiés
✓ Les formulaires sont compréhensibles
✓ Les erreurs sont annoncées
✓ Les changements dynamiques sont notifiés
```

#### Contraste des Couleurs
```
Outil: https://webaim.org/resources/contrastchecker/

Ratios WCAG AA:
- Texte normal: 4.5:1
- Texte large (18pt+): 3:1
- Éléments UI: 3:1

FinanzPlus Colors:
✓ Navy Blue (#0A1628) sur blanc: 15.8:1 ✓
✓ Gold (#C9A84C) sur Navy: 4.8:1 ✓
✓ Blanc sur Navy: 15.8:1 ✓
```

### Checklist Accessibilité

```
[ ] Tous les liens ont un texte descriptif
[ ] Toutes les images ont un alt text
[ ] Les formulaires ont des labels associés
[ ] Les erreurs sont clairement identifiées
[ ] Le focus est visible sur tous les éléments
[ ] Pas de piège clavier
[ ] Les modals peuvent être fermées au clavier
[ ] Les vidéos ont des sous-titres
[ ] Le contenu est lisible à 200% de zoom
[ ] Pas de clignotement > 3 fois/seconde
[ ] Les tableaux ont des headers
[ ] Les listes sont sémantiques (<ul>, <ol>)
[ ] Les titres sont hiérarchiques (h1 > h2 > h3)
[ ] Les landmarks ARIA sont présents
[ ] Les états sont annoncés (loading, error, success)
```

---

## 🔍 Optimisation SEO

### Meta Tags Essentiels

```html
<!-- Déjà implémenté dans index.html -->
<title>FinanzPlus Austria - Kreditvergleich & Finanzierung</title>
<meta name="description" content="Vergleichen Sie Kreditangebote...">
<meta name="keywords" content="Kredit, Finanzierung, Darlehen...">
<meta name="robots" content="index, follow">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
```

### Structured Data (Schema.org)

```html
<!-- Déjà implémenté dans index.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "FinanzPlus Austria",
  "description": "...",
  "url": "https://finanzplus.at",
  "logo": "...",
  "address": {...},
  "contactPoint": {...}
}
</script>
```

### Sitemap.xml

```xml
<!-- frontend/public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://finanzplus.at/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://finanzplus.at/loan-simulator</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://finanzplus.at/partners</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://finanzplus.at/about</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://finanzplus.at/contact</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Robots.txt

```txt
# frontend/public/robots.txt
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/

Sitemap: https://finanzplus.at/sitemap.xml
```

### SEO Checklist

```
[ ] Titre unique pour chaque page (50-60 caractères)
[ ] Meta description unique (150-160 caractères)
[ ] URLs propres et descriptives
[ ] Headings hiérarchiques (H1 unique par page)
[ ] Images optimisées (alt text, taille, format)
[ ] Liens internes pertinents
[ ] Temps de chargement < 3s
[ ] Mobile-friendly (responsive)
[ ] HTTPS activé
[ ] Sitemap.xml soumis à Google Search Console
[ ] Robots.txt configuré
[ ] Structured Data valide
[ ] Pas de contenu dupliqué
[ ] Canonical URLs définies
[ ] 404 page personnalisée
```

---

## 🚀 Optimisation des Performances

### Bundle Analysis

```bash
# Frontend
npm run build
npx vite-bundle-visualizer

# Identifier les gros modules
# Lazy load si possible
# Tree shaking pour éliminer le code mort
```

### Database Optimization

```sql
-- Indexes pour requêtes fréquentes
CREATE INDEX idx_loan_requests_user_id ON loan_requests(user_id);
CREATE INDEX idx_loan_requests_status ON loan_requests(status);
CREATE INDEX idx_loan_requests_created_at ON loan_requests(created_at DESC);

-- Analyse des requêtes lentes
EXPLAIN ANALYZE SELECT * FROM loan_requests WHERE user_id = 'xxx';

-- Vacuum régulier
VACUUM ANALYZE;
```

### API Optimization

```javascript
// Pagination
app.get('/api/loan-requests', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const requests = await pool.query(
    'SELECT * FROM loan_requests ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  
  res.json({
    data: requests.rows,
    page,
    limit,
    total: requests.rowCount
  });
});

// Caching avec Redis (optionnel)
const redis = require('redis');
const client = redis.createClient();

app.get('/api/partners', async (req, res) => {
  const cacheKey = 'partners:all';
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Query database
  const partners = await pool.query('SELECT * FROM partners');
  
  // Store in cache (1 hour)
  await client.setex(cacheKey, 3600, JSON.stringify(partners.rows));
  
  res.json(partners.rows);
});
```

### Frontend Optimization

```javascript
// Debounce pour recherche
import { debounce } from '../utils/responsive';

const handleSearch = debounce((query) => {
  // API call
  fetch(`/api/search?q=${query}`);
}, 300);

// Memoization
import { useMemo } from 'react';

const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);
  
  return <div>{processedData}</div>;
};

// Virtual scrolling pour longues listes
import { FixedSizeList } from 'react-window';

const LongList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>{items[index]}</div>
    )}
  </FixedSizeList>
);
```

---

## 📊 Monitoring et Analytics

### Google Analytics 4

```html
<!-- Dans index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Error Tracking (Sentry)

```javascript
// frontend/src/index.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// backend/src/server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### Performance Monitoring

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/api/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Uptime Monitoring

```
Services recommandés:
- UptimeRobot (gratuit)
- Pingdom
- StatusCake

Configuration:
- Check interval: 5 minutes
- Alertes: Email + SMS
- Locations: Multiple (EU, US)
```

---

## 📝 Checklist Finale

### Avant Déploiement

```
[ ] Tous les tests manuels passent
[ ] Lighthouse score > 90 (toutes catégories)
[ ] Aucune erreur console
[ ] Aucune erreur ESLint
[ ] Images optimisées (WebP, lazy loading)
[ ] Code minifié et compressé
[ ] Service Worker configuré
[ ] Analytics configuré
[ ] Error tracking configuré
[ ] Sitemap.xml créé
[ ] Robots.txt configuré
[ ] Meta tags SEO complets
[ ] Structured Data valide
[ ] SSL/HTTPS actif
[ ] CORS configuré correctement
[ ] Rate limiting activé
[ ] Backup automatique configuré
[ ] Monitoring uptime actif
[ ] Documentation à jour
```

---

**Version**: 1.0  
**Dernière mise à jour**: 2026-06-12  
**Auteur**: Bob - FinanzPlus Austria Dev Team