# 🚀 GUIDE DE DÉPLOIEMENT URGENT - FinanzPlus Austria

## ⚡ DÉPLOIEMENT RAPIDE EN 30 MINUTES

Ce guide vous permet de déployer rapidement le site FinanzPlus Austria en production.

---

## 📋 PRÉ-REQUIS ESSENTIELS

### 1. Serveur / Hébergement
- **VPS** (recommandé): DigitalOcean, Linode, AWS EC2, ou Hetzner
- **Minimum**: 2GB RAM, 2 CPU cores, 50GB SSD
- **OS**: Ubuntu 22.04 LTS (recommandé)

### 2. Nom de Domaine
- Domaine enregistré (ex: finanzplus.at)
- Accès aux DNS

### 3. Accès Serveur
- Accès SSH root ou sudo

---

## 🔥 ÉTAPE 1: PRÉPARATION SERVEUR (5 min)

### Connexion SSH
```bash
ssh root@votre-ip-serveur
```

### Installation des dépendances
```bash
# Mise à jour système
apt update && apt upgrade -y

# Installation Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Installation PostgreSQL
apt install -y postgresql postgresql-contrib

# Installation Nginx
apt install -y nginx

# Installation PM2 (gestionnaire de processus)
npm install -g pm2

# Installation Certbot (SSL gratuit)
apt install -y certbot python3-certbot-nginx
```

### Vérification
```bash
node --version  # Doit afficher v18.x
npm --version
psql --version
nginx -v
pm2 --version
```

---

## 🗄️ ÉTAPE 2: CONFIGURATION BASE DE DONNÉES (5 min)

### Créer la base de données
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans psql:
CREATE DATABASE finanzplus_austria;
CREATE USER finanzplus WITH PASSWORD 'VotreMotDePasseSecurise123!';
GRANT ALL PRIVILEGES ON DATABASE finanzplus_austria TO finanzplus;
\q
```

### Importer le schéma
```bash
# Copier le fichier schema.sql sur le serveur
# Puis:
sudo -u postgres psql finanzplus_austria < /path/to/schema.sql
```

---

## 📦 ÉTAPE 3: DÉPLOIEMENT APPLICATION (10 min)

### Cloner ou uploader le projet
```bash
# Option 1: Git (si repository)
cd /var/www
git clone https://github.com/votre-repo/finanzplus-austria.git
cd finanzplus-austria

# Option 2: Upload manuel (via SCP/SFTP)
# Uploader le dossier complet vers /var/www/finanzplus-austria
```

### Configuration Backend
```bash
cd /var/www/finanzplus-austria/backend

# Copier et configurer .env
cp .env.example .env
nano .env
```

**Modifier .env avec vos valeurs:**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://votre-domaine.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finanzplus_austria
DB_USER=finanzplus
DB_PASSWORD=VotreMotDePasseSecurise123!

# JWT
JWT_SECRET=GenerezUnSecretTresLongEtAleatoire123456789!
JWT_EXPIRES_IN=7d

# Email (Gmail exemple)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at

# WhatsApp
WHATSAPP_PHONE=+43123456789

# Company
COMPANY_NAME=FinanzPlus Austria GmbH
COMPANY_ADDRESS=Hauptstraße 123, 1010 Wien, Österreich
COMPANY_PHONE=+43 123 456 789
COMPANY_EMAIL=kontakt@finanzplus.at
```

**Installer dépendances et démarrer:**
```bash
npm install --production
pm2 start src/server.js --name finanzplus-backend
pm2 save
pm2 startup
```

### Configuration Frontend
```bash
cd /var/www/finanzplus-austria/frontend

# Copier et configurer .env
cp .env.example .env
nano .env
```

**Modifier .env:**
```env
REACT_APP_API_URL=https://votre-domaine.com/api
REACT_APP_GOOGLE_MAPS_API_KEY=votre-cle-google-maps
REACT_APP_CALENDLY_URL=https://calendly.com/finanzplus-austria
REACT_APP_WHATSAPP_PHONE=+43123456789
REACT_APP_COMPANY_EMAIL=kontakt@finanzplus.at
```

**Build production:**
```bash
npm install
npm run build
```

---

## 🌐 ÉTAPE 4: CONFIGURATION NGINX (5 min)

### Créer configuration Nginx
```bash
nano /etc/nginx/sites-available/finanzplus
```

**Contenu du fichier:**
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Frontend (React build)
    root /var/www/finanzplus-austria/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Activer le site:**
```bash
ln -s /etc/nginx/sites-available/finanzplus /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔒 ÉTAPE 5: SSL GRATUIT (5 min)

### Installer certificat SSL avec Let's Encrypt
```bash
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

