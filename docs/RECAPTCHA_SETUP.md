# 🔐 CONFIGURATION GOOGLE reCAPTCHA v3 - FINANZPLUS AUSTRIA

## 📋 Vue d'ensemble

Google reCAPTCHA v3 est intégré pour protéger les formulaires contre les bots et les abus automatisés. Cette version fonctionne de manière invisible et attribue un score de confiance à chaque interaction.

---

## 🎯 Étape 1 : Obtenir les clés API Google reCAPTCHA

### 1.1 Accéder à la console Google reCAPTCHA

1. Visitez : https://www.google.com/recaptcha/admin
2. Connectez-vous avec votre compte Google
3. Cliquez sur le bouton **"+"** pour créer un nouveau site

### 1.2 Configuration du site

Remplissez le formulaire avec les informations suivantes :

**Label (Nom du site)**
```
FinanzPlus Austria - Production
```

**Type de reCAPTCHA**
- ✅ Sélectionnez **"reCAPTCHA v3"**
- ❌ Ne pas utiliser v2 (avec case à cocher)

**Domaines**
```
finanzplusaustria.com
www.finanzplusaustria.com
localhost (pour le développement)
```

**Propriétaires**
- Ajoutez les adresses email des administrateurs

**Accepter les conditions d'utilisation**
- ✅ Cochez la case

**Alertes**
- ✅ Activez les alertes pour être notifié des problèmes

### 1.3 Récupérer les clés

Après la création, vous obtiendrez :

1. **Site Key (Clé publique)** - À utiliser dans le frontend
   - Format : `6Lc...AAAAAAA...`
   - Visible publiquement dans le code HTML

2. **Secret Key (Clé secrète)** - À utiliser dans le backend
   - Format : `6Lc...AAAAAAA...`
   - ⚠️ **NE JAMAIS exposer cette clé publiquement**

---

## 🔧 Étape 2 : Configuration Backend

### 2.1 Ajouter les clés dans `.env`

Ouvrez le fichier `backend/.env` et ajoutez :

```env
# Google reCAPTCHA v3
RECAPTCHA_SECRET_KEY=votre_secret_key_ici
RECAPTCHA_SITE_KEY=votre_site_key_ici
RECAPTCHA_MIN_SCORE=0.5
```

**Explication des variables :**
- `RECAPTCHA_SECRET_KEY` : Clé secrète pour vérifier les tokens côté serveur
- `RECAPTCHA_SITE_KEY` : Clé publique (optionnelle côté backend, surtout pour référence)
- `RECAPTCHA_MIN_SCORE` : Score minimum accepté (0.0 à 1.0)
  - 0.0 = Bot probable
  - 0.5 = Score recommandé (équilibre sécurité/UX)
  - 1.0 = Humain très probable

### 2.2 Installer la dépendance de vérification

```bash
cd backend
npm install axios
```

### 2.3 Créer le middleware de vérification reCAPTCHA

Le fichier `backend/src/middleware/recaptchaVerify.js` sera créé automatiquement.

---

## 🎨 Étape 3 : Configuration Frontend

### 3.1 Ajouter les clés dans `.env`

Ouvrez le fichier `frontend/.env` et ajoutez :

```env
# Google reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=votre_site_key_ici
```

### 3.2 Charger le script reCAPTCHA

Le script sera chargé automatiquement dans `index.html` :

```html
<script src="https://www.google.com/recaptcha/api.js?render=VOTRE_SITE_KEY"></script>
```

---

## 📊 Étape 4 : Seuils de score recommandés

### Interprétation des scores

| Score | Interprétation | Action recommandée |
|-------|----------------|-------------------|
| 0.9 - 1.0 | Très probablement humain | ✅ Accepter |
| 0.7 - 0.8 | Probablement humain | ✅ Accepter |
| 0.5 - 0.6 | Neutre | ⚠️ Accepter avec surveillance |
| 0.3 - 0.4 | Suspect | ⚠️ Challenge supplémentaire |
| 0.0 - 0.2 | Très probablement bot | ❌ Rejeter |

### Configuration par type de formulaire

**Formulaire de contact** (moins strict)
```env
RECAPTCHA_MIN_SCORE=0.4
```

