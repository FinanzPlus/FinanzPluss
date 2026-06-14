# 📧 Configuration des Emails Automatiques - FinanzPlus Austria

## Vue d'ensemble

Le système d'emails automatiques envoie des confirmations professionnelles aux clients après soumission d'une demande de prêt, ainsi que des notifications à l'équipe interne.

## ✨ Fonctionnalités

### 1. Email de Confirmation Client
- **Déclencheur**: Soumission du formulaire de demande de prêt
- **Destinataire**: Email du client
- **Contenu**:
  - Salutation personnalisée en allemand
  - Tableau élégant avec tous les détails du prêt
  - Informations sur les prochaines étapes
  - Coordonnées de contact (email, téléphone, WhatsApp)
  - Design responsive avec couleurs de la marque (#0A1628, #C9A84C)
  - Footer professionnel avec liens légaux

### 2. Email de Notification Équipe
- **Déclencheur**: Soumission du formulaire de demande de prêt
- **Destinataire**: Email administrateur (ADMIN_EMAIL)
- **Contenu**:
  - Alerte urgente (traitement sous 24h)
  - Informations complètes du client
  - Détails du prêt demandé
  - Date et heure de soumission

## 🔧 Configuration SMTP

### Option 1: Gmail (Recommandé pour développement)

1. **Activer l'authentification à 2 facteurs** sur votre compte Gmail

2. **Créer un mot de passe d'application**:
   - Allez sur https://myaccount.google.com/security
   - Cliquez sur "Mots de passe des applications"
   - Sélectionnez "Autre" et nommez-le "FinanzPlus Austria"
   - Copiez le mot de passe généré (16 caractères)

3. **Configurer le .env**:
```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # Mot de passe d'application
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at
```

### Option 2: SendGrid (Recommandé pour production)

1. **Créer un compte SendGrid**:
   - Allez sur https://sendgrid.com
   - Créez un compte gratuit (100 emails/jour)

2. **Créer une clé API**:
   - Settings → API Keys → Create API Key
   - Donnez-lui un nom et les permissions "Full Access"
   - Copiez la clé API

3. **Configurer le .env**:
```env
# Email Configuration (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Votre clé API
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at
```

### Option 3: Mailgun

```env
# Email Configuration (Mailgun)
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASS=votre_mot_de_passe_mailgun
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at
```

### Option 4: AWS SES

```env
# Email Configuration (AWS SES)
SMTP_HOST=email-smtp.eu-central-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=votre_access_key_id
SMTP_PASS=votre_secret_access_key
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at
```

## 📝 Variables d'Environnement Requises

```env
# Configuration Email (OBLIGATOIRE)
SMTP_HOST=smtp.gmail.com          # Serveur SMTP
SMTP_PORT=587                     # Port SMTP (587 ou 465)
SMTP_USER=votre.email@gmail.com   # Utilisateur SMTP
SMTP_PASS=votre_mot_de_passe      # Mot de passe SMTP
SMTP_FROM=noreply@finanzplus.at   # Adresse d'envoi
ADMIN_EMAIL=admin@finanzplus.at   # Email de l'équipe

# Configuration Frontend (pour les liens dans l'email)
FRONTEND_URL=http://localhost:3000

# Informations de contact (utilisées dans les emails)
COMPANY_NAME=FinanzPlus Austria GmbH
COMPANY_ADDRESS=Hauptstraße 123, 1010 Wien, Österreich
COMPANY_PHONE=+43 123 456 789
COMPANY_EMAIL=kontakt@finanzplus.at
WHATSAPP_PHONE=+43123456789
```

## 🧪 Test de Configuration

### 1. Vérifier la connexion SMTP

Le serveur backend vérifie automatiquement la connexion SMTP au démarrage:

```bash
cd backend
npm start
```

Vous devriez voir:
```
✅ Serveur SMTP prêt à envoyer des emails
```

Si erreur:
```
❌ Erreur de configuration SMTP: [détails de l'erreur]
```

### 2. Tester l'envoi d'email

Soumettez une demande de prêt via le frontend:

1. Allez sur http://localhost:3000/simulateur
2. Remplissez le formulaire de simulation
3. Cliquez sur "Antrag absenden"
4. Vérifiez:
   - ✅ Email de confirmation reçu par le client
   - ✅ Email de notification reçu par l'admin
   - ✅ Logs dans la console backend

### 3. Vérifier les logs

Dans la console backend, vous devriez voir:
```
✅ Email de confirmation envoyé au client: <message-id>
✅ Notification envoyée à l'équipe: <message-id>
```

## 🎨 Personnalisation des Templates

Les templates HTML sont dans `backend/src/services/emailService.js`:

### Template Client (`getClientConfirmationTemplate`)
- **Couleurs**: #0A1628 (bleu foncé), #C9A84C (or)
- **Structure**: Header → Salutation → Détails → Contact → Footer
- **Responsive**: Compatible mobile et desktop
- **Langues**: Allemand (de-AT)

### Template Équipe (`getTeamNotificationTemplate`)
- **Couleurs**: Rouge (#d32f2f) pour l'urgence
- **Structure**: Alerte → Infos client → Détails prêt
- **Format**: Tableau simple pour lecture rapide

### Modifier les templates

1. Ouvrez `backend/src/services/emailService.js`
2. Modifiez les fonctions `getClientConfirmationTemplate` ou `getTeamNotificationTemplate`
3. Redémarrez le serveur backend
4. Testez avec une nouvelle demande

## 🚨 Résolution des Problèmes

### Problème: Emails non reçus

**Solutions**:
1. Vérifiez le dossier spam/courrier indésirable
2. Vérifiez les credentials SMTP dans le .env
3. Vérifiez les logs backend pour les erreurs
4. Testez avec un autre service SMTP

### Problème: Erreur "Invalid login"

**Gmail**:
- Activez l'authentification à 2 facteurs
- Utilisez un mot de passe d'application (pas votre mot de passe Gmail)

**SendGrid**:
- Vérifiez que la clé API est correcte
- Utilisez "apikey" comme SMTP_USER

### Problème: Emails dans le spam

**Solutions**:
1. Configurez SPF, DKIM, DMARC pour votre domaine
2. Utilisez un service professionnel (SendGrid, Mailgun)
3. Évitez les mots "spam" dans le contenu
4. Ajoutez un lien de désinscription

### Problème: Timeout de connexion

**Solutions**:
1. Vérifiez le port SMTP (587 ou 465)
2. Vérifiez le pare-feu/antivirus
3. Essayez avec `secure: true` pour le port 465

## 📊 Limites d'Envoi

### Gmail
- **Gratuit**: 500 emails/jour
- **Google Workspace**: 2000 emails/jour

### SendGrid
- **Gratuit**: 100 emails/jour
- **Essentials ($19.95/mois)**: 50,000 emails/mois
- **Pro ($89.95/mois)**: 100,000 emails/mois

### Mailgun
- **Gratuit**: 5,000 emails/mois (3 premiers mois)
- **Foundation ($35/mois)**: 50,000 emails/mois

### AWS SES
- **Gratuit**: 62,000 emails/mois (si hébergé sur AWS)
- **Payant**: $0.10 pour 1,000 emails

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter les credentials**:
   - Utilisez `.env` (déjà dans .gitignore)
   - Utilisez des variables d'environnement en production

2. **Utiliser des mots de passe d'application**:
   - Jamais le mot de passe principal du compte
   - Révoquez les mots de passe inutilisés

3. **Limiter les permissions**:
   - Donnez uniquement les permissions d'envoi
   - Pas d'accès lecture/suppression

4. **Surveiller l'utilisation**:
   - Vérifiez les logs d'envoi
   - Alertes en cas de pic inhabituel

5. **Valider les emails**:
   - Vérifiez le format avant envoi
   - Évitez les injections

## 🚀 Déploiement en Production

### 1. Configurer le domaine email

Pour utiliser `noreply@finanzplus.at`:

1. Achetez le domaine `finanzplus.at`
2. Configurez les enregistrements DNS:
   - **MX**: Pointez vers votre service email
   - **SPF**: `v=spf1 include:_spf.google.com ~all`
   - **DKIM**: Ajoutez la clé publique
   - **DMARC**: `v=DMARC1; p=quarantine; rua=mailto:admin@finanzplus.at`

### 2. Variables d'environnement production

Sur Vercel/Netlify/Railway:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at
FRONTEND_URL=https://finanzplus.at
```

### 3. Tester en production

1. Déployez le backend avec les nouvelles variables
2. Soumettez une demande de test
3. Vérifiez la réception des emails
4. Vérifiez les logs de production

## 📚 Ressources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)
- [SPF/DKIM/DMARC Setup](https://www.cloudflare.com/learning/dns/dns-records/)

## 💡 Conseils

1. **Testez d'abord avec Gmail** pour le développement
2. **Passez à SendGrid** pour la production
3. **Surveillez les bounces** et les plaintes spam
4. **Gardez les templates simples** pour éviter les filtres spam
5. **Incluez toujours un lien de désinscription** (requis par la loi)

## ✅ Checklist de Configuration

- [ ] Variables SMTP configurées dans .env
- [ ] Serveur backend démarré sans erreur SMTP
- [ ] Email de test envoyé et reçu
- [ ] Email client professionnel et responsive
- [ ] Email équipe reçu par l'admin
- [ ] Logs backend affichent les confirmations
- [ ] Emails ne vont pas dans le spam
- [ ] Templates personnalisés selon la marque
- [ ] Domaine email configuré (production)
- [ ] SPF/DKIM/DMARC configurés (production)

---

**Support**: Pour toute question, contactez l'équipe technique.