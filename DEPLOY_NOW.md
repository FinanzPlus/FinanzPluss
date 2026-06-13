# 🚀 DÉPLOIEMENT RAPIDE - FinanzPlus Austria

## ⚡ DÉPLOYER EN 5 MINUTES

### Option 1: Script Automatique (Recommandé)

```bash
# 1. Uploader le projet sur votre serveur
scp -r . root@votre-serveur:/var/www/finanzplus-austria

# 2. Se connecter au serveur
ssh root@votre-serveur

# 3. Aller dans le dossier
cd /var/www/finanzplus-austria

# 4. Rendre le script exécutable
chmod +x deploy.sh

# 5. Lancer le déploiement
./deploy.sh
```

**Le script va automatiquement:**
- ✅ Installer Node.js, PostgreSQL, Nginx, PM2, Certbot
- ✅ Créer la base de données
- ✅ Configurer le backend et frontend
- ✅ Configurer Nginx
- ✅ Installer SSL gratuit
- ✅ Configurer le firewall

**Durée: ~5-10 minutes**

---

### Option 2: Manuel (Guide Complet)

Suivre le guide détaillé: **`docs/DEPLOYMENT_URGENT.md`**

**Durée: ~30 minutes**

---

## 📋 PRÉ-REQUIS

### Serveur
- **VPS Ubuntu 22.04** (DigitalOcean, Linode, AWS, Hetzner)
- **Minimum**: 2GB RAM, 2 CPU, 50GB SSD
- **Accès**: SSH root ou sudo

### Domaine
- Nom de domaine enregistré
- DNS pointant vers l'IP du serveur

### Informations à préparer
- Mot de passe base de données
- Email pour SSL
- Nom de domaine

---

## 🔧 CONFIGURATION POST-DÉPLOIEMENT

### 1. Configurer les Emails (SMTP)

Éditer `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password
```

**Pour Gmail:**
1. Activer l'authentification à 2 facteurs
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans SMTP_PASS

### 2. Ajouter Google Maps API Key

Éditer `frontend/.env`:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=votre-cle-api
```

**Obtenir une clé:**
1. https://console.cloud.google.com/
2. Activer "Maps JavaScript API"
3. Créer une clé API
4. Restreindre à votre domaine

### 3. Configurer Calendly

Éditer `frontend/.env`:
```env
REACT_APP_CALENDLY_URL=https://calendly.com/votre-compte
```

### 4. Rebuild Frontend (si modifications)

```bash
cd /var/www/finanzplus-austria/frontend
npm run build
systemctl restart nginx
```

### 5. Redémarrer Backend (si modifications)

```bash
pm2 restart finanzplus-backend
```

---

## ✅ VÉRIFICATIONS

### Tester le site
```bash
# Backend API
curl https://votre-domaine.com/api/health

# Frontend
curl https://votre-domaine.com
```

### Vérifier les services
```bash
pm2 status
systemctl status nginx
systemctl status postgresql
```

### Voir les logs
```bash
# Backend
pm2 logs finanzplus-backend

# Nginx
tail -f /var/log/nginx/error.log
```

---

## 🔒 SÉCURITÉ

### Firewall
```bash
ufw status
# Doit montrer: 22, 80, 443 autorisés
```

### SSL
```bash
certbot certificates
# Doit montrer un certificat valide
```

### Backup Base de Données
```bash
# Créer un backup
pg_dump -U finanzplus finanzplus_austria > backup.sql

# Automatiser (crontab)
crontab -e
# Ajouter: 0 2 * * * pg_dump -U finanzplus finanzplus_austria > /backups/db_$(date +\%Y\%m\%d).sql
```

---

## 🚨 DÉPANNAGE RAPIDE

### Site inaccessible
```bash
systemctl status nginx
pm2 status
# Redémarrer si nécessaire
systemctl restart nginx
pm2 restart finanzplus-backend
```

### Erreur 502 Bad Gateway
```bash
# Vérifier que le backend tourne
pm2 logs finanzplus-backend
# Vérifier le port
netstat -tulpn | grep 5000
```

### Base de données inaccessible
```bash
systemctl status postgresql
# Tester la connexion
psql -U finanzplus -d finanzplus_austria -h localhost
```

---

## 📞 COMMANDES UTILES

```bash
# Statut général
pm2 status
systemctl status nginx postgresql

# Logs
pm2 logs finanzplus-backend --lines 100
tail -f /var/log/nginx/error.log

# Redémarrer
pm2 restart finanzplus-backend
systemctl restart nginx

# Espace disque
df -h

# Mémoire
free -h

# Processus
top
```

---

## 🎯 CHECKLIST FINALE

- [ ] Site accessible via HTTPS
- [ ] Certificat SSL valide (cadenas vert)
- [ ] Backend API répond
- [ ] Page d'accueil s'affiche
- [ ] Formulaires fonctionnent
- [ ] Emails configurés
- [ ] Google Maps fonctionne
- [ ] Calendly fonctionne
- [ ] WhatsApp fonctionne
- [ ] Responsive mobile OK
- [ ] Logs sans erreurs
- [ ] Backup configuré

---

## 📚 DOCUMENTATION COMPLÈTE

- **Guide Déploiement**: `docs/DEPLOYMENT_URGENT.md`
- **Guide Installation**: `docs/INSTALLATION_GUIDE.md`
- **Guide Intégrations**: `docs/INTEGRATIONS_GUIDE.md`
- **Structure Projet**: `PROJECT_STRUCTURE.md`

---

## 🆘 SUPPORT

**En cas de problème:**

1. Vérifier les logs: `pm2 logs` et `/var/log/nginx/error.log`
2. Redémarrer les services: `pm2 restart all && systemctl restart nginx`
3. Vérifier la configuration: `nginx -t` et `pm2 status`

**Contact:**
- Email: kontakt@finanzplus.at
- Documentation: Ce fichier et `docs/`

---

## 🎉 FÉLICITATIONS!

Votre site **FinanzPlus Austria** est maintenant en ligne! 🚀

**URL**: https://votre-domaine.com

**Prochaines étapes:**
1. Tester toutes les fonctionnalités
2. Créer un compte admin
3. Ajouter du contenu
4. Configurer Google Analytics (optionnel)
5. Promouvoir le site!

---

**Temps de déploiement: 5-30 minutes selon la méthode** ⏱️

**Le site est prêt pour la production!** ✅