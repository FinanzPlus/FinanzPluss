# FinanzPlus Austria - Structure du Projet

## Nom de l'Institut
**FinanzPlus Austria** - Votre partenaire financier de confiance

## Contact
- WhatsApp: +447451267912
- Email: (à fournir)

## Architecture du Projet

```
finanzplus-austria/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   └── email.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Car.js
│   │   │   ├── Furniture.js
│   │   │   ├── FinancialOffer.js
│   │   │   ├── Order.js
│   │   │   ├── Favorite.js
│   │   │   ├── LoanRequest.js
│   │   │   ├── Comment.js
│   │   │   ├── OpeningHours.js
│   │   │   ├── Promotion.js
│   │   │   └── Newsletter.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── carController.js
│   │   │   ├── furnitureController.js
│   │   │   ├── financialController.js
│   │   │   ├── orderController.js
│   │   │   ├── commentController.js
│   │   │   ├── contactController.js
│   │   │   ├── adminController.js
│   │   │   └── paymentController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── cars.js
│   │   │   ├── furniture.js
│   │   │   ├── financial.js
│   │   │   ├── orders.js
│   │   │   ├── comments.js
│   │   │   ├── contact.js
│   │   │   ├── admin.js
│   │   │   └── payment.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── rateLimiter.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── emailService.js
│   │   │   ├── pdfGenerator.js
│   │   │   ├── imageUpload.js
│   │   │   └── helpers.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   │       ├── logos/
│   │       └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   └── ProductComparator.jsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   └── Checkout.jsx
│   │   │   ├── financial/
│   │   │   │   ├── LoanSimulator.jsx
│   │   │   │   ├── AmortizationTable.jsx
│   │   │   │   └── BankPartners.jsx
│   │   │   ├── comments/
│   │   │   │   ├── CommentForm.jsx
│   │   │   │   ├── CommentList.jsx
│   │   │   │   └── RatingStars.jsx
│   │   │   ├── contact/
│   │   │   │   ├── ContactForm.jsx
│   │   │   │   ├── OpeningHours.jsx
│   │   │   │   └── GoogleMap.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ProductManager.jsx
│   │   │       ├── OrderManager.jsx
│   │   │       ├── UserManager.jsx
│   │   │       ├── CommentModeration.jsx
│   │   │       └── Statistics.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cars.jsx
│   │   │   ├── Furniture.jsx
│   │   │   ├── FinancialOffers.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Comments.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useApi.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   └── paymentService.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── variables.css
│   │   │   └── components/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── routes.jsx
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_products.sql
│   │   ├── 003_create_cars.sql
│   │   ├── 004_create_furniture.sql
│   │   ├── 005_create_financial_offers.sql
│   │   ├── 006_create_orders.sql
│   │   ├── 007_create_favorites.sql
│   │   ├── 008_create_loan_requests.sql
│   │   ├── 009_create_comments.sql
│   │   ├── 010_create_opening_hours.sql
│   │   ├── 011_create_promotions.sql
│   │   └── 012_create_newsletter.sql
│   ├── seeds/
│   │   ├── users.sql
│   │   ├── products.sql
│   │   └── opening_hours.sql
│   └── schema.sql
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT.md
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

## Technologies Utilisées

### Backend
- Node.js v18+
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- nodemailer
- multer (upload images)
- express-rate-limit
- helmet (sécurité)
- cors
- dotenv
- stripe/paypal SDK

### Frontend
- React 18+
- React Router v6
- Axios
- Context API
- CSS Modules / Styled Components
- React Hook Form
- Chart.js (statistiques admin)
- React Icons
- date-fns

### Base de données
- PostgreSQL 14+
- pg (node-postgres)

## Fonctionnalités Principales

### Authentification & Sécurité
- ✅ Inscription/Connexion avec JWT
- ✅ Validation email avec code
- ✅ Récupération mot de passe
- ✅ Protection CSRF
- ✅ Rate limiting
- ✅ Hashage bcrypt

### Produits
- ✅ Catalogue voitures (filtres avancés)
- ✅ Catalogue meubles (filtres avancés)
- ✅ Recherche avec autocomplete
- ✅ Comparateur de produits
- ✅ Système de favoris
- ✅ Badges (Nouveau, Populaire, Promo)

### Offres Financières
- ✅ Simulateur de prêt interactif
- ✅ Taux fixe 3%
- ✅ Tableau d'amortissement
- ✅ Partenaires bancaires autrichiens
- ✅ Redirection WhatsApp

### Commerce
- ✅ Panier d'achat
- ✅ Système de commandes
- ✅ Paiement Stripe/PayPal
- ✅ Paiement en plusieurs fois
- ✅ Factures PDF
- ✅ Codes promo
- ✅ Réservation voitures

### Avis & Commentaires
- ✅ Système de notation (1-5 étoiles)
- ✅ Commentaires par produit
- ✅ Modération admin
- ✅ Like sur commentaires
- ✅ Top 3 avis sur accueil

### Contact & Support
- ✅ Horaires d'ouverture
- ✅ Indicateur Ouvert/Fermé
- ✅ Carte Google Maps
- ✅ Formulaire de contact
- ✅ WhatsApp direct
- ✅ Email
- ✅ Newsletter

### Administration
- ✅ Dashboard avec statistiques
- ✅ Gestion produits (CRUD)
- ✅ Gestion commandes
- ✅ Gestion utilisateurs
- ✅ Modération commentaires
- ✅ Export données (CSV)
- ✅ Logs d'activité

### SEO & Analytics
- ✅ Meta tags optimisés
- ✅ URLs friendly
- ✅ Sitemap XML
- ✅ Google Analytics

## Langue
🇩🇪 **Allemand (Deutsch)** - Tout le site

## Design
- Moderne et professionnel
- Responsive (mobile-first)
- Couleurs: Noir, Gris, Rouge/Or
- Navigation intuitive
- Footer complet

## Prochaines Étapes
1. Configuration initiale du projet
2. Setup base de données PostgreSQL
3. Développement backend (API REST)
4. Développement frontend (React)
5. Intégration et tests
6. Déploiement