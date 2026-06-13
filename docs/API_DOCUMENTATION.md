# 🔌 Documentation API - FinanzPlus Austria

## Vue d'ensemble

API RESTful pour la plateforme FinanzPlus Austria. Toutes les requêtes et réponses sont au format JSON.

**Base URL** : `https://api.finanzplus.at/api`  
**Version** : 1.0  
**Authentification** : JWT Bearer Token

---

## 📋 Table des Matières

1. [Authentification](#authentification)
2. [Utilisateurs](#utilisateurs)
3. [Demandes de Prêt](#demandes-de-prêt)
4. [Partenaires](#partenaires)
5. [Documents](#documents)
6. [Notifications](#notifications)
7. [Avis](#avis)
8. [Contact](#contact)
9. [Codes d'Erreur](#codes-derreur)

---

## 🔐 Authentification

### Inscription

**Endpoint** : `POST /auth/register`

**Body** :
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+43 660 123 4567"
}
```

**Réponse** : `201 Created`
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs** :
- `400` : Données invalides
- `409` : Email déjà utilisé

---

### Connexion

**Endpoint** : `POST /auth/login`

**Body** :
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs** :
- `401` : Identifiants incorrects
- `403` : Compte suspendu

---

### Vérifier le Token

**Endpoint** : `GET /auth/verify`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "customer"
    }
  }
}
```

---

## 👤 Utilisateurs

### Obtenir le Profil

**Endpoint** : `GET /users/profile`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+43 660 123 4567",
    "address": {
      "street": "Kärntner Straße 123",
      "city": "Wien",
      "postalCode": "1010",
      "country": "Austria"
    },
    "role": "customer",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### Mettre à Jour le Profil

**Endpoint** : `PUT /users/profile`

**Headers** :
```
Authorization: Bearer {token}
```

**Body** :
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+43 660 123 4567",
  "address": {
    "street": "Kärntner Straße 123",
    "city": "Wien",
    "postalCode": "1010",
    "country": "Austria"
  }
}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Changer le Mot de Passe

**Endpoint** : `PUT /users/password`

**Headers** :
```
Authorization: Bearer {token}
```

**Body** :
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "message": "Mot de passe modifié avec succès"
}
```

**Erreurs** :
- `401` : Mot de passe actuel incorrect
- `400` : Nouveau mot de passe invalide

---

## 💰 Demandes de Prêt

### Créer une Demande

**Endpoint** : `POST /loan-requests`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** :
```json
{
  "amount": 50000,
  "duration": 240,
  "purpose": "Immobilienfinanzierung",
  "monthlyIncome": 3500,
  "employmentStatus": "employed",
  "employer": "ABC GmbH",
  "employmentDuration": 36
}
```

**Réponse** : `201 Created`
```json
{
  "success": true,
  "message": "Demande créée avec succès",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 50000,
    "duration": 240,
    "purpose": "Immobilienfinanzierung",
    "status": "pending",
    "monthlyPayment": 312.50,
    "totalCost": 75000,
    "interestRate": 3.5,
    "createdAt": "2026-06-12T10:00:00Z"
  }
}
```

**Erreurs** :
- `400` : Données invalides
- `401` : Non authentifié
- `422` : Montant hors limites (1000-500000)

---

### Obtenir Mes Demandes

**Endpoint** : `GET /loan-requests`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Parameters** :
- `status` : pending, approved, rejected, in_review (optionnel)
- `page` : Numéro de page (défaut: 1)
- `limit` : Résultats par page (défaut: 20)

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "amount": 50000,
        "duration": 240,
        "purpose": "Immobilienfinanzierung",
        "status": "pending",
        "monthlyPayment": 312.50,
        "createdAt": "2026-06-12T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### Obtenir une Demande Spécifique

**Endpoint** : `GET /loan-requests/:id`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 50000,
    "duration": 240,
    "purpose": "Immobilienfinanzierung",
    "status": "pending",
    "monthlyPayment": 312.50,
    "totalCost": 75000,
    "interestRate": 3.5,
    "monthlyIncome": 3500,
    "employmentStatus": "employed",
    "documents": [
      {
        "id": "uuid",
        "type": "identity",
        "filename": "passport.pdf",
        "uploadedAt": "2026-06-12T10:05:00Z"
      }
    ],
    "createdAt": "2026-06-12T10:00:00Z",
    "updatedAt": "2026-06-12T10:05:00Z"
  }
}
```

**Erreurs** :
- `404` : Demande non trouvée
- `403` : Accès non autorisé

---

### Calculer un Prêt

**Endpoint** : `POST /loan-requests/calculate`

**Body** :
```json
{
  "amount": 50000,
  "duration": 240,
  "interestRate": 3.5
}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "amount": 50000,
    "duration": 240,
    "interestRate": 3.5,
    "monthlyPayment": 312.50,
    "totalCost": 75000,
    "totalInterest": 25000,
    "amortizationSchedule": [
      {
        "month": 1,
        "payment": 312.50,
        "principal": 166.67,
        "interest": 145.83,
        "balance": 49833.33
      }
    ]
  }
}
```

---

## 🏦 Partenaires

### Obtenir Tous les Partenaires

**Endpoint** : `GET /partners`

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Erste Bank",
      "logo": "/assets/logos/erste-bank.png",
      "description": "Première banque d'Autriche...",
      "minAmount": 1000,
      "maxAmount": 500000,
      "minDuration": 12,
      "maxDuration": 360,
      "minInterestRate": 2.5,
      "maxInterestRate": 5.0,
      "features": [
        "Réponse rapide",
        "Taux compétitifs",
        "Service personnalisé"
      ]
    }
  ]
}
```

---

### Comparer les Offres

**Endpoint** : `POST /partners/compare`

**Body** :
```json
{
  "amount": 50000,
  "duration": 240
}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "offers": [
      {
        "partner": {
          "id": "uuid",
          "name": "Erste Bank",
          "logo": "/assets/logos/erste-bank.png"
        },
        "interestRate": 2.5,
        "monthlyPayment": 295.00,
        "totalCost": 70800,
        "totalInterest": 20800
      },
      {
        "partner": {
          "id": "uuid",
          "name": "Raiffeisen Bank",
          "logo": "/assets/logos/raiffeisen.png"
        },
        "interestRate": 2.8,
        "monthlyPayment": 305.00,
        "totalCost": 73200,
        "totalInterest": 23200
      }
    ]
  }
}
```

---

## 📄 Documents

### Télécharger un Document

**Endpoint** : `POST /documents`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body** (FormData) :
```
file: [PDF file]
type: identity | proof_of_address | payslip | bank_statement
loanRequestId: uuid (optionnel)
```

**Réponse** : `201 Created`
```json
{
  "success": true,
  "message": "Document téléchargé avec succès",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "type": "identity",
    "filename": "passport.pdf",
    "size": 1024000,
    "uploadedAt": "2026-06-12T10:00:00Z"
  }
}
```

**Erreurs** :
- `400` : Format invalide (PDF uniquement)
- `413` : Fichier trop volumineux (max 5MB)

---

### Obtenir Mes Documents

**Endpoint** : `GET /documents`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Parameters** :
- `type` : Type de document (optionnel)
- `loanRequestId` : ID de la demande (optionnel)

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "identity",
      "filename": "passport.pdf",
      "size": 1024000,
      "uploadedAt": "2026-06-12T10:00:00Z",
      "url": "/api/documents/uuid/download"
    }
  ]
}
```

