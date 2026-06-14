# 🛡️ PROTECTIONS ANTI-ABUS - FINANZPLUS AUSTRIA

## 📋 Vue d'ensemble

Ce document décrit toutes les protections anti-abus implémentées pour sécuriser la plateforme FinanzPlus Austria contre les attaques automatisées, le spam, et les abus.

---

## 🔐 1. RATE LIMITING (Limitation de débit)

### 1.1 Middleware créé

**Fichier:** `backend/src/middleware/rateLimiter.js`

### 1.2 Limiteurs implémentés

#### 🌐 General Limiter
- **Limite:** 100 requêtes par 15 minutes par IP
- **Application:** Toutes les routes `/api/*`
- **Protection:** Surcharge du serveur, attaques DDoS

```javascript
// Intégré dans server.js
app.use('/api/', generalLimiter);
```

#### 🔑 Auth Limiter
- **Limite:** 5 tentatives par 15 minutes par IP
- **Application:** Routes de connexion
- **Protection:** Attaques par force brute sur les mots de passe

```javascript
// Routes protégées
POST /api/auth/login
```

#### 📝 Register Limiter
- **Limite:** 2 inscriptions par heure par IP
- **Application:** Route d'inscription
- **Protection:** Création de comptes en masse

```javascript
// Routes protégées
POST /api/auth/register
```

#### 🔄 Password Reset Limiter
- **Limite:** 3 tentatives par heure par IP
- **Application:** Routes de réinitialisation de mot de passe
- **Protection:** Abus du système de récupération

```javascript
// Routes protégées
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
```

#### 📧 Contact Limiter
- **Limite:** 3 messages par heure par IP
- **Application:** Formulaire de contact
- **Protection:** Spam de messages

```javascript
// Routes protégées
POST /api/contact/messages
```

#### 💰 Financial Limiter
- **Limite:** 20 simulations par 10 minutes par IP
- **Application:** Simulations de crédit et calculs financiers
- **Protection:** Abus des calculateurs

```javascript
// Routes protégées
POST /api/loans/simulations
POST /api/credit-score/calculate
```

### 1.3 Réponses en cas de dépassement

**Format de réponse (429 Too Many Requests):**
```json
{
  "error": "Zu viele Anfragen von dieser IP-Adresse. Bitte versuchen Sie es später erneut.",
  "retryAfter": "15 Minuten"
}
```

### 1.4 Headers de rate limit

