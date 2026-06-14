# 📧 GUIDE DE TEST DES EMAILS - FINANZPLUS AUSTRIA

## 🎯 Objectif

Ce guide vous permet de tester et diagnostiquer le système d'envoi d'emails automatiques via Resend après une demande de prêt.

---

## ✅ Prérequis

### 1. Configuration Resend

- ✅ Compte Resend créé sur https://resend.com
- ✅ Domaine `finanzplus.xyz` vérifié sur Resend
- ✅ Clé API Resend générée
- ✅ Variables d'environnement configurées sur Railway:
  - `RESEND_API_KEY=re_xxxxx`
  - `EMAIL_FROM=noreply@finanzplus.xyz`
  - `ADMIN_EMAIL=admin@finanzplus.xyz` (optionnel)

### 2. Backend déployé

- ✅ Backend déployé sur Railway
- ✅ URL du backend accessible (ex: `https://finanzplus-backend.up.railway.app`)

---

## 🧪 TESTS À EFFECTUER

### Test 1: Vérifier la configuration Resend

**Endpoint:** `POST /api/loans/test-email`

**Objectif:** Tester que Resend fonctionne indépendamment du reste de l'application.

#### Avec cURL:

```bash
curl -X POST https://finanzplus-backend.up.railway.app/api/loans/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "votre-email@example.com"}'
```

#### Avec Postman:

1. Méthode: `POST`
2. URL: `https://finanzplus-backend.up.railway.app/api/loans/test-email`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "votre-email@example.com"
}
```

#### Réponse attendue (succès):

```json
{
  "success": true,
  "message": "Email de test envoyé avec succès",
  "messageId": "abc123-def456-ghi789",
  "config": {
    "resendConfigured": true,
    "emailFrom": "noreply@finanzplus.xyz"
  }
}
```

#### Réponse en cas d'erreur:

```json
{
  "success": false,
  "message": "Erreur lors de l'envoi de l'email de test",
  "error": "Message d'erreur détaillé",
  "config": {
    "resendConfigured": false,
    "emailFrom": "noreply@finanzplus.xyz"
  }
}
```

**✅ Vérifications:**
- [ ] Statut HTTP 200
- [ ] `success: true`
- [ ] `resendConfigured: true`
- [ ] Email reçu dans votre boîte de réception
- [ ] Vérifier les spams si l'email n'arrive pas

---

### Test 2: Soumettre une demande de prêt complète

**Endpoint:** `POST /api/loans/applications`

**Objectif:** Tester le flux complet avec envoi d'emails client et équipe.

#### Avec cURL:

```bash
curl -X POST https://finanzplus-backend.up.railway.app/api/loans/applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Max",
    "lastName": "Mustermann",
    "email": "max.mustermann@example.com",
    "phone": "+43 664 123 4567",
    "amount": 15000,
    "duration": 60,
    "purpose": "Autokauf",
    "selectedBank": {
      "name": "Erste Bank",
      "rate": 3.5
    },
    "monthlyPayment": 270.50,
    "totalAmount": 16230
  }'