**Suivre les instructions:**
1. Entrer votre email
2. Accepter les termes
3. Choisir "2" pour redirection HTTPS automatique

**Renouvellement automatique:**
```bash
certbot renew --dry-run
```

---

## ✅ ÉTAPE 6: VÉRIFICATIONS FINALES (2 min)

### Vérifier les services
```bash
# Backend
pm2 status
pm2 logs finanzplus-backend

# Nginx
systemctl status nginx

# PostgreSQL
systemctl status postgresql

# Ports ouverts
netstat -tulpn | grep LISTEN
```

### Tester l'application
```bash
# Backend API
curl http://localhost:5000/api/health

# Frontend
curl http://localhost
```

### Accéder au site
Ouvrir dans le navigateur:
- **https://votre-domaine.com**

---

## 🔧 CONFIGURATION DNS

### Chez votre registrar de domaine:

**Enregistrements A:**
```
Type: A
Name: @
Value: IP-de-votre-serveur
TTL: 3600

Type: A
Name: www
Value: IP-de-votre-serveur
TTL: 3600
```

**Propagation:** Attendre 5-30 minutes

---

## 📊 MONITORING & MAINTENANCE

### Commandes PM2 utiles
```bash
pm2 status                    # Statut des processus
pm2 logs finanzplus-backend   # Voir les logs
pm2 restart finanzplus-backend # Redémarrer
pm2 stop finanzplus-backend   # Arrêter
pm2 delete finanzplus-backend # Supprimer
```

### Logs système
```bash
# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PostgreSQL
tail -f /var/log/postgresql/postgresql-14-main.log
```

### Backup base de données
```bash
# Créer backup
pg_dump -U finanzplus finanzplus_austria > backup_$(date +%Y%m%d).sql

# Restaurer backup
psql -U finanzplus finanzplus_austria < backup_20260612.sql
```

---

## 🚨 DÉPANNAGE RAPIDE

### Backend ne démarre pas
```bash
cd /var/www/finanzplus-austria/backend
pm2 logs finanzplus-backend --lines 50
# Vérifier .env et connexion DB
```

### Erreur 502 Bad Gateway
```bash
# Vérifier que le backend tourne
pm2 status
# Vérifier les logs Nginx
tail -f /var/log/nginx/error.log
```

### Base de données inaccessible
```bash
# Vérifier PostgreSQL
systemctl status postgresql
# Tester connexion
psql -U finanzplus -d finanzplus_austria -h localhost
```

### SSL ne fonctionne pas
```bash
# Renouveler certificat
certbot renew --force-renewal
systemctl restart nginx
```

---

## 🔐 SÉCURITÉ ESSENTIELLE

### Firewall (UFW)
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
ufw status
```

### Fail2ban (protection SSH)
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### Mises à jour automatiques
```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

---

## 📱 APRÈS DÉPLOIEMENT

### ✅ Checklist finale:
- [ ] Site accessible via HTTPS
- [ ] Certificat SSL valide (cadenas vert)
- [ ] Backend API répond
- [ ] Formulaires fonctionnent
- [ ] Emails s'envoient
- [ ] Base de données accessible
- [ ] Logs sans erreurs critiques
- [ ] Backup configuré
- [ ] Monitoring actif

### 🎯 Tests à effectuer:
1. Inscription utilisateur
2. Connexion
3. Demande de crédit
4. Upload document
5. Formulaire contact
6. Rendez-vous Calendly
7. WhatsApp
8. Responsive mobile

---

## 📞 SUPPORT URGENT

### Problèmes critiques:
1. **Vérifier les logs**: `pm2 logs` et `/var/log/nginx/error.log`
2. **Redémarrer services**: `pm2 restart all && systemctl restart nginx`
3. **Vérifier connexions**: Base de données, API, DNS

### Commandes de diagnostic:
```bash
# Santé générale
pm2 status
systemctl status nginx postgresql
df -h  # Espace disque
free -h  # Mémoire
top  # Processus

# Connectivité
curl http://localhost:5000/api/health
curl https://votre-domaine.com
ping votre-domaine.com
```

---

## 🎉 FÉLICITATIONS!

Votre site **FinanzPlus Austria** est maintenant en ligne! 🚀

**URL**: https://votre-domaine.com

**Prochaines étapes recommandées:**
1. Configurer Google Analytics
2. Ajouter Google Maps API key
3. Configurer Calendly
4. Tester tous les formulaires
5. Créer compte admin
6. Ajouter contenu initial

---

## 📚 RESSOURCES UTILES

- **PM2 Documentation**: https://pm2.keymetrics.io/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Temps total de déploiement: ~30 minutes** ⏱️

**Support**: kontakt@finanzplus.at