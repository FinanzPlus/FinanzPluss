# 📡 API Endpoints - FinanzPlus Austria

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.finanzplus.at/api
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Routes

### POST /auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "phone": "+43123456789",
  "password": "SecurePass123!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registrierung erfolgreich",
  "data": {
    "user": {
      "id": "uuid",
      "email": "max@example.com",
      "firstName": "Max",
      "lastName": "Max"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "email": "max@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`

### POST /auth/forgot-password
Demande de réinitialisation mot de passe

### POST /auth/reset-password
Réinitialisation mot de passe

### GET /auth/verify-email/:token
Vérification email

---

## 💰 Loan Routes

### POST /loans/calculate
Calcul de prêt (public)

**Body:**
```json
{
  "amount": 15000,
  "duration": 36,
  "interestRate": 3
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "amount": 15000,
    "duration": 36,
    "interestRate": 3,
    "monthlyPayment": 436.12,
    "totalAmount": 15700.32,
    "totalInterest": 700.32,
    "amortizationTable": [
      {
        "month": 1,
        "payment": 436.12,
        "principal": 398.62,
        "interest": 37.50,
        "balance": 14601.38
      }
      // ... 35 autres mois
    ]
  }
}
```

### POST /loans/request
Créer une demande de prêt (protégé)

**Body:**
```json
{
  "fullName": "Max Mustermann",
  "email": "max@example.com",
  "phone": "+43123456789",
  "amount": 15000,
  "duration": 36,
  "purpose": "personnel",
  "purposeDetails": "Rénovation maison",
  "monthlyIncome": 3500,
  "monthlyExpenses": 1800,
  "employmentStatus": "employed"
}
```

**Response:** `201 Created`

### GET /loans/my-requests
Liste des demandes de l'utilisateur (protégé)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 15000,
      "duration": 36,
      "monthlyPayment": 436.12,
      "status": "pending",
      "purpose": "personnel",
      "createdAt": "2026-06-12T10:00:00Z"
    }
  ]
}
```

### GET /loans/request/:id
Détails d'une demande (protégé)

### PUT /loans/request/:id/cancel
Annuler une demande (protégé)

### POST /loans/compare
Comparer plusieurs offres (protégé)

**Body:**
```json
{
  "amount": 15000,
  "duration": 36,
  "partnerIds": ["uuid1", "uuid2", "uuid3"]
}
```

### POST /loans/capacity-calculator
Calculer la capacité d'emprunt (public)

**Body:**
```json
{
  "monthlyIncome": 3500,
  "monthlyExpenses": 1800,
  "duration": 36
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "maxLoanAmount": 20400,
    "monthlyCapacity": 566.67,
    "debtRatio": 33
  }
}
```

### GET /loans/export/:id/pdf
Exporter tableau d'amortissement en PDF (protégé)

---

## 🏦 Partner Routes

### GET /partners
Liste des partenaires bancaires (public)

**Query params:**
- `active=true` - Seulement les actifs
- `sort=displayOrder` - Tri

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Erste Bank",
      "logoUrl": "/assets/logos/erste-bank.png",
      "description": "Première banque autrichienne...",
      "officialWebsite": "https://www.erstebank.at",
      "interestRateMin": 2.5,
      "interestRateMax": 4.5,
      "minLoanAmount": 5000,
      "maxLoanAmount": 50000,
      "certifications": ["FMA", "EU Banking License"]
    }
  ]
}
```

### GET /partners/:id
Détails d'un partenaire (public)

### POST /partners (Admin)
Créer un partenaire

### PUT /partners/:id (Admin)
Modifier un partenaire

### DELETE /partners/:id (Admin)
Supprimer un partenaire

---

## ⭐ Comment Routes

### GET /comments
Liste des avis (public)

**Query params:**
- `rating=5` - Filtrer par note
- `status=approved` - Statut
- `sort=createdAt` - Tri
- `order=desc` - Ordre
- `page=1` - Pagination
- `limit=10` - Limite

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "user": {
          "firstName": "Max",
          "lastName": "M."
        },
        "rating": 5,
        "comment": "Excellent service!",
        "createdAt": "2026-06-12T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    },
    "stats": {
      "averageRating": 4.7,
      "totalComments": 45,
      "distribution": {
        "5": 30,
        "4": 10,
        "3": 3,
        "2": 1,
        "1": 1
      }
    }
  }
}
```

### POST /comments
Créer un avis (protégé)

**Body:**
```json
{
  "rating": 5,
  "comment": "Service excellent et rapide!"
}
```

### PUT /comments/:id (Admin)
Modérer un avis

### DELETE /comments/:id (Admin ou auteur)
Supprimer un avis

---

## 📄 Document Routes

### POST /documents/upload
Upload un document (protégé)

**Form Data:**
- `file`: File
- `documentType`: string
- `loanRequestId`: uuid (optionnel)

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "passport.pdf",
    "documentType": "passport",
    "status": "pending",
    "uploadedAt": "2026-06-12T10:00:00Z"
  }
}
```

### GET /documents/my-documents
Liste des documents de l'utilisateur (protégé)

### GET /documents/:id/download
Télécharger un document (protégé)

### DELETE /documents/:id
Supprimer un document (protégé)

### PUT /documents/:id/verify (Admin)
Vérifier/Rejeter un document

---

## 📊 Credit Score Routes