---

### Télécharger un Document

**Endpoint** : `GET /documents/:id/download`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** : `200 OK`
- Content-Type: application/pdf
- Fichier PDF en stream

---

### Supprimer un Document

**Endpoint** : `DELETE /documents/:id`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "message": "Document supprimé avec succès"
}
```

---

## 🔔 Notifications

### Obtenir Mes Notifications

**Endpoint** : `GET /notifications`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Parameters** :
- `unread` : true/false (optionnel)
- `page` : Numéro de page
- `limit` : Résultats par page

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "loan_approved",
        "title": "Demande approuvée",
        "message": "Votre demande de prêt a été approuvée !",
        "read": false,
        "createdAt": "2026-06-12T10:00:00Z"
      }
    ],
    "unreadCount": 3,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

---

### Marquer comme Lu

**Endpoint** : `PUT /notifications/:id/read`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "message": "Notification marquée comme lue"
}
```

---

### Marquer Toutes comme Lues

**Endpoint** : `PUT /notifications/read-all`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "message": "Toutes les notifications marquées comme lues"
}
```

---

## ⭐ Avis

### Obtenir Tous les Avis

**Endpoint** : `GET /reviews`

**Query Parameters** :
- `rating` : 1-5 (optionnel)
- `page` : Numéro de page
- `limit` : Résultats par page

**Réponse** : `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "user": {
          "firstName": "John",
          "lastName": "D."
        },
        "rating": 5,
        "comment": "Excellent service !",
        "createdAt": "2026-06-10T14:30:00Z"
      }
    ],
    "stats": {
      "averageRating": 4.7,
      "totalReviews": 245,
      "distribution": {
        "5": 180,
        "4": 45,
        "3": 15,
        "2": 3,
        "1": 2
      }
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 245,
      "pages": 13
    }
  }
}
```

---

### Créer un Avis

**Endpoint** : `POST /reviews`

**Headers** :
```
Authorization: Bearer {token}
```

**Body** :
```json
{
  "loanRequestId": "uuid",
  "rating": 5,
  "comment": "Excellent service, très professionnel !"
}
```

**Réponse** : `201 Created`
```json
{
  "success": true,
  "message": "Avis créé avec succès",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "rating": 5,
    "comment": "Excellent service, très professionnel !",
    "createdAt": "2026-06-12T10:00:00Z"
  }
}
```

**Erreurs** :
- `403` : Vous devez avoir une demande approuvée
- `409` : Vous avez déjà laissé un avis

---

## 📧 Contact

### Envoyer un Message

**Endpoint** : `POST /contact`

**Body** :
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+43 660 123 4567",
  "subject": "Question sur un prêt",
  "message": "Bonjour, j'aimerais avoir plus d'informations..."
}
```

