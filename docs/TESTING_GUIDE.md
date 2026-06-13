# Guide de Tests - FinanzPlus Austria

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Tests Backend](#tests-backend)
3. [Tests Frontend](#tests-frontend)
4. [Tests d'intégration](#tests-dintégration)
5. [Tests de performance](#tests-de-performance)
6. [Tests de sécurité](#tests-de-sécurité)
7. [Checklist de tests](#checklist-de-tests)

---

## Vue d'ensemble

### Objectifs des tests

- Garantir la fiabilité du système
- Détecter les bugs avant la production
- Valider les fonctionnalités critiques
- Assurer la sécurité des données
- Vérifier les performances

### Types de tests

1. **Tests unitaires**: Fonctions individuelles
2. **Tests d'intégration**: Interaction entre composants
3. **Tests end-to-end**: Parcours utilisateur complets
4. **Tests de performance**: Charge et vitesse
5. **Tests de sécurité**: Vulnérabilités

---

## Tests Backend

### Configuration

```bash
cd backend
npm install --save-dev jest supertest
```

Créer `backend/jest.config.js` :

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js'
  ]
};
```

### Tests des modèles

**backend/src/models/__tests__/User.test.js** :

```javascript
const User = require('../User');
const pool = require('../../config/database');

describe('User Model', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Test123!',
      first_name: 'Test',
      last_name: 'User'
    };

    const user = await User.create(userData);
    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });

  test('should find user by email', async () => {
    const user = await User.findByEmail('test@example.com');
    expect(user).toBeTruthy();
    expect(user.email).toBe('test@example.com');
  });

  test('should verify password correctly', async () => {
    const user = await User.findByEmail('test@example.com');
    const isValid = await User.verifyPassword(user, 'Test123!');
    expect(isValid).toBe(true);
  });
});
```

### Tests des contrôleurs

**backend/src/controllers/__tests__/authController.test.js** :

```javascript
const request = require('supertest');
const app = require('../../server');

describe('Auth Controller', () => {
  test('POST /api/auth/register - should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'Test123!',
        first_name: 'New',
        last_name: 'User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('newuser@example.com');
  });

  test('POST /api/auth/login - should login user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword'
      });

    expect(response.status).toBe(401);
  });
});
```

### Tests des routes protégées

```javascript
describe('Protected Routes', () => {
  let authToken;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!'
      });
    authToken = response.body.token;
  });

  test('GET /api/auth/profile - should get user profile', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email');
  });

  test('GET /api/auth/profile - should reject without token', async () => {
    const response = await request(app)
      .get('/api/auth/profile');

    expect(response.status).toBe(401);
  });
});
```

### Exécution des tests

```bash
# Tous les tests
npm test

# Tests avec couverture
npm test -- --coverage

# Tests en mode watch
npm test -- --watch

# Tests spécifiques
npm test -- User.test.js
```

---

## Tests Frontend

### Configuration

```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
```

Créer `frontend/vitest.config.js` :

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js'
  }
});
```

### Tests des composants

**frontend/src/components/__tests__/Header.test.jsx** :

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Header from '../common/Header';

describe('Header Component', () => {
  test('renders logo and navigation', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/FinanzPlus/i)).toBeInTheDocument();
    expect(screen.getByText(/Autos/i)).toBeInTheDocument();
    expect(screen.getByText(/Möbel/i)).toBeInTheDocument();
  });

  test('shows login button when not authenticated', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Anmelden/i)).toBeInTheDocument();
  });
});
```

### Tests des hooks

**frontend/src/context/__tests__/AuthContext.test.jsx** :

```javascript
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

describe('AuthContext', () => {
  test('should provide auth context', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });

  test('should login user', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'Test123!');
    });

    expect(result.current.user).toBeTruthy();
  });
});
```

### Tests des pages

**frontend/src/pages/__tests__/Login.test.jsx** :

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../Login';

describe('Login Page', () => {
  test('renders login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/E-Mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passwort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Anmelden/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/erforderlich/i)).toBeInTheDocument();
    });
  });
});
```

### Exécution des tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm test -- --watch