**Connexion/Inscription** (équilibré)
```env
RECAPTCHA_MIN_SCORE=0.5
```

**Transactions financières** (strict)
```env
RECAPTCHA_MIN_SCORE=0.7
```

---

## 🧪 Étape 5 : Test en développement

### 5.1 Clés de test Google

Pour le développement local, vous pouvez utiliser les clés de test :

**Site Key (Test)**
```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Secret Key (Test)**
```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

⚠️ **Ces clés acceptent toujours les requêtes avec un score de 1.0**

### 5.2 Tester la vérification

1. Ouvrez la console du navigateur
2. Soumettez un formulaire
3. Vérifiez les logs backend pour voir le score reCAPTCHA

---

## 📈 Étape 6 : Monitoring et Analytics

### 6.1 Console reCAPTCHA

Accédez à : https://www.google.com/recaptcha/admin

**Métriques disponibles :**
- Nombre de requêtes par jour
- Distribution des scores
- Taux de réussite/échec
- Détection d'anomalies

### 6.2 Alertes recommandées

Configurez des alertes pour :
- ✅ Pic soudain de requêtes
- ✅ Augmentation des scores faibles
- ✅ Erreurs de vérification
- ✅ Dépassement de quota

---

## 🔒 Étape 7 : Sécurité et bonnes pratiques

### 7.1 Protection des clés

✅ **À FAIRE :**
- Stocker les clés dans `.env`
- Ajouter `.env` au `.gitignore`
- Utiliser des variables d'environnement sur Vercel
- Régénérer les clés si compromises

❌ **À NE PAS FAIRE :**
- Commiter les clés dans Git
- Exposer la secret key dans le frontend
- Partager les clés publiquement
- Utiliser les mêmes clés en dev et prod

### 7.2 Rotation des clés

Recommandation : Régénérer les clés tous les 6-12 mois

**Procédure :**
1. Créer de nouvelles clés dans la console
2. Mettre à jour les variables d'environnement
3. Déployer les changements
4. Supprimer les anciennes clés après 24h

---

## 🚀 Étape 8 : Déploiement sur Vercel

### 8.1 Ajouter les variables d'environnement

1. Accédez à votre projet sur Vercel
2. Allez dans **Settings** → **Environment Variables**
3. Ajoutez les variables :

**Backend :**
```
RECAPTCHA_SECRET_KEY = votre_secret_key
RECAPTCHA_MIN_SCORE = 0.5
```

**Frontend :**
```
VITE_RECAPTCHA_SITE_KEY = votre_site_key
```

### 8.2 Redéployer

```bash
git push origin main
```

Vercel redéploiera automatiquement avec les nouvelles variables.

---

## 📞 Support et ressources

### Documentation officielle
- Guide reCAPTCHA v3 : https://developers.google.com/recaptcha/docs/v3
- FAQ : https://developers.google.com/recaptcha/docs/faq
- Console Admin : https://www.google.com/recaptcha/admin

### Limites et quotas
- **Gratuit** : 1 million de requêtes/mois
- **Au-delà** : Contactez Google pour un plan entreprise

### Dépannage

**Erreur : "Invalid site key"**
- Vérifiez que la site key est correcte
- Vérifiez que le domaine est autorisé

**Erreur : "Invalid secret key"**
- Vérifiez la secret key dans `.env`
- Assurez-vous qu'elle n'a pas d'espaces

**Score toujours à 0.0**
- Vérifiez que le script reCAPTCHA est chargé
- Vérifiez la console pour les erreurs JavaScript

---

## ✅ Checklist de configuration

- [ ] Créer un compte reCAPTCHA v3
- [ ] Obtenir les clés (site key + secret key)
- [ ] Ajouter les clés dans `backend/.env`
- [ ] Ajouter la site key dans `frontend/.env`
- [ ] Tester en local
- [ ] Configurer les variables sur Vercel
- [ ] Déployer et tester en production
- [ ] Configurer les alertes dans la console Google
- [ ] Documenter les clés dans un gestionnaire de mots de passe

---

**Made with ❤️ by Bob for FinanzPlus Austria**