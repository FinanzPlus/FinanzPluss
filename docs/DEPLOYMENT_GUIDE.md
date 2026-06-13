# Guide de Déploiement - FinanzPlus Austria

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration de l'environnement](#configuration-de-lenvironnement)
3. [Déploiement de la base de données](#déploiement-de-la-base-de-données)
4. [Déploiement du backend](#déploiement-du-backend)
5. [Déploiement du frontend](#déploiement-du-frontend)
6. [Tests](#tests)
7. [Monitoring et maintenance](#monitoring-et-maintenance)
8. [Sécurité](#sécurité)

---

## Prérequis

### Logiciels requis

- **Node.js**: v18.x ou supérieur
- **PostgreSQL**: v14.x ou supérieur
- **npm** ou **yarn**: Gestionnaire de paquets
- **Git**: Pour le contrôle de version

### Services externes

- **Serveur de production**: VPS, AWS, DigitalOcean, etc.
- **Nom de domaine**: finanzplus.at (exemple)
- **Certificat SSL**: Let's Encrypt recommandé
- **Service d'email**: Pour les notifications (optionnel)

---

## Configuration de l'environnement

### 1. Variables d'environnement Backend

Créer un fichier `.env` dans le dossier `backend/` :

```env
# Environnement
NODE_ENV=production

# Serveur
PORT=5000
FRONTEND_URL=https://finanzplus.at

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finanzplus_prod
DB_USER=finanzplus_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE_SECURISE

# JWT
JWT_SECRET=VOTRE_CLE_SECRETE_TRES_LONGUE_ET_ALEATOIRE
JWT_REFRESH_SECRET=VOTRE_CLE_REFRESH_SECRETE_TRES_LONGUE
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Email (optionnel)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@finanzplus.at
SMTP_PASSWORD=VOTRE_MOT_DE_PASSE_EMAIL
```

### 2. Variables d'environnement Frontend

Créer un fichier `.env.production` dans le dossier `frontend/` :

```env
VITE_API_URL=https://api.finanzplus.at
VITE_WHATSAPP_NUMBER=447451267912
```

---

## Déploiement de la base de données

### 1. Installation de PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Création de la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer l'utilisateur
CREATE USER finanzplus_user WITH PASSWORD 'VOTRE_MOT_DE_PASSE';

# Créer la base de données
CREATE DATABASE finanzplus_prod OWNER finanzplus_user;

# Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE finanzplus_prod TO finanzplus_user;

# Quitter
\q
```

### 3. Importer le schéma

```bash
# Depuis le dossier racine du projet
psql -U finanzplus_user -d finanzplus_prod -f database/schema.sql
```

### 4. Initialiser les données

```bash
# Se connecter au backend
cd backend

# Installer les dépendances
npm install

# Initialiser les horaires d'ouverture
node -e "
const Contact = require('./src/models/Contact');
Contact.initializeOpeningHours().then(() => {
  console.log('Horaires initialisés');
  process.exit(0);
});
"
```

---

## Déploiement du backend

### 1. Installation des dépendances

```bash
cd backend
npm install --production
```

### 2. Configuration avec PM2 (Process Manager)

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer l'application
pm2 start src/server.js --name finanzplus-api

# Configurer le démarrage automatique
pm2 startup
pm2 save

# Vérifier le statut
pm2 status
pm2 logs finanzplus-api
```

### 3. Configuration Nginx (Reverse Proxy)

Créer `/etc/nginx/sites-available/finanzplus-api` :

```nginx
server {
    listen 80;
    server_name api.finanzplus.at;

    location / {
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
}
```

Activer le site :

```bash
sudo ln -s /etc/nginx/sites-available/finanzplus-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Certificat SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d api.finanzplus.at

# Renouvellement automatique
sudo certbot renew --dry-run
```

---

## Déploiement du frontend

### 1. Build de production

```bash
cd frontend
npm install
npm run build
```

Le dossier `dist/` contient les fichiers statiques optimisés.

### 2. Configuration Nginx pour le frontend

Créer `/etc/nginx/sites-available/finanzplus-frontend` :

```nginx
server {
    listen 80;
    server_name finanzplus.at www.finanzplus.at;

    root /var/www/finanzplus/dist;
    index index.html;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Cache des assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Redirection pour React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Activer et recharger :

```bash
sudo ln -s /etc/nginx/sites-available/finanzplus-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Déployer les fichiers

```bash
# Créer le dossier
sudo mkdir -p /var/www/finanzplus

# Copier les fichiers
sudo cp -r frontend/dist/* /var/www/finanzplus/

# Définir les permissions
sudo chown -R www-data:www-data /var/www/finanzplus
```

### 4. SSL pour le frontend

```bash
sudo certbot --nginx -d finanzplus.at -d www.finanzplus.at
```

---

## Tests

### Tests Backend

```bash
cd backend

# Tests unitaires (à créer)
npm test

# Test de connexion à la base de données
curl http://localhost:5000/api/test-db

# Test de santé
curl http://localhost:5000/health
```

### Tests Frontend

```bash
cd frontend

# Tests unitaires (à créer)
npm test

# Build de test
npm run build

# Vérifier les erreurs
npm run preview
```

### Tests d'intégration

1. **Test d'authentification**
   - Inscription d'un nouvel utilisateur
   - Connexion
   - Accès aux routes protégées

2. **Test des produits**
   - Affichage du catalogue
   - Filtres et recherche
   - Page de détail

3. **Test du panier**
   - Ajout de produits
   - Modification des quantités
   - Persistance

4. **Test du simulateur**
   - Calcul de prêt
   - Génération du tableau d'amortissement
   - Soumission de demande

5. **Test des commentaires**
   - Soumission d'avis
   - Affichage des statistiques
   - Modération admin

---

## Monitoring et maintenance

### 1. Logs

```bash
# Logs PM2
pm2 logs finanzplus-api

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 2. Monitoring avec PM2

```bash
# Monitoring en temps réel
pm2 monit

# Statistiques
pm2 show finanzplus-api
```

### 3. Sauvegardes de la base de données

Créer un script de sauvegarde `/usr/local/bin/backup-finanzplus.sh` :

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/finanzplus"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U finanzplus_user finanzplus_prod | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Garder seulement les 7 derniers jours
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Ajouter au crontab :

```bash
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /usr/local/bin/backup-finanzplus.sh
```

### 4. Mises à jour

```bash
# Backend
cd backend
git pull
npm install --production
pm2 restart finanzplus-api

# Frontend
cd frontend
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/finanzplus/
```

---

## Sécurité

### 1. Firewall

```bash
# Installer UFW
sudo apt install ufw

# Configurer les règles
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Sécurité PostgreSQL

```bash
# Éditer pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Autoriser seulement localhost
# local   all   finanzplus_user   md5
# host    all   finanzplus_user   127.0.0.1/32   md5
```

### 3. Mises à jour de sécurité

```bash
# Mises à jour automatiques
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. Rotation des secrets JWT

Changer régulièrement les secrets JWT (tous les 3-6 mois) :

1. Générer de nouveaux secrets
2. Mettre à jour `.env`
3. Redémarrer l'application
4. Les utilisateurs devront se reconnecter

---

## Checklist de déploiement

- [ ] Base de données PostgreSQL configurée
- [ ] Variables d'environnement définies
- [ ] Backend déployé avec PM2
- [ ] Frontend buildé et déployé
- [ ] Nginx configuré avec reverse proxy
- [ ] Certificats SSL installés
- [ ] Firewall configuré
- [ ] Sauvegardes automatiques configurées
- [ ] Monitoring en place
- [ ] Tests d'intégration réussis
- [ ] Documentation à jour

---

## Support et maintenance

### Contacts

- **Développeur**: Bob
- **Email technique**: tech@finanzplus.at
- **Urgences**: +43 1 234 5678

### Ressources

- **Documentation API**: https://api.finanzplus.at/docs
- **Repository Git**: https://github.com/finanzplus/platform
- **Monitoring**: https://monitor.finanzplus.at

---

**Dernière mise à jour**: 12 juin 2026  
**Version**: 1.0.0