Les headers suivants sont automatiquement ajoutés aux réponses :

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1623456789
```

---

## 🤖 2. GOOGLE reCAPTCHA v3

### 2.1 Configuration

**Documentation complète:** `docs/RECAPTCHA_SETUP.md`

### 2.2 Middleware créé

**Fichier:** `backend/src/middleware/recaptchaVerify.js`

### 2.3 Niveaux de protection

#### 🟢 Lenient (Permissif) - Score minimum: 0.3
- **Usage:** Formulaires non critiques
- **Exemples:** Newsletter, FAQ, recherche

```javascript
const { verifyRecaptchaLenient } = require('../middleware/recaptchaVerify');
router.post('/newsletter', verifyRecaptchaLenient, controller);
```

#### 🟡 Standard - Score minimum: 0.5
- **Usage:** Formulaires standards
- **Exemples:** Contact, commentaires, inscription

```javascript
const { verifyRecaptchaStandard } = require('../middleware/recaptchaVerify');
router.post('/contact', verifyRecaptchaStandard, controller);
```

#### 🔴 Strict - Score minimum: 0.7
- **Usage:** Opérations sensibles
- **Exemples:** Connexion, transactions, changement de mot de passe

```javascript
const { verifyRecaptchaStrict } = require('../middleware/recaptchaVerify');
router.post('/login', verifyRecaptchaStrict, controller);
```

### 2.4 Interprétation des scores

| Score | Signification | Action |
|-------|---------------|--------|
| 0.9 - 1.0 | Très probablement humain | ✅ Accepter |
| 0.7 - 0.8 | Probablement humain | ✅ Accepter |
| 0.5 - 0.6 | Neutre | ⚠️ Surveiller |
| 0.3 - 0.4 | Suspect | ⚠️ Challenge |
| 0.0 - 0.2 | Très probablement bot | ❌ Rejeter |

### 2.5 Logging de sécurité

Chaque vérification reCAPTCHA est loggée :

```javascript
console.log('[RECAPTCHA] Vérification:', {
  success: true,
  score: 0.9,
  action: 'login',
  hostname: 'finanzplusaustria.com',
  timestamp: '2024-01-15T10:30:00.000Z'
});
```

En cas de score faible, une alerte de sécurité est générée :

```javascript
console.error('[SECURITY ALERT] Activité suspecte détectée:', {
  ip: '192.168.1.1',
  score: 0.2,
  action: 'login',
  path: '/api/auth/login',
  method: 'POST',
  timestamp: '2024-01-15T10:30:00.000Z'
});
```

---

## 📊 3. MONITORING ET LOGGING

### 3.1 Logs de sécurité

Tous les événements de sécurité sont loggés avec les informations suivantes :

```javascript
{
  type: 'RATE_LIMIT' | 'RECAPTCHA' | 'AUTH_FAILURE',
  ip: 'xxx.xxx.xxx.xxx',
  path: '/api/auth/login',
  method: 'POST',
  timestamp: '2024-01-15T10:30:00.000Z',
  details: { ... }
}
```

### 3.2 Alertes recommandées

#### 🚨 Alertes critiques
- Plus de 10 tentatives de connexion échouées en 5 minutes
- Score reCAPTCHA < 0.3 sur routes sensibles
- Dépassement répété des rate limits

#### ⚠️ Alertes d'avertissement
- Score reCAPTCHA entre 0.3 et 0.5
- Dépassement occasionnel des rate limits
- Patterns de requêtes inhabituels

### 3.3 Outils de monitoring

**Console Google reCAPTCHA:**
- URL: https://www.google.com/recaptcha/admin
- Métriques: Requêtes, scores, anomalies

**Logs serveur:**
- Morgan (HTTP logging)
- Console logs personnalisés
- Fichiers de logs (à implémenter)

---

## 🔒 4. HEADERS HTTP DE SÉCURITÉ

### 4.1 Headers implémentés

**Fichier:** `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; ..." }
      ]
    }
  ]
}
```

### 4.2 Protection apportée

- **X-Content-Type-Options:** Prévient le MIME sniffing
- **X-Frame-Options:** Prévient le clickjacking
- **X-XSS-Protection:** Protection XSS navigateur
- **Referrer-Policy:** Contrôle des informations de référence
- **Permissions-Policy:** Désactive fonctionnalités sensibles
- **HSTS:** Force HTTPS pendant 1 an
- **CSP:** Politique de sécurité du contenu

---

## 🎯 5. ROUTES PROTÉGÉES

### 5.1 Authentification

| Route | Rate Limit | reCAPTCHA | Auth |
|-------|-----------|-----------|------|
| POST /api/auth/register | 2/heure | Standard | ❌ |
| POST /api/auth/login | 5/15min | Strict | ❌ |
| POST /api/auth/forgot-password | 3/heure | Standard | ❌ |
| POST /api/auth/reset-password/:token | 3/heure | Standard | ❌ |
| GET /api/auth/profile | 100/15min | ❌ | ✅ |
| PUT /api/auth/profile | 100/15min | ❌ | ✅ |
| POST /api/auth/change-password | 100/15min | Strict | ✅ |

### 5.2 Contact

| Route | Rate Limit | reCAPTCHA | Auth |
|-------|-----------|-----------|------|
| POST /api/contact/messages | 3/heure | Standard | ❌ |
| GET /api/contact/messages/my | 100/15min | ❌ | ✅ |

### 5.3 Services financiers

| Route | Rate Limit | reCAPTCHA | Auth |
|-------|-----------|-----------|------|
| POST /api/loans/simulations | 20/10min | Lenient | ❌ |
| POST /api/credit-score/calculate | 20/10min | Standard | ✅ |

---

## 🧪 6. TESTS ET VALIDATION

### 6.1 Test du rate limiting

```bash
# Test avec curl (doit échouer après 5 tentatives)
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "Tentative $i"
  sleep 1
done
```

### 6.2 Test de reCAPTCHA

**Clés de test Google:**
```
Site Key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
Secret Key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

