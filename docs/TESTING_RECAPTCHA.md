# 🧪 Guide de Test reCAPTCHA - FinanzPlus Austria

## 📋 Vue d'ensemble

Ce guide vous permet de tester rapidement les protections anti-abus reCAPTCHA sur les 3 formulaires de l'application.

---

## 🔧 Configuration Préalable

### Clés de Test Google reCAPTCHA

Google fournit des clés de test qui **acceptent toutes les requêtes** sans vérification réelle:

**Clé Site (Frontend):**
```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Clé Secrète (Backend):**
```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

Ces clés sont déjà configurées dans les fichiers `.env` du projet.

---

## ✅ Tests Frontend

### 1. Test du Hook useRecaptcha

**Fichier:** `frontend/src/hooks/useRecaptcha.js`

**Vérifications:**
- [ ] Le script reCAPTCHA se charge automatiquement
- [ ] `isReady` passe à `true` après le chargement
- [ ] `executeRecaptcha()` retourne un token valide
- [ ] Les erreurs sont capturées dans `error`

**Test manuel:**
```javascript
// Dans la console du navigateur
window.grecaptcha.ready(() => {
  window.grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', {action: 'test'})
    .then(token => console.log('Token:', token));
});
```

### 2. Test du Composant RecaptchaBadge

**Fichier:** `frontend/src/components/common/RecaptchaBadge.jsx`

**États à vérifier:**

**État 1: Loading**
```jsx
<RecaptchaBadge isReady={false} error={null} />
```
- [ ] Affiche "Chargement de la protection..."
- [ ] Spinner visible
- [ ] Couleur grise

**État 2: Ready**
```jsx
<RecaptchaBadge isReady={true} error={null} />
```
- [ ] Affiche "Protégé par reCAPTCHA"
- [ ] Icône de bouclier visible
- [ ] Couleur verte
- [ ] Lien vers politique de confidentialité

**État 3: Error**
```jsx
<RecaptchaBadge isReady={false} error="Erreur de chargement" />
```
- [ ] Affiche le message d'erreur
- [ ] Icône d'alerte visible
- [ ] Couleur rouge

---

## 📝 Tests des Formulaires

### Test 1: Formulaire de Contact

**URL:** `http://localhost:3000/contact`

**Étapes:**
1. Ouvrir la page Contact
2. Vérifier que le badge reCAPTCHA s'affiche
3. Attendre que le badge passe à "Protégé par reCAPTCHA" (vert)
4. Remplir le formulaire:
   - Nom: Test User
   - Email: test@example.com
   - Sujet: Test reCAPTCHA
   - Message: Ceci est un test
5. Cliquer sur "Envoyer"

**Résultats attendus:**
- [ ] Badge passe de "Chargement..." à "Protégé"
- [ ] Bouton "Envoyer" désactivé tant que reCAPTCHA n'est pas prêt
- [ ] Requête POST vers `/api/contact/messages` avec header `X-Recaptcha-Token`
- [ ] Message de succès affiché
- [ ] Backend log: "✅ reCAPTCHA vérifié avec succès"

**Vérification Backend:**
```bash
# Dans les logs backend, vous devriez voir:
🔒 Vérification reCAPTCHA - Action: contact
✅ reCAPTCHA vérifié avec succès - Score: 0.9
```

### Test 2: Formulaire de Connexion

**URL:** `http://localhost:3000/login`

**Étapes:**
1. Ouvrir la page Login
2. Vérifier que le badge reCAPTCHA s'affiche
3. Attendre que le badge passe à "Protégé"
4. Remplir le formulaire:
   - Email: test@example.com
   - Password: Test1234!
5. Cliquer sur "Se connecter"

**Résultats attendus:**
- [ ] Badge visible et vert
- [ ] Bouton désactivé jusqu'à ce que reCAPTCHA soit prêt
- [ ] Requête POST vers `/api/auth/login` avec header `X-Recaptcha-Token`
- [ ] Rate limiting: Max 5 tentatives par 15 minutes

**Test Rate Limiting:**
```bash
# Tester 6 tentatives de connexion rapides
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -H "X-Recaptcha-Token: test-token" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "\nTentative $i"
done

# La 6ème devrait retourner:
# "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes."
```

### Test 3: Formulaire d'Inscription

**URL:** `http://localhost:3000/register`

**Étapes:**
1. Ouvrir la page Register
2. Vérifier que le badge reCAPTCHA s'affiche
3. Attendre que le badge passe à "Protégé"
4. Remplir le formulaire:
   - Prénom: Test
   - Nom: User
   - Email: newuser@example.com
   - Téléphone: +43 123 456 789
   - Mot de passe: Test1234!
   - Confirmer: Test1234!
5. Cliquer sur "Créer un compte"

**Résultats attendus:**
- [ ] Badge visible et vert
- [ ] Bouton désactivé jusqu'à ce que reCAPTCHA soit prêt
- [ ] Requête POST vers `/api/auth/register` avec header `X-Recaptcha-Token`
- [ ] Rate limiting: Max 2 inscriptions par heure

**Test Rate Limiting:**
```bash
# Tester 3 inscriptions rapides
for i in {1..3}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -H "X-Recaptcha-Token: test-token" \
    -d '{
      "email":"test'$i'@test.com",
      "password":"Test1234!",
      "firstName":"Test",
      "lastName":"User"
    }'
  echo "\nInscription $i"
done

# La 3ème devrait retourner:
# "Trop d'inscriptions. Veuillez réessayer dans 1 heure."
```

---

## 🔍 Tests Backend

### Test 1: Middleware reCAPTCHA