# Tests avec UI
npm test -- --ui
```

---

## Tests d'intégration

### Scénarios de test

#### 1. Parcours d'inscription et connexion

```javascript
describe('User Registration and Login Flow', () => {
  test('complete user journey', async () => {
    // 1. Register
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'journey@example.com',
        password: 'Test123!',
        first_name: 'Journey',
        last_name: 'User'
      });
    expect(registerResponse.status).toBe(201);

    // 2. Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'journey@example.com',
        password: 'Test123!'
      });
    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;

    // 3. Access protected route
    const profileResponse = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(profileResponse.status).toBe(200);
  });
});
```

#### 2. Parcours d'achat

```javascript
describe('Shopping Flow', () => {
  let token;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test123!' });
    token = response.body.token;
  });

  test('browse products and add to cart', async () => {
    // 1. Get products
    const productsResponse = await request(app)
      .get('/api/products');
    expect(productsResponse.status).toBe(200);
    expect(productsResponse.body.products.length).toBeGreaterThan(0);

    // 2. Get product detail
    const productId = productsResponse.body.products[0].id;
    const detailResponse = await request(app)
      .get(`/api/products/${productId}`);
    expect(detailResponse.status).toBe(200);

    // 3. Add to cart (frontend only - localStorage)
    // This would be tested in frontend tests
  });
});
```

#### 3. Simulateur de prêt

```javascript
describe('Loan Simulator Flow', () => {
  test('calculate loan and submit request', async () => {
    // 1. Calculate loan
    const calcResponse = await request(app)
      .post('/api/financial/calculate')
      .send({
        amount: 10000,
        duration: 24,
        interest_rate: 3
      });
    expect(calcResponse.status).toBe(200);
    expect(calcResponse.body).toHaveProperty('monthly_payment');
    expect(calcResponse.body).toHaveProperty('schedule');

    // 2. Submit loan request (requires auth)
    const token = 'valid_token_here';
    const requestResponse = await request(app)
      .post('/api/financial/loan-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 10000,
        duration: 24,
        interest_rate: 3,
        monthly_payment: calcResponse.body.monthly_payment,
        purpose: 'car'
      });
    expect(requestResponse.status).toBe(201);
  });
});
```

---

## Tests de performance

### Tests de charge avec Artillery

Installer Artillery :

```bash
npm install -g artillery
```

Créer `tests/load-test.yml` :

```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Browse products"
    flow:
      - get:
          url: "/api/products"
      - think: 2
      - get:
          url: "/api/products/{{ $randomNumber(1, 100) }}"

  - name: "User authentication"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "Test123!"
```

Exécuter :

```bash
artillery run tests/load-test.yml
```

### Métriques à surveiller

- **Temps de réponse**: < 200ms pour 95% des requêtes
- **Throughput**: > 100 req/s
- **Taux d'erreur**: < 1%
- **Utilisation CPU**: < 70%
- **Utilisation mémoire**: < 80%

---

## Tests de sécurité

### 1. Tests d'injection SQL

```javascript
describe('SQL Injection Protection', () => {
  test('should prevent SQL injection in login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "admin' OR '1'='1",
        password: "anything"
      });
    expect(response.status).toBe(401);
  });
});
```

### 2. Tests XSS

```javascript
describe('XSS Protection', () => {
  test('should sanitize user input', async () => {
    const token = 'valid_token';
    const response = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: 1,
        rating: 5,
        comment_text: '<script>alert("XSS")</script>'
      });
    expect(response.status).toBe(201);
    expect(response.body.comment.comment_text).not.toContain('<script>');
  });
});
```

### 3. Tests d'authentification

```javascript
describe('Authentication Security', () => {
  test('should reject weak passwords', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'weak@example.com',
        password: '123',
        first_name: 'Weak',
        last_name: 'Password'
      });
    expect(response.status).toBe(400);
  });

  test('should rate limit login attempts', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong'
        });
    }

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrong'
      });
    expect(response.status).toBe(429); // Too Many Requests
  });
});
```

---

## Checklist de tests

### Tests Backend
- [ ] Modèles de base de données
- [ ] Contrôleurs d'authentification
- [ ] Contrôleurs de produits
- [ ] Contrôleurs financiers
- [ ] Contrôleurs de commentaires
- [ ] Contrôleurs de contact
- [ ] Middleware d'authentification
- [ ] Validation des données
- [ ] Gestion des erreurs

### Tests Frontend
- [ ] Composants Header/Footer
- [ ] Pages d'authentification
- [ ] Pages de catalogue
- [ ] Page de détail produit
- [ ] Panier
- [ ] Simulateur de prêt
- [ ] Formulaires de contact
- [ ] Système de commentaires

### Tests d'intégration
- [ ] Parcours d'inscription/connexion
- [ ] Parcours d'achat complet
- [ ] Soumission de commentaires
- [ ] Demande de crédit
- [ ] Formulaire de contact

### Tests de performance
- [ ] Charge normale (50 users)
- [ ] Charge élevée (100+ users)
- [ ] Temps de réponse API
- [ ] Temps de chargement frontend

### Tests de sécurité
- [ ] Protection SQL injection
- [ ] Protection XSS
- [ ] Protection CSRF
- [ ] Validation JWT
- [ ] Rate limiting
- [ ] Sanitization des entrées

---

## Rapports de tests

### Génération de rapports

```bash
# Backend coverage
cd backend
npm test -- --coverage
# Rapport dans backend/coverage/lcov-report/index.html

# Frontend coverage
cd frontend
npm test -- --coverage
# Rapport dans frontend/coverage/index.html
```

### Métriques de qualité

- **Couverture de code**: > 80%
- **Tests réussis**: 100%
- **Bugs critiques**: 0
- **Vulnérabilités**: 0

---

**Dernière mise à jour**: 12 juin 2026  
**Version**: 1.0.0