**Réponse** : `200 OK`
```json
{
  "success": true,
  "message": "Message envoyé avec succès. Nous vous répondrons dans les 24h."
}
```

---

### Prendre un Rendez-vous

**Endpoint** : `POST /appointments`

**Headers** :
```
Authorization: Bearer {token}
```

**Body** :
```json
{
  "type": "consultation",
  "date": "2026-06-15",
  "time": "14:00",
  "notes": "Première consultation pour un prêt immobilier"
}
```

**Réponse** : `201 Created`
```json
{
  "success": true,
  "message": "Rendez-vous confirmé",
  "data": {
    "id": "uuid",
    "type": "consultation",
    "date": "2026-06-15",
    "time": "14:00",
    "status": "confirmed",
    "createdAt": "2026-06-12T10:00:00Z"
  }
}
```

---

## ❌ Codes d'Erreur

### Format de Réponse d'Erreur

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies sont invalides",
    "details": [
      {
        "field": "email",
        "message": "Email invalide"
      }
    ]
  }
}
```

### Codes HTTP

| Code | Signification |
|------|---------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête invalide |
| `401` | Non authentifié |
| `403` | Accès interdit |
| `404` | Ressource non trouvée |
| `409` | Conflit (ex: email déjà utilisé) |
| `413` | Fichier trop volumineux |
| `422` | Entité non traitable |
| `429` | Trop de requêtes |
| `500` | Erreur serveur |

### Codes d'Erreur Personnalisés

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Identifiants incorrects |
| `AUTH_TOKEN_EXPIRED` | Token expiré |
| `AUTH_TOKEN_INVALID` | Token invalide |
| `VALIDATION_ERROR` | Erreur de validation |
| `USER_NOT_FOUND` | Utilisateur non trouvé |
| `USER_ALREADY_EXISTS` | Utilisateur déjà existant |
| `LOAN_REQUEST_NOT_FOUND` | Demande non trouvée |
| `LOAN_AMOUNT_OUT_OF_RANGE` | Montant hors limites |
| `DOCUMENT_INVALID_FORMAT` | Format de document invalide |
| `DOCUMENT_TOO_LARGE` | Document trop volumineux |
| `INSUFFICIENT_PERMISSIONS` | Permissions insuffisantes |
| `RATE_LIMIT_EXCEEDED` | Limite de requêtes dépassée |

---

## 🔒 Sécurité

### Rate Limiting

- **Authentification** : 5 requêtes / 15 minutes
- **API générale** : 100 requêtes / 15 minutes
- **Upload** : 10 fichiers / heure

### Headers de Sécurité

Toutes les réponses incluent :
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### CORS

Origines autorisées :
- `https://finanzplus.at`
- `https://www.finanzplus.at`

---

## 📝 Exemples de Code

### JavaScript (Fetch)

```javascript
// Connexion
const login = async (email, password) => {
  const response = await fetch('https://api.finanzplus.at/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  }
  
  throw new Error(data.error.message);
};

// Créer une demande
const createLoanRequest = async (loanData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://api.finanzplus.at/api/loan-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(loanData)
  });
  
  return await response.json();
};
```

### cURL

```bash
# Connexion
curl -X POST https://api.finanzplus.at/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'

# Obtenir le profil
curl -X GET https://api.finanzplus.at/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Créer une demande
curl -X POST https://api.finanzplus.at/api/loan-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount":50000,"duration":240,"purpose":"Immobilienfinanzierung"}'
```

---

## 🔄 Webhooks (Admin uniquement)

### Configuration

Les webhooks permettent de recevoir des notifications en temps réel.

**Événements disponibles** :
- `loan_request.created`
- `loan_request.approved`
- `loan_request.rejected`
- `document.uploaded`
- `user.registered`

**Format de payload** :
```json
{
  "event": "loan_request.created",
  "timestamp": "2026-06-12T10:00:00Z",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 50000,
    "status": "pending"
  }
}
```

---

## 📞 Support

**Email** : api@finanzplus.at  
**Documentation** : https://docs.finanzplus.at  
**Status** : https://status.finanzplus.at

---

**Version** : 1.0  
**Dernière mise à jour** : 2026-06-12  
**Changelog** : https://docs.finanzplus.at/changelog