**Fichier:** `backend/src/middleware/recaptchaVerify.js`

**Test avec token valide:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Recaptcha-Token: valid-test-token" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
```

**Résultat attendu:**
```json
{
  "success": true,
  "message": "Connexion réussie"
}
```

**Test sans token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
```

**Résultat attendu:**
```json
{
  "success": false,
  "message": "Token reCAPTCHA manquant"
}
```

**Test avec token invalide:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Recaptcha-Token: invalid-token" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
```

**Résultat attendu:**
```json
{
  "success": false,
  "message": "Échec de la vérification reCAPTCHA"
}
```

### Test 2: Rate Limiters

**Fichier:** `backend/src/middleware/rateLimiter.js`

**Test General Limiter (100 req/15min):**
```bash
# Envoyer 105 requêtes rapidement
for i in {1..105}; do
  curl http://localhost:5000/health
done

# Les 5 dernières devraient retourner:
# "Trop de requêtes. Veuillez réessayer plus tard."
```

**Test Auth Limiter (5 req/15min):**
```bash
# Déjà testé dans "Test 2: Formulaire de Connexion"
```

**Test Register Limiter (2 req/1h):**
```bash
# Déjà testé dans "Test 3: Formulaire d'Inscription"
```

**Test Contact Limiter (3 req/1h):**
```bash
for i in {1..4}; do
  curl -X POST http://localhost:5000/api/contact/messages \
    -H "Content-Type: application/json" \
    -H "X-Recaptcha-Token: test-token" \
    -d '{
      "name":"Test",
      "email":"test@test.com",
      "subject":"Test",
      "message":"Test message"
    }'
  echo "\nMessage $i"
done

# Le 4ème devrait retourner:
# "Trop de messages envoyés. Veuillez réessayer dans 1 heure."
```

**Test Financial Limiter (20 req/10min):**
```bash
for i in {1..22}; do
  curl -X POST http://localhost:5000/api/loans/simulations \
    -H "Content-Type: application/json" \
    -d '{
      "amount":10000,
      "duration":12,
      "purpose":"auto"
    }'
  echo "\nSimulation $i"
done

# Les 2 dernières devraient retourner:
# "Trop de simulations. Veuillez réessayer dans 10 minutes."
```

---

## 📊 Vérification des Logs

### Logs Backend à surveiller

**Succès reCAPTCHA:**
```
🔒 Vérification reCAPTCHA - Action: login
✅ reCAPTCHA vérifié avec succès - Score: 0.9
```

**Échec reCAPTCHA:**
```
🔒 Vérification reCAPTCHA - Action: login
❌ Score reCAPTCHA trop bas: 0.2 (minimum: 0.5)
```

**Rate Limiting:**
```
⚠️ Rate limit atteint pour IP: 127.0.0.1
```

**Activité suspecte:**
```
🚨 ALERTE: Activité suspecte détectée
   IP: 192.168.1.100
   Action: login
   Score: 0.1
```

---

## 🐛 Dépannage

### Problème: Badge ne s'affiche pas

**Causes possibles:**
1. Script reCAPTCHA ne se charge pas
2. Clé site incorrecte
3. Bloqueur de publicités actif

**Solutions:**
```javascript
// Vérifier dans la console
console.log('reCAPTCHA loaded:', typeof window.grecaptcha !== 'undefined');
console.log('Site key:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);
```

### Problème: Token non envoyé au backend

**Vérification:**
```javascript
// Dans le formulaire, avant l'envoi
console.log('Token:', recaptchaToken);

// Vérifier les headers de la requête
console.log('Headers:', {
  'X-Recaptcha-Token': recaptchaToken
});
```

### Problème: Backend rejette le token

**Vérifications:**
1. Clé secrète correcte dans `.env`
2. Token bien reçu dans le header
3. Connexion internet active (pour vérifier avec Google)

**Debug:**
```javascript
// Dans recaptchaVerify.js
console.log('Token reçu:', token);
console.log('Secret key:', process.env.RECAPTCHA_SECRET_KEY);
console.log('Réponse Google:', response.data);
```

---

## ✅ Checklist de Test Complète

### Frontend
- [ ] Hook useRecaptcha charge le script
- [ ] Badge affiche les 3 états (loading, ready, error)
- [ ] Contact: Badge visible et fonctionnel
- [ ] Login: Badge visible et fonctionnel
- [ ] Register: Badge visible et fonctionnel
- [ ] Boutons désactivés jusqu'à ce que reCAPTCHA soit prêt
- [ ] Tokens générés et envoyés au backend

### Backend
- [ ] Middleware reCAPTCHA vérifie les tokens
- [ ] Scores calculés correctement
- [ ] Rate limiting fonctionne sur tous les endpoints
- [ ] Logs de sécurité affichés
- [ ] Alertes pour activité suspecte

### Intégration
- [ ] Contact: Soumission réussie avec reCAPTCHA
- [ ] Login: Connexion réussie avec reCAPTCHA
- [ ] Register: Inscription réussie avec reCAPTCHA
- [ ] Rate limiting bloque après le nombre défini
- [ ] Messages d'erreur appropriés affichés

---

## 📈 Métriques de Succès

**Taux de réussite attendu:**
- ✅ Utilisateurs légitimes: 95%+ passent
- ❌ Bots: 90%+ bloqués
- ⚠️ Faux positifs: <5%

**Scores typiques:**
- 🟢 Utilisateurs réels: 0.7 - 1.0
- 🟡 Suspects: 0.3 - 0.7
- 🔴 Bots: 0.0 - 0.3

---

**Tests créés avec ❤️ par Bob pour FinanzPlus Austria**