Ces clés acceptent toujours les requêtes avec un score de 1.0.

### 6.3 Vérification des headers

```bash
# Vérifier les headers de sécurité
curl -I https://finanzplusaustria.com

# Ou utiliser
https://securityheaders.com
```

---

## 📈 7. MÉTRIQUES ET KPI

### 7.1 Métriques à surveiller

- **Taux de blocage rate limit:** < 1% des requêtes légitimes
- **Score reCAPTCHA moyen:** > 0.7
- **Tentatives de connexion échouées:** < 5% du total
- **Messages de spam bloqués:** > 95%

### 7.2 Dashboards recommandés

1. **Google reCAPTCHA Console**
   - Requêtes par jour
   - Distribution des scores
   - Détection d'anomalies

2. **Logs serveur**
   - Rate limit hits
   - Alertes de sécurité
   - Patterns d'attaque

---

## 🚀 8. DÉPLOIEMENT

### 8.1 Variables d'environnement requises

**Backend (.env):**
```env
RECAPTCHA_SECRET_KEY=votre_secret_key
RECAPTCHA_MIN_SCORE=0.5
```

**Frontend (.env):**
```env
VITE_RECAPTCHA_SITE_KEY=votre_site_key
```

### 8.2 Configuration Vercel

1. Ajouter les variables d'environnement dans Settings
2. Vérifier que `vercel.json` est présent
3. Déployer avec `git push origin main`

### 8.3 Vérification post-déploiement

- [ ] Rate limiting actif (tester avec curl)
- [ ] reCAPTCHA fonctionnel (tester formulaires)
- [ ] Headers de sécurité présents (securityheaders.com)
- [ ] Logs de sécurité visibles
- [ ] Alertes configurées

---

## 🔧 9. MAINTENANCE

### 9.1 Tâches régulières

**Quotidien:**
- Vérifier les logs de sécurité
- Surveiller les alertes reCAPTCHA

**Hebdomadaire:**
- Analyser les patterns d'attaque
- Ajuster les seuils si nécessaire

**Mensuel:**
- Réviser les métriques de sécurité
- Mettre à jour la documentation

**Semestriel:**
- Régénérer les clés reCAPTCHA
- Audit de sécurité complet

### 9.2 Ajustements possibles

**Si trop de faux positifs:**
- Réduire les scores minimum reCAPTCHA
- Augmenter les limites de rate limiting

**Si trop d'attaques passent:**
- Augmenter les scores minimum reCAPTCHA
- Réduire les limites de rate limiting
- Ajouter des protections supplémentaires

---

## 📞 10. SUPPORT ET RESSOURCES

### 10.1 Documentation

- Rate Limiting: https://www.npmjs.com/package/express-rate-limit
- reCAPTCHA v3: https://developers.google.com/recaptcha/docs/v3
- Security Headers: https://securityheaders.com

### 10.2 Outils de test

- **Rate Limit:** curl, Postman, Apache Bench
- **reCAPTCHA:** Console Google, DevTools
- **Headers:** securityheaders.com, observatory.mozilla.org

### 10.3 Contact

Pour toute question sur les protections anti-abus :
- Email: Kontakt_finanzplusaustria@proton.me
- Documentation: `/docs/ANTI_ABUSE_PROTECTIONS.md`

---

## ✅ CHECKLIST DE SÉCURITÉ

### Backend
- [x] Rate limiting middleware créé
- [x] Rate limiters intégrés dans les routes
- [x] reCAPTCHA middleware créé
- [ ] reCAPTCHA intégré dans les routes sensibles
- [x] Logging de sécurité implémenté
- [x] Variables d'environnement configurées

### Frontend
- [ ] Script reCAPTCHA chargé
- [ ] Composant reCAPTCHA créé
- [ ] reCAPTCHA intégré dans les formulaires
- [ ] Gestion des erreurs reCAPTCHA
- [ ] Tests utilisateur effectués

### Infrastructure
- [x] Headers HTTP de sécurité configurés
- [ ] Variables d'environnement sur Vercel
- [ ] Monitoring configuré
- [ ] Alertes configurées
- [ ] Documentation à jour

---

**Made with ❤️ by Bob for FinanzPlus Austria**

**Dernière mise à jour:** 2024-01-15