### GET /credit-score/my-score
Score de crédit de l'utilisateur (protégé)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "score": 720,
    "category": "good",
    "factors": {
      "paymentHistory": 85,
      "creditUtilization": 70,
      "creditHistoryLength": 65,
      "creditMix": 75
    },
    "lastCalculated": "2026-06-12T10:00:00Z",
    "nextUpdate": "2026-07-12T10:00:00Z"
  }
}
```

### POST /credit-score/calculate (Admin)
Recalculer le score

---

## 🔔 Notification Routes

### GET /notifications
Liste des notifications (protégé)

**Query params:**
- `unread=true` - Seulement non lues
- `type=loan_status_change` - Par type

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "loan_status_change",
      "title": "Kreditantrag genehmigt",
      "message": "Ihr Kreditantrag wurde genehmigt!",
      "isRead": false,
      "actionUrl": "/dashboard/loans/uuid",
      "createdAt": "2026-06-12T10:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

### PUT /notifications/:id/read
Marquer comme lu (protégé)

### PUT /notifications/read-all
Marquer tout comme lu (protégé)

### DELETE /notifications/:id
Supprimer une notification (protégé)

---

## ❓ FAQ Routes

### GET /faq
Liste des FAQs (public)

**Query params:**
- `category=Allgemeine Fragen`
- `search=kredit`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category": "Allgemeine Fragen",
      "question": "Wie lange dauert die Kreditgenehmigung?",
      "answer": "In der Regel 24-48 Stunden...",
      "viewsCount": 156
    }
  ]
}
```

### POST /faq (Admin)
Créer une FAQ

### PUT /faq/:id (Admin)
Modifier une FAQ

### DELETE /faq/:id (Admin)
Supprimer une FAQ

---

## 📞 Contact Routes

### POST /contact/message
Envoyer un message de contact (public)

**Body:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "phone": "+43123456789",
  "subject": "Frage zu Kreditkonditionen",
  "message": "Ich hätte eine Frage..."
}
```

**Response:** `201 Created`

### GET /contact/messages (Admin)
Liste des messages

### PUT /contact/messages/:id/status (Admin)
Changer le statut d'un message

---

## 🕐 Opening Hours Routes

### GET /opening-hours
Horaires d'ouverture (public)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "hours": [
      {
        "dayOfWeek": 1,
        "dayName": "Montag",
        "openingTime": "09:00",
        "closingTime": "18:00",
        "isClosed": false
      }
    ],
    "currentStatus": {
      "isOpen": true,
      "message": "Jetzt geöffnet",
      "nextChange": "Schließt um 18:00"
    }
  }
}
```

### PUT /opening-hours/:id (Admin)
Modifier les horaires

---

## 👤 User Routes

### GET /users/profile
Profil de l'utilisateur (protégé)

### PUT /users/profile
Modifier le profil (protégé)

**Body:**
```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "phone": "+43123456789",
  "monthlyIncome": 3500,
  "monthlyExpenses": 1800
}
```

### PUT /users/change-password
Changer le mot de passe (protégé)

### DELETE /users/account
Supprimer le compte (protégé)

---

## 👨‍💼 Admin Routes

### GET /admin/dashboard/stats
Statistiques du dashboard (admin)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "today": {
      "newRequests": 5,
      "pendingRequests": 12,
      "approvedRequests": 3
    },
    "thisMonth": {
      "totalRequests": 87,
      "totalAmount": 1250000,
      "averageAmount": 14367,
      "approvalRate": 78
    },
    "charts": {
      "requestsByDay": [...],
      "requestsByPurpose": {...},
      "amountDistribution": [...]
    }
  }
}
```

### GET /admin/loans/requests
Toutes les demandes (admin)

**Query params:**
- `status=pending`
- `dateFrom=2026-06-01`
- `dateTo=2026-06-30`
- `minAmount=10000`
- `maxAmount=50000`

### PUT /admin/loans/request/:id/status
Changer le statut d'une demande (admin)

**Body:**
```json
{
  "status": "approved",
  "adminNotes": "Tous les documents vérifiés"
}
```

### GET /admin/users
Liste des utilisateurs (admin)

### PUT /admin/users/:id/role
Changer le rôle d'un utilisateur (admin)

### GET /admin/comments/pending
Avis en attente de modération (admin)

### PUT /admin/comments/:id/moderate
Modérer un avis (admin)

---

## 📜 Legal Routes

### GET /legal/privacy-policy
Politique de confidentialité (public)

### GET /legal/terms-conditions
Conditions générales (public)

### GET /legal/cookie-policy
Politique des cookies (public)

### GET /legal/impressum
Impressum (public)

### POST /legal/consent
Enregistrer un consentement (protégé)

**Body:**
```json
{
  "consentType": "privacy_policy",
  "consented": true
}
```

---

## 📈 Analytics Routes

### POST /analytics/track
Tracker un événement (public)

**Body:**
```json
{
  "event": "loan_calculator_used",
  "data": {
    "amount": 15000,
    "duration": 36
  }
}
```

---

## Codes d'Erreur

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "E-Mail-Adresse ist ungültig"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Nicht autorisiert"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Zugriff verweigert"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Ressource nicht gefunden"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Zu viele Anfragen. Bitte versuchen Sie es später erneut."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Interner Serverfehler"
}
```

---

## Rate Limiting

- **Authentification**: 5 requêtes / 15 minutes
- **API générale**: 100 requêtes / 15 minutes
- **Upload fichiers**: 10 requêtes / heure
- **Contact**: 3 requêtes / heure

---

## Pagination

Format standard pour les listes paginées:

**Query params:**
- `page=1` (défaut: 1)
- `limit=10` (défaut: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}