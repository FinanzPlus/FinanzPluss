
# 🏦 Plan de Refactorisation Complet - FinanzPlus Austria
## Transformation en Plateforme 100% Financière

---

## 📋 Vue d'Ensemble du Projet

### Objectif Principal
Transformer le site e-commerce actuel (voitures + meubles) en une **plateforme financière premium** spécialisée dans les offres de prêt, en partenariat avec des banques autrichiennes.

### Stack Technique Conservée
- **Frontend**: React 18+ avec Vite
- **Backend**: Node.js + Express
- **Base de données**: PostgreSQL 14+
- **Authentification**: JWT
- **Langue**: Allemand (Deutsch) 🇦🇹

### Design Premium
- **Couleurs**: Bleu marine profond (#0A1628) + Or (#C9A84C) + Blanc cassé (#F8F6F1)
- **Police**: Inter ou Poppins (Google Fonts)
- **Style**: Finance premium - épuré, sobre, luxueux
- **Animations**: Subtiles au scroll (fade-in, slide-up)

---

## 🗂️ Nouvelle Architecture du Projet

```
finanzplus-austria/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   ├── email.js
│   │   │   └── whatsapp.js (NOUVEAU)
│   │   ├── models/
│   │   │   ├── User.js (MODIFIÉ)
│   │   │   ├── LoanRequest.js (ENRICHI)
│   │   │   ├── Partner.js (NOUVEAU)
│   │   │   ├── Comment.js (MODIFIÉ)
│   │   │   ├── Document.js (NOUVEAU)
│   │   │   ├── CreditScore.js (NOUVEAU)
│   │   │   ├── FAQ.js (NOUVEAU)
│   │   │   ├── LoanComparison.js (NOUVEAU)
│   │   │   ├── Notification.js (NOUVEAU)
│   │   │   ├── OpeningHours.js
│   │   │   ├── ContactMessage.js
│   │   │   └── LegalDocument.js (NOUVEAU)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── loanController.js (NOUVEAU)
│   │   │   ├── partnerController.js (NOUVEAU)
│   │   │   ├── commentController.js (MODIFIÉ)
│   │   │   ├── contactController.js
│   │   │   ├── documentController.js (NOUVEAU)
│   │   │   ├── creditScoreController.js (NOUVEAU)
│   │   │   ├── faqController.js (NOUVEAU)
│   │   │   ├── notificationController.js (NOUVEAU)
│   │   │   └── adminController.js (ENRICHI)
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── loans.js (NOUVEAU)
│   │   │   ├── partners.js (NOUVEAU)
│   │   │   ├── comments.js (MODIFIÉ)
│   │   │   ├── contact.js
│   │   │   ├── documents.js (NOUVEAU)
│   │   │   ├── creditScore.js (NOUVEAU)
│   │   │   ├── faq.js (NOUVEAU)
│   │   │   ├── notifications.js (NOUVEAU)
│   │   │   └── admin.js (ENRICHI)
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── fileUpload.js (NOUVEAU)
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── emailService.js
│   │   │   ├── pdfGenerator.js (ENRICHI)
│   │   │   ├── loanCalculator.js (NOUVEAU)
│   │   │   ├── whatsappService.js (NOUVEAU)
│   │   │   ├── notificationService.js (NOUVEAU)
│   │   │   └── helpers.js
│   │   └── server.js
│   ├── uploads/ (NOUVEAU)
│   │   └── documents/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   │       ├── logos/
│   │       │   ├── bank-partners/ (NOUVEAU)
│   │       │   └── certifications/ (NOUVEAU)
│   │       └── images/
│   │           ├── hero/ (NOUVEAU)
│   │           ├── team/ (NOUVEAU)
│   │           └── testimonials/ (NOUVEAU)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx (MODIFIÉ)
│   │   │   │   ├── Footer.jsx (MODIFIÉ)
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── WhatsAppButton.jsx (NOUVEAU)
│   │   │   │   ├── TrustBadges.jsx (NOUVEAU)
│   │   │   │   ├── ProgressBar.jsx (NOUVEAU)
│   │   │   │   └── ChatSupport.jsx (NOUVEAU)
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx (MODIFIÉ)
│   │   │   │   ├── RegisterForm.jsx (MODIFIÉ)
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── loan/
│   │   │   │   ├── LoanSimulator.jsx (ENRICHI)
│   │   │   │   ├── LoanForm.jsx (NOUVEAU)
│   │   │   │   ├── AmortizationTable.jsx (ENRICHI)
│   │   │   │   ├── LoanComparator.jsx (NOUVEAU)
│   │   │   │   ├── CapacityCalculator.jsx (NOUVEAU)
│   │   │   │   └── LoanProgress.jsx (NOUVEAU)
│   │   │   ├── partners/
│   │   │   │   ├── PartnerCard.jsx (NOUVEAU)
│   │   │   │   ├── PartnerGrid.jsx (NOUVEAU)
│   │   │   │   └── Certifications.jsx (NOUVEAU)
│   │   │   ├── reviews/
│   │   │   │   ├── ReviewCard.jsx (NOUVEAU)
│   │   │   │   ├── ReviewList.jsx (MODIFIÉ)
│   │   │   │   ├── ReviewForm.jsx (MODIFIÉ)
│   │   │   │   ├── RatingStars.jsx
│   │   │   │   └── ReviewFilters.jsx (NOUVEAU)
│   │   │   ├── contact/
│   │   │   │   ├── ContactForm.jsx
│   │   │   │   ├── OpeningHours.jsx (ENRICHI)
│   │   │   │   ├── GoogleMap.jsx (NOUVEAU)
│   │   │   │   └── LiveStatus.jsx (NOUVEAU)
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.jsx (NOUVEAU)
│   │   │   │   ├── KeyNumbers.jsx (NOUVEAU)
│   │   │   │   ├── HowItWorks.jsx (NOUVEAU)
│   │   │   │   ├── PartnersSection.jsx (NOUVEAU)
│   │   │   │   └── TestimonialsSection.jsx (NOUVEAU)
│   │   │   ├── dashboard/
│   │   │   │   ├── UserDashboard.jsx (NOUVEAU)
│   │   │   │   ├── LoanHistory.jsx (NOUVEAU)
│   │   │   │   ├── DocumentUpload.jsx (NOUVEAU)
│   │   │   │   ├── CreditScoreWidget.jsx (NOUVEAU)
│   │   │   │   └── NotificationCenter.jsx (NOUVEAU)
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx (ENRICHI)
│   │   │   │   ├── LoanManager.jsx (NOUVEAU)
│   │   │   │   ├── UserManager.jsx
│   │   │   │   ├── ReviewModeration.jsx (MODIFIÉ)
│   │   │   │   ├── PartnerManager.jsx (NOUVEAU)
│   │   │   │   ├── Statistics.jsx (ENRICHI)
│   │   │   │   └── HoursManager.jsx (NOUVEAU)
│   │   │   └── legal/
│   │   │       ├── CookieBanner.jsx (NOUVEAU)
│   │   │       ├── PrivacyPolicy.jsx (NOUVEAU)
│   │   │       └── TermsConditions.jsx (NOUVEAU)
│   │   ├── pages/
│   │   │   ├── Home.jsx (REFAIT)
│   │   │   ├── Login.jsx (MODIFIÉ)
│   │   │   ├── Register.jsx (MODIFIÉ)
│   │   │   ├── LoanSimulator.jsx (ENRICHI)
│   │   │   ├── Partners.jsx (NOUVEAU)
│   │   │   ├── About.jsx (NOUVEAU)
│   │   │   ├── Reviews.jsx (NOUVEAU)
│   │   │   ├── Contact.jsx (MODIFIÉ)
│   │   │   ├── Profile.jsx (ENRICHI)
│   │   │   ├── Dashboard.jsx (NOUVEAU)
│   │   │   ├── Admin.jsx (ENRICHI)
│   │   │   ├── FAQ.jsx (NOUVEAU)
│   │   │   ├── HowItWorks.jsx (NOUVEAU)
│   │   │   ├── Legal.jsx (NOUVEAU)
│   │   │   └── NotFound.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── NotificationContext.jsx (NOUVEAU)
│   │   │   └── ThemeContext.jsx (NOUVEAU)
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useLoan.js (NOUVEAU)
│   │   │   ├── useNotifications.js (NOUVEAU)
│   │   │   └── useApi.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── loanService.js (NOUVEAU)
│   │   │   ├── partnerService.js (NOUVEAU)
│   │   │   ├── documentService.js (NOUVEAU)
│   │   │   └── notificationService.js (NOUVEAU)
│   │   ├── utils/
│   │   │   ├── constants.js (MODIFIÉ)
│   │   │   ├── loanCalculations.js (NOUVEAU)
│   │   │   ├── formatters.js (NOUVEAU)
│   │   │   ├── validators.js
│   │   │   └── translations.js (NOUVEAU)
│   │   ├── styles/
│   │   │   ├── global.css (REFAIT)
│   │   │   ├── variables.css (NOUVEAU)
│   │   │   ├── animations.css (NOUVEAU)
│   │   │   └── themes/
│   │   │       ├── light.css (NOUVEAU)
│   │   │       └── dark.css (NOUVEAU)
│   │   ├── App.jsx (MODIFIÉ)
│   │   ├── index.jsx
│   │   └── routes.jsx (MODIFIÉ)
│   ├── package.json (MODIFIÉ)
│   └── .env.example
│
├── database/
│   ├── migrations/
│   │   ├── 001_cleanup_old_tables.sql (NOUVEAU)
│   │   ├── 002_create_new_schema.sql (NOUVEAU)
│   │   └── 003_seed_initial_data.sql (NOUVEAU)
│   └── schema-financial.sql (NOUVEAU)
│
├── docs/
│   ├── REFACTORING_PLAN.md (CE FICHIER)
│   ├── API_DOCUMENTATION.md (MODIFIÉ)
│   ├── USER_GUIDE_DE.md (NOUVEAU)
│   ├── ADMIN_GUIDE_DE.md (NOUVEAU)
│   └── DEPLOYMENT_GUIDE.md
│
├── .gitignore
├── README.md (MODIFIÉ)
└── docker-compose.yml
```

---

## 🗄️ Nouveau Schéma de Base de Données

### Tables à SUPPRIMER
```sql
-- Tables e-commerce à supprimer
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS furniture CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS financial_offers CASCADE;
```

### Tables à CONSERVER (avec modifications)
- `users` - Ajouter champs: `phone_verified`, `credit_score`, `monthly_income`, `monthly_expenses`
- `comments` - Modifier pour avis généraux (pas liés aux produits)
- `opening_hours` - Conserver tel quel
- `contact_messages` - Conserver tel quel
- `activity_logs` - Conserver tel quel

### Nouvelles Tables à CRÉER

#### 1. Partners (Partenaires Bancaires)
```sql
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    official_website VARCHAR(500),
    interest_rate_min DECIMAL(5, 2),
    interest_rate_max DECIMAL(5, 2),
    min_loan_amount DECIMAL(10, 2),
    max_loan_amount DECIMAL(10, 2),
    min_duration_months INTEGER,
    max_duration_months INTEGER,
    certifications JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Loan Requests (Demandes de Prêt - Enrichi)
```sql
CREATE TABLE loan_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
    
    -- Informations personnelles
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Détails du prêt
    amount DECIMAL(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL DEFAULT 3.00,
    monthly_payment DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    total_interest DECIMAL(10, 2) NOT NULL,
    
    -- Objet du prêt
    purpose VARCHAR(100) NOT NULL CHECK (purpose IN ('immobilier', 'personnel', 'professionnel', 'autre')),
    purpose_details TEXT,
    
    -- Informations financières
    monthly_income DECIMAL(10, 2),
    monthly_expenses DECIMAL(10, 2),
    employment_status VARCHAR(50),
    
    -- Statut et suivi
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'completed', 'cancelled')),
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- Métadonnées
    ip_address VARCHAR(45),
    user_agent TEXT,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Documents (Documents Utilisateur)
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    loan_request_id UUID REFERENCES loan_requests(id) ON DELETE CASCADE,
    
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'identity_card', 'passport', 'proof_of_income', 
        'bank_statement', 'tax_return', 'employment_contract', 'other'
    )),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    rejection_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Credit Scores (Scores de Crédit)