```

#### Avec Postman:

1. Méthode: `POST`
2. URL: `https://finanzplus-backend.up.railway.app/api/loans/applications`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max.mustermann@example.com",
  "phone": "+43 664 123 4567",
  "amount": 15000,
  "duration": 60,
  "purpose": "Autokauf",
  "selectedBank": {
    "name": "Erste Bank",
    "rate": 3.5
  },
  "monthlyPayment": 270.50,
  "totalAmount": 16230
}
```

#### Réponse attendue:

```json
{
  "success": true,
  "message": "Demande soumise avec succès",
  "data": {
    "first_name": "Max",
    "last_name": "Mustermann",
    "email": "max.mustermann@example.com",
    "phone": "+43 664 123 4567",
    "amount": 15000,
    "duration": 60,
    "purpose": "Autokauf",
    "bank_name": "Erste Bank",
    "bank_rate": 3.5,
    "monthly_payment": 270.50,
    "total_amount": 16230,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**✅ Vérifications:**
- [ ] Statut HTTP 201
- [ ] `success: true`
- [ ] Email de confirmation reçu par le client (max.mustermann@example.com)
- [ ] Email de notification reçu par l'équipe (admin@finanzplus.xyz)
- [ ] Les emails contiennent toutes les informations correctes
- [ ] Le design des emails est professionnel

---

### Test 3: Tester depuis le frontend

**Objectif:** Tester le flux complet depuis l'interface utilisateur.

#### Étapes:

1. **Accéder au simulateur de prêt:**
   - URL: `https://votre-frontend.vercel.app/simulateur`

2. **Remplir le formulaire:**
   - Montant: 15 000 €
   - Durée: 60 mois
   - Sélectionner une banque
   - Cliquer sur "Calculer"

3. **Soumettre la demande:**
   - Remplir les informations personnelles
   - Email: votre-email@example.com
   - Téléphone: +43 664 123 4567
   - Cliquer sur "Soumettre la demande"

4. **Vérifier la redirection WhatsApp:**
   - Vous devriez être redirigé vers WhatsApp
   - Le message pré-rempli doit contenir les détails du prêt

5. **Vérifier les emails:**
   - Email de confirmation dans votre boîte de réception
   - Vérifier les spams si nécessaire

**✅ Vérifications:**
- [ ] Formulaire soumis sans erreur
- [ ] Redirection WhatsApp fonctionne
- [ ] Email de confirmation reçu
- [ ] Email contient les bonnes informations
- [ ] Design responsive sur mobile

---

## 🔍 DIAGNOSTIC DES PROBLÈMES

### Problème 1: Aucun email reçu

**Causes possibles:**

1. **RESEND_API_KEY manquante ou invalide**
   - Vérifier sur Railway: Settings → Variables
   - Vérifier que la clé commence par `re_`
   - Régénérer une nouvelle clé sur Resend si nécessaire

2. **EMAIL_FROM incorrect**
   - Doit être une adresse du domaine vérifié: `noreply@finanzplus.xyz`
   - Pas `noreply@finanzplus.at` ou autre domaine

3. **Domaine non vérifié sur Resend**
   - Aller sur https://resend.com/domains
   - Vérifier que `finanzplus.xyz` est vérifié (✅)
   - Ajouter les enregistrements DNS si nécessaire

4. **Package Resend non installé**
   - Vérifier `backend/package.json` contient `"resend": "^3.2.0"`
   - Redéployer sur Railway après modification

**Solutions:**

```bash
# 1. Vérifier les logs Railway
# Aller sur Railway → Deployments → Logs
# Chercher les messages avec [EMAIL]

# 2. Tester l'endpoint de diagnostic
curl -X POST https://finanzplus-backend.up.railway.app/api/loans/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "votre-email@example.com"}'

# 3. Vérifier la réponse
# Si resendConfigured: false → problème de configuration
# Si erreur 401 → clé API invalide
# Si erreur 403 → domaine non vérifié
```

---

### Problème 2: Erreur 401 Unauthorized

**Cause:** Clé API Resend invalide ou expirée

**Solution:**

1. Aller sur https://resend.com/api-keys
2. Créer une nouvelle clé API
3. Copier la clé (commence par `re_`)
4. Sur Railway:
   - Settings → Variables
   - Modifier `RESEND_API_KEY`
   - Coller la nouvelle clé
   - Redéployer

---

### Problème 3: Erreur 403 Forbidden

**Cause:** Domaine non vérifié ou EMAIL_FROM incorrect

**Solution:**

1. Vérifier le domaine sur Resend:
   - https://resend.com/domains
   - `finanzplus.xyz` doit avoir un ✅ vert

2. Vérifier EMAIL_FROM sur Railway:
   - Doit être: `noreply@finanzplus.xyz`
   - Pas d'autre domaine

3. Si le domaine n'est pas vérifié:
   - Ajouter les enregistrements DNS fournis par Resend
   - Attendre la propagation (quelques minutes à 24h)

---

### Problème 4: Email dans les spams

**Causes:**
- Nouveau domaine sans réputation
- Manque d'enregistrements SPF/DKIM/DMARC

**Solutions:**

1. **Vérifier les enregistrements DNS:**
   - SPF: `v=spf1 include:_spf.resend.com ~all`
   - DKIM: Fourni par Resend lors de la vérification
   - DMARC: `v=DMARC1; p=none;`

2. **Améliorer la réputation:**
   - Envoyer des emails régulièrement
   - Éviter les mots spam dans le contenu
   - Demander aux destinataires de marquer comme "Non spam"

3. **Utiliser un domaine établi:**
   - Si possible, utiliser un domaine avec historique
   - Ou attendre que le nouveau domaine gagne en réputation

---

## 📊 VÉRIFICATION DES LOGS

### Sur Railway:

1. Aller sur Railway Dashboard
2. Sélectionner votre projet backend
3. Onglet "Deployments"
4. Cliquer sur le dernier déploiement
5. Onglet "Logs"

### Logs à chercher:

**Initialisation du service:**
```
📧 [EMAIL SERVICE] Initialisation du service email...
✅ [EMAIL SERVICE] RESEND_API_KEY trouvée
✅ [EMAIL SERVICE] Service Resend initialisé
📧 [EMAIL SERVICE] Email FROM: noreply@finanzplus.xyz
```

**Lors d'une demande:**
```
🚀 [SUBMIT APPLICATION] Nouvelle demande reçue
🚀 [SUBMIT APPLICATION] Client: Max Mustermann
📧 [SUBMIT APPLICATION] Envoi des emails...
📧 [ENVOI EMAIL CLIENT] Début de l'envoi...
✅ [ENVOI EMAIL CLIENT] Email envoyé avec succès!
✅ [ENVOI EMAIL CLIENT] ID: abc123-def456
```

**En cas d'erreur:**
```
❌ [ENVOI EMAIL CLIENT] ERREUR CRITIQUE:
❌ [ENVOI EMAIL CLIENT] Message: Invalid API key
```

---

## 🎯 CHECKLIST FINALE

Avant de considérer le système comme fonctionnel:

### Configuration:
- [ ] RESEND_API_KEY configurée sur Railway
- [ ] EMAIL_FROM = noreply@finanzplus.xyz
- [ ] ADMIN_EMAIL configuré (optionnel)
- [ ] Package resend installé dans package.json
- [ ] Domaine finanzplus.xyz vérifié sur Resend

### Tests:
- [ ] Test 1 réussi (endpoint test-email)
- [ ] Test 2 réussi (demande complète via API)
- [ ] Test 3 réussi (demande depuis le frontend)
- [ ] Emails reçus dans la boîte de réception (pas spam)
- [ ] Design des emails correct sur desktop et mobile

### Logs:
- [ ] Logs Railway montrent l'initialisation correcte
- [ ] Logs montrent l'envoi réussi des emails
- [ ] Aucune erreur dans les logs

### Fonctionnel:
- [ ] Client reçoit email de confirmation
- [ ] Équipe reçoit notification interne
- [ ] Redirection WhatsApp fonctionne
- [ ] Toutes les informations sont correctes dans les emails

---

## 📞 SUPPORT

Si les problèmes persistent après avoir suivi ce guide:

1. **Vérifier la documentation Resend:**
   - https://resend.com/docs

2. **Contacter le support Resend:**
   - https://resend.com/support

3. **Vérifier les logs détaillés:**
   - Railway → Logs
   - Chercher les messages d'erreur spécifiques

4. **Tester avec un autre email:**
   - Parfois certains fournisseurs bloquent les emails
   - Essayer avec Gmail, Outlook, etc.

---

## 🚀 PROCHAINES ÉTAPES

Une fois les emails fonctionnels:

1. **Personnaliser les templates:**
   - Modifier `backend/src/services/emailService.js`
   - Ajuster les couleurs, textes, logos

2. **Ajouter des analytics:**
   - Tracker les ouvertures d'emails
   - Tracker les clics sur les liens

3. **Améliorer la délivrabilité:**
   - Configurer SPF/DKIM/DMARC
   - Monitorer la réputation du domaine

4. **Ajouter d'autres types d'emails:**
   - Email de bienvenue
   - Email de rappel
   - Email de suivi

---

**Dernière mise à jour:** 14 juin 2026  
**Version:** 1.0  
**Auteur:** Bob pour FinanzPlus Austria