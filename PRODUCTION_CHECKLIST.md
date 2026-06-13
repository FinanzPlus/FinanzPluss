# ✅ Checklist de Déploiement Production - FinanzPlus Austria

## 📋 Avant le Déploiement

### 🔐 Sécurité

- [ ] **Changer TOUS les mots de passe et secrets**
  - [ ] `JWT_SECRET` (min 64 caractères)
  - [ ] `JWT_REFRESH_SECRET` (différent de JWT_SECRET)
  - [ ] `DB_PASSWORD` (complexe, min 16 caractères)
  - [ ] `SMTP_PASSWORD`
  - [ ] `REDIS_PASSWORD`
  - [ ] `SESSION_SECRET`
  - [ ] Tous les API keys (Google Maps, Calendly, WhatsApp, etc.)

- [ ] **Configurer les variables d'environnement**
  - [ ] Backend: Copier `.env.production` vers `.env`
  - [ ] Frontend: Copier `.env.production` vers `.env`
  - [ ] Vérifier toutes les valeurs
  - [ ] Permissions fichiers: `chmod 600 .env`

- [ ] **SSL/HTTPS**
  - [ ] Certificat SSL installé (Let's Encrypt recommandé)
  - [ ] Redirection HTTP → HTTPS configurée
  - [ ] HSTS activé
  - [ ] Certificat valide et non expiré

- [ ] **Firewall**
  - [ ] Port 80 (HTTP) ouvert
  - [ ] Port 443 (HTTPS) ouvert
  - [ ] Port 5432 (PostgreSQL) fermé au public
  - [ ] Port 6379 (Redis) fermé au public
  - [ ] SSH sur port non-standard (optionnel)

### 🗄️ Base de Données

- [ ] **PostgreSQL installé et configuré**
  - [ ] Version 14+ installée
  - [ ] Service démarré et activé au boot
  - [ ] Utilisateur `finanzplus_user` créé
  - [ ] Base de données `finanzplus_austria_prod` créée
  - [ ] Permissions correctes accordées

- [ ] **Schema et données**
  - [ ] Schema importé: `psql -U finanzplus_user -d finanzplus_austria_prod -f database/schema.sql`
  - [ ] Données de seed (optionnel): `psql -U finanzplus_user -d finanzplus_austria_prod -f database/seed-data.sql`
  - [ ] Indexes créés
  - [ ] Contraintes vérifiées

- [ ] **Backup configuré**
  - [ ] Script de backup automatique
  - [ ] Cron job configuré (quotidien à 2h)
  - [ ] Rétention 30 jours
  - [ ] Test de restauration effectué

### 🖥️ Serveur

- [ ] **Prérequis système**
  - [ ] Node.js 18+ installé
  - [ ] npm 9+ installé
  - [ ] PostgreSQL 14+ installé
  - [ ] Nginx installé
  - [ ] PM2 installé globalement: `npm install -g pm2`
  - [ ] Git installé

- [ ] **Ressources**
  - [ ] RAM: Min 2GB (4GB recommandé)
  - [ ] CPU: Min 2 cores
  - [ ] Disque: Min 20GB libre
  - [ ] Bande passante: Illimitée ou > 1TB/mois

- [ ] **Utilisateur système**
  - [ ] Utilisateur non-root créé: `finanzplus`
  - [ ] Permissions sudo configurées
  - [ ] SSH key configurée

### 📦 Code

- [ ] **Repository**
  - [ ] Code poussé sur Git
  - [ ] Branch `main` ou `production` créée
  - [ ] Tags de version créés
  - [ ] `.gitignore` vérifié (pas de secrets)

- [ ] **Dependencies**
  - [ ] Backend: `cd backend && npm install --production`
  - [ ] Frontend: `cd frontend && npm install`
  - [ ] Pas de vulnérabilités critiques: `npm audit`

- [ ] **Build**
  - [ ] Frontend build: `cd frontend && npm run build`
  - [ ] Fichiers générés dans `frontend/dist`
  - [ ] Taille bundle vérifiée (< 2MB)

### 🔧 Configuration

- [ ] **Nginx**
  - [ ] Configuration créée: `/etc/nginx/sites-available/finanzplus`
  - [ ] Symlink créé: `/etc/nginx/sites-enabled/finanzplus`
  - [ ] Configuration testée: `nginx -t`
  - [ ] Service rechargé: `systemctl reload nginx`

- [ ] **PM2**
  - [ ] Fichier `ecosystem.config.js` créé
  - [ ] Application démarrée: `pm2 start ecosystem.config.js`
  - [ ] Startup configuré: `pm2 startup` puis `pm2 save`
  - [ ] Logs vérifiés: `pm2 logs`

- [ ] **DNS**
  - [ ] Enregistrement A: `finanzplus.at` → IP serveur
  - [ ] Enregistrement A: `www.finanzplus.at` → IP serveur
  - [ ] Enregistrement A: `api.finanzplus.at` → IP serveur
  - [ ] Propagation DNS vérifiée (24-48h)

---

## 🚀 Déploiement

### Méthode 1: Script Automatique (Recommandé)

```bash
# 1. Télécharger le projet
git clone https://github.com/votre-repo/finanzplus-austria.git
cd finanzplus-austria

# 2. Rendre le script exécutable
chmod +x deploy.sh

# 3. Exécuter le déploiement
sudo ./deploy.sh

# 4. Suivre les instructions à l'écran
```

### Méthode 2: Manuel

```bash
# 1. Cloner le repository
git clone https://github.com/votre-repo/finanzplus-austria.git
cd finanzplus-austria

# 2. Backend
cd backend
cp .env.production .env
# Éditer .env avec vos valeurs
npm install --production
cd ..

# 3. Frontend
cd frontend
cp .env.production .env
# Éditer .env avec vos valeurs
npm install
npm run build
cd ..

# 4. Base de données
sudo -u postgres psql
CREATE DATABASE finanzplus_austria_prod;
CREATE USER finanzplus_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE finanzplus_austria_prod TO finanzplus_user;
\q

psql -U finanzplus_user -d finanzplus_austria_prod -f database/schema.sql

# 5. Nginx
sudo cp nginx.conf /etc/nginx/sites-available/finanzplus
sudo ln -s /etc/nginx/sites-available/finanzplus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. SSL
sudo certbot --nginx -d finanzplus.at -d www.finanzplus.at -d api.finanzplus.at

# 7. PM2
cd backend
pm2 start src/server.js --name finanzplus-api
pm2 startup
pm2 save
```

---

## ✅ Après le Déploiement

### 🧪 Tests

- [ ] **Santé du serveur**
  - [ ] Backend accessible: `curl https://api.finanzplus.at/health`
  - [ ] Frontend accessible: `https://finanzplus.at`
  - [ ] Pas d'erreurs 500
  - [ ] Temps de réponse < 500ms

- [ ] **Fonctionnalités critiques**
  - [ ] Inscription utilisateur
  - [ ] Connexion utilisateur
  - [ ] Simulateur de prêt
  - [ ] Création demande de prêt
  - [ ] Upload de documents
  - [ ] Envoi d'emails
  - [ ] Dashboard utilisateur
  - [ ] Dashboard admin

- [ ] **Performance**
  - [ ] Lighthouse score > 90
  - [ ] Temps de chargement < 3s
  - [ ] Pas de memory leaks
  - [ ] CPU usage < 50%

- [ ] **Sécurité**
  - [ ] HTTPS fonctionnel
  - [ ] Headers de sécurité présents
  - [ ] CORS configuré correctement
  - [ ] Rate limiting actif
  - [ ] Pas de secrets exposés

- [ ] **SEO**
  - [ ] Sitemap accessible: `https://finanzplus.at/sitemap.xml`
  - [ ] Robots.txt accessible: `https://finanzplus.at/robots.txt`
  - [ ] Meta tags présents
  - [ ] Open Graph tags présents
  - [ ] Structured Data valide

### 📊 Monitoring

- [ ] **Logs**
  - [ ] Backend logs: `pm2 logs finanzplus-api`
  - [ ] Nginx logs: `/var/log/nginx/access.log` et `error.log`
  - [ ] PostgreSQL logs: `/var/log/postgresql/`
  - [ ] Rotation des logs configurée

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot configuré (ou équivalent)
  - [ ] Alertes email configurées
  - [ ] Check interval: 5 minutes
  - [ ] Locations multiples

- [ ] **Error Tracking**
  - [ ] Sentry configuré (frontend + backend)
  - [ ] Alertes configurées
  - [ ] Source maps uploadées

- [ ] **Analytics**
  - [ ] Google Analytics configuré
  - [ ] Google Tag Manager configuré
  - [ ] Événements personnalisés trackés

### 🔄 Backup et Récupération

- [ ] **Backup automatique**
  - [ ] Script de backup testé
  - [ ] Cron job actif: `crontab -l`
  - [ ] Backup stocké hors serveur
  - [ ] Test de restauration effectué

- [ ] **Plan de récupération**
  - [ ] Documentation de restauration
  - [ ] RTO (Recovery Time Objective): < 4h
  - [ ] RPO (Recovery Point Objective): < 24h
  - [ ] Contact d'urgence défini

### 📧 Communication

- [ ] **Emails**
  - [ ] SMTP configuré et testé
  - [ ] Templates emails vérifiés
  - [ ] SPF record configuré
  - [ ] DKIM configuré
  - [ ] DMARC configuré

- [ ] **Notifications**
  - [ ] WhatsApp Business configuré
  - [ ] Numéros de contact vérifiés
  - [ ] Messages automatiques testés

### 👥 Équipe

- [ ] **Accès**
  - [ ] Accès serveur distribués
  - [ ] Accès base de données distribués
  - [ ] Accès admin créés
  - [ ] Documentation partagée

- [ ] **Formation**
  - [ ] Guide admin partagé
  - [ ] Guide utilisateur publié
  - [ ] Documentation API accessible
  - [ ] Session de formation effectuée

---

## 🔒 Sécurité Post-Déploiement

### Immédiat (Jour 1)

- [ ] Changer le mot de passe root
- [ ] Désactiver connexion SSH root
- [ ] Configurer fail2ban
- [ ] Activer firewall (ufw)
- [ ] Vérifier les ports ouverts: `nmap localhost`

### Hebdomadaire

- [ ] Vérifier les logs d'erreur
- [ ] Vérifier les tentatives de connexion échouées
- [ ] Vérifier l'espace disque: `df -h`
- [ ] Vérifier la charge serveur: `htop`

### Mensuel

- [ ] Mettre à jour les dépendances: `npm update`
- [ ] Mettre à jour le système: `apt update && apt upgrade`
- [ ] Vérifier les vulnérabilités: `npm audit`
- [ ] Tester la restauration backup
- [ ] Renouveler certificat SSL (automatique avec certbot)

---

## 📈 Optimisations Futures

### Performance

- [ ] Implémenter Redis pour caching
- [ ] Configurer CDN (Cloudflare)
- [ ] Optimiser les images (WebP, compression)
- [ ] Implémenter lazy loading
- [ ] Configurer HTTP/2

### Fonctionnalités

- [ ] Application mobile (React Native)
- [ ] Chat en temps réel (Socket.io)
- [ ] Signature électronique
- [ ] Scan de documents (OCR)
- [ ] Notifications push

### Scalabilité

- [ ] Load balancer (Nginx)
- [ ] Réplication PostgreSQL
- [ ] Cluster Redis
- [ ] Microservices architecture
- [ ] Kubernetes (si nécessaire)

---

## 🆘 Contacts d'Urgence

| Rôle | Nom | Contact |
|------|-----|---------|
| **Admin Système** | [Nom] | [Email/Téléphone] |
| **Développeur Lead** | [Nom] | [Email/Téléphone] |
| **DBA** | [Nom] | [Email/Téléphone] |
| **Support Hébergeur** | [Nom] | [Email/Téléphone] |
| **Support DNS** | [Nom] | [Email/Téléphone] |

---

## 📝 Notes

### Commandes Utiles

```bash
# Vérifier le statut
pm2 status
systemctl status nginx
systemctl status postgresql

# Redémarrer les services
pm2 restart finanzplus-api
sudo systemctl restart nginx
sudo systemctl restart postgresql

# Voir les logs
pm2 logs finanzplus-api
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Backup manuel
pg_dump -U finanzplus_user finanzplus_austria_prod > backup_$(date +%Y%m%d).sql

# Restaurer backup
psql -U finanzplus_user finanzplus_austria_prod < backup_20260612.sql

# Vérifier l'espace disque
df -h
du -sh /var/www/finanzplus

# Vérifier la mémoire
free -h
pm2 monit

# Vérifier les connexions
netstat -tulpn | grep LISTEN
ss -tulpn
```

---

## ✅ Validation Finale

Une fois TOUTES les cases cochées :

- [ ] **Site accessible publiquement**
- [ ] **Toutes les fonctionnalités testées**
- [ ] **Monitoring actif**
- [ ] **Backup configuré**
- [ ] **Documentation à jour**
- [ ] **Équipe formée**

**🎉 FÉLICITATIONS ! FinanzPlus Austria est en production !**

---

**Version** : 1.0  
**Date** : 2026-06-12  
**Responsable** : [Votre Nom]  
**Prochaine révision** : [Date]