```sql
CREATE TABLE credit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    score INTEGER CHECK (score >= 300 AND score <= 850),
    score_category VARCHAR(20) CHECK (score_category IN ('poor', 'fair', 'good', 'very_good', 'excellent')),
    
    -- Facteurs
    payment_history_score INTEGER,
    credit_utilization_score INTEGER,
    credit_history_length_score INTEGER,
    credit_mix_score INTEGER,
    
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_update_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Loan Comparisons (Comparaisons de Prêts)
```sql
CREATE TABLE loan_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    amount DECIMAL(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL,
    
    comparison_data JSONB NOT NULL, -- Stocke les résultats de plusieurs banques
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. FAQs (Questions Fréquentes)
```sql
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    category VARCHAR(100) NOT NULL,
    question_de TEXT NOT NULL,
    answer_de TEXT NOT NULL,
    
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Notifications (Notifications Utilisateur)
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'loan_status_change', 'document_verified', 'document_rejected',
        'new_message', 'reminder', 'promotion', 'system'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    action_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. Legal Documents (Documents Légaux)
```sql
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'privacy_policy', 'terms_conditions', 'cookie_policy', 'impressum'
    )),
    title_de VARCHAR(255) NOT NULL,
    content_de TEXT NOT NULL,
    
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. User Consents (Consentements DSGVO)
```sql
CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN (
        'privacy_policy', 'terms_conditions', 'marketing_emails', 
        'data_processing', 'cookies'
    )),
    
    consented BOOLEAN NOT NULL,
    consent_date TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    
    withdrawn_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 Design System

### Palette de Couleurs
```css
:root {
  /* Couleurs principales */
  --primary-navy: #0A1628;
  --primary-gold: #C9A84C;
  --primary-white: #F8F6F1;
  
  /* Couleurs secondaires */
  --secondary-navy-light: #1A2B45;
  --secondary-navy-dark: #050B14;
  --secondary-gold-light: #D9B85C;
  --secondary-gold-dark: #B9983C;
  
  /* Couleurs d'état */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Nuances de gris */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Ombres */
  --shadow-sm: 0 1px 2px 0 rgba(10, 22, 40, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(10, 22, 40, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(10, 22, 40, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(10, 22, 40, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(10, 22, 40, 0.25);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

### Typographie
```css
/* Polices */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Tailles de police */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  
  /* Poids de police */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Composants de Base

#### Boutons
```css
/* Bouton primaire (Or) */
.btn-primary {
  background: var(--primary-gold);
  color: var(--primary-navy);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: var(--font-semibold);
  transition: var(--transition-base);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: var(--secondary-gold-light);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Bouton secondaire (Navy) */
.btn-secondary {
  background: var(--primary-navy);
  color: var(--primary-white);
  border: 2px solid var(--primary-gold);
}

/* Bouton WhatsApp */
.btn-whatsapp {
  background: #25D366;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
```

#### Cartes
```css
.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.card-premium {
  border: 2px solid var(--primary-gold);
  background: linear-gradient(135deg, var(--primary-white) 0%, #FFF9E6 100%);
}
```

---

## 📱 Pages Détaillées

### 1. Page d'Accueil (Startseite)

#### Sections
1. **Hero Section**
   - Titre accrocheur: "Ihr zuverlässiger Finanzpartner in Österreich"
   - Sous-titre: "Schnelle Kredite mit fairen Konditionen von österreichischen Partnerbanken"
   - CTA principal: "Jetzt Kredit berechnen"
   - Image de fond: Bureau moderne/Famille heureuse
   - Badges de confiance: SSL, Banques certifiées, Réponse 24h

2. **Chiffres Clés (Key Numbers)**
   ```
   [3%]              [24h]              [15+]              [98%]
   Zinssatz      Antwortzeit    Partnerbanken    Zufriedenheit
   ```

3. **Comment ça fonctionne (Wie es funktioniert)**
   - Étape 1: Kreditrechner nutzen
   - Étape 2: Antrag einreichen
   - Étape 3: Schnelle Prüfung
   - Étape 4: Geld erhalten

4. **Nos Partenaires (Unsere Partner)**
   - Logos des banques autrichiennes
   - Lien vers page détaillée

5. **Avis Clients (Kundenbewertungen)**
   - Top 3 avis avec étoiles
   - Note moyenne globale
   - Lien "Alle Bewertungen ansehen"

6. **Call-to-Action Final**
   - "Bereit für Ihren Kredit?"
   - Bouton WhatsApp + Bouton Simulateur

### 2. Simulateur de Prêt (Kreditrechner)

#### Formulaire
```javascript
{
  fullName: string,          // Vollständiger Name
  email: string,             // E-Mail-Adresse
  phone: string,             // Telefonnummer
  amount: number,            // Gewünschter Betrag (€)
  duration: number,          // Laufzeit (Monate)
  interestRate: 3,           // Zinssatz (fixe à 3%)
  purpose: enum,             // Zweck des Kredits
  monthlyIncome: number,     // Monatliches Einkommen (optionnel)
  monthlyExpenses: number    // Monatliche Ausgaben (optionnel)
}
```

#### Calcul Automatique
```javascript
// Formule de mensualité
M = (P × r/12) / (1 - (1 + r/12)^(-n))

Où:
- M = Mensualité
- P = Capital (amount)
- r = Taux annuel (0.03)
- n = Durée en mois
```

#### Tableau d'Amortissement
- Mois par mois
- Capital restant
- Intérêts payés
- Capital remboursé
- Export PDF

#### Message WhatsApp Pré-rempli
```
Guten Tag,

ich heiße [Nom] und möchte einen Kredit beantragen.

Kreditdetails:
• Betrag: [Montant]€
• Laufzeit: [Durée] Monate
• Monatliche Rate: [Mensualité]€
• Zinssatz: 3%
• Zweck: [Objet du prêt]

Kontaktdaten:
• E-Mail: [Email]
• Telefon: [Téléphone]

Vielen Dank!
```

### 3. Page Nos Partenaires (Unsere Partner)

#### Structure
- Introduction: "Vertrauenswürdige österreichische Banken"
- Grille de partenaires (3 colonnes)
- Pour chaque banque:
  - Logo
  - Nom
  - Description
  - Taux d'intérêt: Min - Max
  - Montants: Min - Max
  - Durées: Min - Max mois
  - Lien site officiel
  - Certifications

#### Section "Pourquoi nos partenaires?"
- Régulés par FMA (Finanzmarktaufsicht)
- Licences bancaires autrichiennes
- Transparence totale
- Service client en allemand

### 4. Page À Propos (Über uns)

#### Sections
1. **Notre Mission**
   - Faciliter l'accès au crédit
   - Partenariats de confiance
   - Service personnalisé

2. **Nos Valeurs**
   - Transparenz (Transparence)
   - Vertrauen (Confiance)
   - Schnelligkeit (Rapidité)
   - Fairness (Équité)

3. **Notre Expertise**
   - X années d'expérience
   - X clients satisfaits
   - X millions € financés

4. **Notre Équipe** (photos à venir)
   - Cartes d'équipe avec noms et rôles

5. **Nos Partenariats**
   - Logos banques
   - Certifications

### 5. Page Avis Clients (Kundenbewertungen)

#### Fonctionnalités
- **Filtres**:
  - Toutes les notes
  - 5 étoiles
  - 4 étoiles
  - 3 étoiles
  - 2 étoiles
  - 1 étoile

- **Tri**:
  - Plus récents
  - Plus anciens
  - Note la plus élevée
  - Note la plus basse

- **Affichage**:
  - Note moyenne globale (grand)
  - Nombre total d'avis
  - Distribution des notes (graphique)
  - Liste des avis avec:
    - Nom utilisateur
    - Note (étoiles)
    - Date
    - Commentaire
    - Bouton "Hilfreich" (si connecté)

- **Formulaire** (utilisateurs connectés uniquement):
  - Sélection note (1-5 étoiles)
  - Zone de texte commentaire
  - Bouton "Bewertung abgeben"

### 6. Page Contact (Öffnungszeiten & Kontakt)

#### Sections
1. **Horaires d'Ouverture**
   ```
   Montag:     09:00 - 18:00
   Dienstag:   09:00 - 18:00
   Mittwoch:   09:00 - 18:00
   Donnerstag: 09:00 - 18:00
   Freitag:    09:00 - 17:00
   Samstag:    10:00 - 14:00
   Sonntag:    Geschlossen
   ```
   - Indicateur temps réel: "Jetzt geöffnet" / "Geschlossen"
   - Prochaine ouverture si fermé

2. **Coordonnées**
   - Adresse physique
   - Téléphone (cliquable)
   - Email (cliquable)
   - WhatsApp (bouton)

3. **Google Maps**
   - Carte intégrée avec marqueur
   - Bouton "Routenplaner"

4. **Formulaire de Contact**
   - Nom
   - Email
   - Objet
   - Message
   - Bouton "Nachricht senden"
   - Note: "Wir antworten innerhalb von 24 Stunden"

### 7. Dashboard Utilisateur

#### Sections
1. **Vue d'ensemble**
   - Nombre de demandes
   - Demandes en cours
   - Demandes approuvées
   - Score de crédit estimé

2. **Mes Demandes de Prêt**
   - Liste avec statut
   - Détails au clic
   - Timeline de progression

3. **Mes Documents**
   - Documents uploadés
   - Statut de vérification
   - Upload de nouveaux documents

4. **Mon Score de Crédit**
   - Score actuel
   - Catégorie (Excellent, Très bon, Bon, Moyen, Faible)
   - Facteurs influençant
   - Conseils d'amélioration

5. **Notifications**
   - Centre de notifications
   - Marquer comme lu
   - Filtres par type

### 8. Dashboard Admin

#### Sections
1. **Statistiques**
   - Demandes aujourd'hui
   - Demandes en attente
   - Demandes ce mois
   - Montant moyen demandé
   - Taux d'approbation
   - Graphiques

2. **Gestion des Demandes**
   - Liste toutes demandes
   - Filtres: statut, date, montant
   - Actions: Approuver, Rejeter, Contacter
   - Voir détails complets
   - Ajouter notes admin

3. **Modération des Avis**
   - Avis en attente
   - Approuver/Rejeter
   - Voir historique

4. **Gestion Utilisateurs**
   - Liste utilisateurs
   - Voir profils
   - Changer rôles
   - Désactiver comptes

5. **Gestion Partenaires**
   - Ajouter/Modifier/Supprimer banques
   - Upload logos
   - Modifier taux et conditions

6. **Gestion Horaires**
   - Modifier horaires par jour
   - Jours fériés
   - Fermetures exceptionnelles

7. **Paramètres**
   - Taux d'intérêt global
   - Montants min/max
   - Durées min/max
   - Emails de notification

---

## 🔧 Fonctionnalités Avancées

### 1. Comparateur de Prêts
- Comparer jusqu'à 3 offres simultanément
- Tableau comparatif:
  - Banque
  - Taux
  - Mensualité
  - Coût total
  - Durée
  - Conditions
- Bouton "Choisir cette offre"

### 2. Calculateur de Capacité d'Emprunt
```javascript
Capacité = (Revenus mensuels - Charges mensuelles) × 0.33 × Durée
```
- Formulaire:
  - Revenus mensuels nets
  - Charges mensuelles
  - Durée souhaitée
- Résultat: Montant maximum empruntable

### 3. Sauvegarde Automatique
- LocalStorage pour formulaires
- Récupération automatique au retour
- Message: "Formulaire récupéré"

### 4. Notifications Push
- Changement statut demande
- Document vérifié/rejeté
- Nouveau message admin
- Rappels documents manquants

### 5. Chat Support (Heures d'ouverture)
- Widget en bas à droite
- Connexion WebSocket
- Messages en temps réel
- Historique conversations

### 6. FAQ Interactive
- Recherche dans FAQ
- Catégories:
  - Allgemeine Fragen
  - Kreditbedingungen
  - Antragsprozess
  - Rückzahlung
  - Sicherheit
- Accordéon pour réponses
- Compteur de vues

---

## 🔒 Sécurité et Conformité

### DSGVO/GDPR
1. **Bannière Cookies**
   - Apparaît à la première visite
   - Options: Accepter tout / Personnaliser / Refuser
   - Stockage du consentement

2. **Politique de Confidentialité**
   - Données collectées
   - Utilisation des données
   - Droits des utilisateurs
   - Contact DPO

3. **Conditions Générales**
   - Conditions d'utilisation
   - Conditions de prêt
   - Responsabilités

4. **Impressum** (Obligatoire en Autriche)
   - Nom de l'entreprise
   - Adresse
   - Numéro d'enregistrement
   - Contact

5. **Droits Utilisateurs**
   - Accès aux données
   - Rectification
   - Suppression
   - Portabilité
   - Opposition

### Sécurité Technique
- HTTPS obligatoire
- Headers de sécurité (Helmet.js)
- Rate limiting
- Validation inputs
- Sanitization
- CSRF protection
- XSS protection
- SQL injection prevention
- Chiffrement mots de passe (bcrypt)
- JWT sécurisés
- Upload fichiers sécurisé

---

## 📧 Système de Notifications

### Types d'Emails
1. **Bienvenue** (Inscription)
2. **Confirmation Email**
3. **Réinitialisation Mot de Passe**
4. **Nouvelle Demande** (Admin)
5. **Changement Statut Demande** (Utilisateur)
6. **Document Vérifié/Rejeté**
7. **Rappel Documents Manquants**
8. **Demande Approuvée**
9. **Demande Rejetée**

### Templates Email (Allemand)
- Design professionnel
- Logo FinanzPlus
- Couleurs de marque
- Boutons CTA
- Footer avec liens

---

## 🌐 Intégrations Externes

### 1. WhatsApp Business API
```javascript
const whatsappMessage = `Guten Tag,

ich heiße ${fullName} und möchte einen Kredit beantragen.

Kreditdetails:
• Betrag: ${amount}€
• Laufzeit: ${duration} Monate
• Monatliche Rate: ${monthlyPayment}€
• Zinssatz: 3%
• Zweck: ${purpose}

Kontaktdaten:
• E-Mail: ${email}
• Telefon: ${phone}

Vielen Dank!`;

const whatsappUrl = `https://wa.me/447451267912?text=${encodeURIComponent(whatsappMessage)}`;
```

### 2. Google Maps
```javascript
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  width="100%"
  height="450"
  style="border:0;"
  allowfullscreen=""
  loading="lazy"
></iframe>
```

### 3. Email Service (Nodemailer)
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### 4. PDF Generation (PDFKit)
- Tableau d'amortissement
- Contrats
- Factures
- Attestations

---

## 📊 Analytics et Tracking

### Métriques à Suivre
1. **Conversions**
   - Visiteurs → Inscriptions
   - Inscriptions → Demandes
   - Demandes → Approbations

2. **Engagement**
   - Temps sur site
   - Pages vues
   - Taux de rebond
   - Pages populaires

3. **Simulateur**
   - Utilisations
   - Montants moyens
   - Durées populaires

4. **Demandes**
   - Nombre par jour/semaine/mois
   - Montant moyen
   - Taux d'approbation
   - Temps de traitement

---

## 🚀 Plan de Migration

### Phase 1: Préparation (Jours 1-2)
- [x] Créer ce document de planification
- [ ] Backup complet de la base de données
- [ ] Créer branche Git `refactor/financial-platform`
- [ ] Documenter l'état actuel

### Phase 2: Base de Données (Jours 3-4)
- [ ] Créer script de migration
- [ ] Supprimer anciennes tables
- [ ] Créer nouvelles tables
- [ ] Migrer données utilisateurs
- [ ] Tester intégrité

### Phase 3: Backend (Jours 5-8)
- [ ] Supprimer anciens contrôleurs/routes
- [ ] Créer nouveaux modèles
- [ ] Créer nouveaux contrôleurs
- [ ] Créer nouvelles routes
- [ ] Implémenter services (email, WhatsApp, PDF)
- [ ] Tests API

### Phase 4: Design System (Jours 9-10)
- [ ] Créer variables CSS
- [ ] Créer composants de base
- [ ] Créer thème clair/sombre
- [ ] Créer animations

### Phase 5: Frontend - Pages Principales (Jours 11-15)
- [ ] Page d'accueil
- [ ] Simulateur de prêt
- [ ] Page partenaires
- [ ] Page à propos
- [ ] Page avis clients
- [ ] Page contact

### Phase 6: Frontend - Authentification (Jours 16-17)
- [ ] Page connexion
- [ ] Page inscription
- [ ] Récupération mot de passe
- [ ] Intégration JWT

### Phase 7: Frontend - Dashboards (Jours 18-21)
- [ ] Dashboard utilisateur
- [ ] Dashboard admin
- [ ] Gestion demandes
- [ ] Upload documents
- [ ] Notifications

### Phase 8: Fonctionnalités Avancées (Jours 22-25)
- [ ] Comparateur de prêts
- [ ] Calculateur capacité
- [ ] Chat support
- [ ] FAQ interactive
- [ ] Export PDF

### Phase 9: Sécurité et Conformité (Jours 26-28)
- [ ] Bannière cookies
- [ ] Pages légales
- [ ] Consentements DSGVO
- [ ] Tests sécurité

### Phase 10: Intégrations (Jours 29-30)
- [ ] WhatsApp
- [ ] Google Maps
- [ ] Email service
- [ ] PDF generation

### Phase 11: Traduction (Jours 31-32)
- [ ] Tous les textes en allemand
- [ ] Messages d'erreur
- [ ] Emails
- [ ] Documentation

### Phase 12: Tests et Optimisation (Jours 33-35)
- [ ] Tests fonctionnels
- [ ] Tests responsive
- [ ] Tests performance
- [ ] Tests accessibilité
