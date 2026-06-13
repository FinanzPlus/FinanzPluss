#!/bin/bash

###############################################################################
# Script de Déploiement Automatique - FinanzPlus Austria
# Usage: ./deploy.sh
###############################################################################

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║        FinanzPlus Austria - Déploiement Automatique      ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
   log_error "Ce script doit être exécuté en tant que root (sudo)"
   exit 1
fi

log_info "Démarrage du déploiement..."

###############################################################################
# ÉTAPE 1: Installation des dépendances système
###############################################################################
log_info "ÉTAPE 1/6: Installation des dépendances système..."

# Mise à jour du système
log_info "Mise à jour du système..."
apt update && apt upgrade -y

# Installation Node.js
if ! command_exists node; then
    log_info "Installation de Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    log_success "Node.js installé: $(node --version)"
else
    log_success "Node.js déjà installé: $(node --version)"
fi

# Installation PostgreSQL
if ! command_exists psql; then
    log_info "Installation de PostgreSQL..."
    apt install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
    log_success "PostgreSQL installé"
else
    log_success "PostgreSQL déjà installé"
fi

# Installation Nginx
if ! command_exists nginx; then
    log_info "Installation de Nginx..."
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    log_success "Nginx installé"
else
    log_success "Nginx déjà installé"
fi

# Installation PM2
if ! command_exists pm2; then
    log_info "Installation de PM2..."
    npm install -g pm2
    log_success "PM2 installé"
else
    log_success "PM2 déjà installé"
fi

# Installation Certbot
if ! command_exists certbot; then
    log_info "Installation de Certbot..."
    apt install -y certbot python3-certbot-nginx
    log_success "Certbot installé"
else
    log_success "Certbot déjà installé"
fi

###############################################################################
# ÉTAPE 2: Configuration de la base de données
###############################################################################
log_info "ÉTAPE 2/6: Configuration de la base de données..."

# Demander les informations de la base de données
read -p "Nom de la base de données [finanzplus_austria]: " DB_NAME
DB_NAME=${DB_NAME:-finanzplus_austria}

read -p "Utilisateur de la base de données [finanzplus]: " DB_USER
DB_USER=${DB_USER:-finanzplus}

read -sp "Mot de passe de la base de données: " DB_PASSWORD
echo

# Créer la base de données et l'utilisateur
log_info "Création de la base de données..."
sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF

log_success "Base de données créée"

# Importer le schéma
if [ -f "database/schema.sql" ]; then
    log_info "Import du schéma de base de données..."
    sudo -u postgres psql $DB_NAME < database/schema.sql
    log_success "Schéma importé"
else
    log_warning "Fichier schema.sql non trouvé, à importer manuellement"
fi

###############################################################################
# ÉTAPE 3: Configuration du Backend
###############################################################################
log_info "ÉTAPE 3/6: Configuration du Backend..."

cd backend

# Créer le fichier .env
log_info "Création du fichier .env..."
cat > .env <<EOF
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://$(hostname -f)

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Email (à configurer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@finanzplus.at
ADMIN_EMAIL=admin@finanzplus.at

# WhatsApp
WHATSAPP_PHONE=+43123456789

# Company
COMPANY_NAME=FinanzPlus Austria GmbH
COMPANY_ADDRESS=Hauptstraße 123, 1010 Wien, Österreich
COMPANY_PHONE=+43 123 456 789
COMPANY_EMAIL=kontakt@finanzplus.at
EOF

log_success "Fichier .env créé"

# Installation des dépendances
log_info "Installation des dépendances backend..."
npm install --production

# Démarrage avec PM2
log_info "Démarrage du backend avec PM2..."
pm2 delete finanzplus-backend 2>/dev/null || true
pm2 start src/server.js --name finanzplus-backend
pm2 save
pm2 startup | tail -n 1 | bash

log_success "Backend démarré"

cd ..

###############################################################################
# ÉTAPE 4: Configuration du Frontend
###############################################################################
log_info "ÉTAPE 4/6: Configuration du Frontend..."

cd frontend

# Demander le domaine
read -p "Nom de domaine (ex: finanzplus.at): " DOMAIN
DOMAIN=${DOMAIN:-localhost}

# Créer le fichier .env
log_info "Création du fichier .env frontend..."
cat > .env <<EOF
REACT_APP_API_URL=https://$DOMAIN/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_CALENDLY_URL=https://calendly.com/finanzplus-austria
REACT_APP_WHATSAPP_PHONE=+43123456789
REACT_APP_COMPANY_EMAIL=kontakt@finanzplus.at
REACT_APP_COMPANY_PHONE=+43 123 456 789
EOF

log_success "Fichier .env frontend créé"

# Installation des dépendances et build
log_info "Installation des dépendances frontend..."
npm install

log_info "Build de production..."
npm run build

log_success "Frontend buildé"

cd ..

###############################################################################
# ÉTAPE 5: Configuration Nginx
###############################################################################
log_info "ÉTAPE 5/6: Configuration de Nginx..."

# Créer la configuration Nginx
log_info "Création de la configuration Nginx..."
cat > /etc/nginx/sites-available/finanzplus <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root /var/www/finanzplus-austria/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
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
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/finanzplus /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl restart nginx

log_success "Nginx configuré"

###############################################################################
# ÉTAPE 6: Configuration SSL
###############################################################################
log_info "ÉTAPE 6/6: Configuration SSL..."

read -p "Configurer SSL avec Let's Encrypt? (y/n): " SETUP_SSL

if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
    read -p "Email pour Let's Encrypt: " SSL_EMAIL
    
    log_info "Installation du certificat SSL..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $SSL_EMAIL --redirect
    
    log_success "SSL configuré"
else
    log_warning "SSL non configuré. Le site est accessible en HTTP uniquement."
fi

###############################################################################
# ÉTAPE 7: Configuration du Firewall
###############################################################################
log_info "Configuration du firewall..."

ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

log_success "Firewall configuré"

###############################################################################
# RÉSUMÉ
###############################################################################
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║           DÉPLOIEMENT TERMINÉ AVEC SUCCÈS! 🎉            ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

log_info "Résumé de l'installation:"
echo ""
echo "  🌐 Site web: https://$DOMAIN"
echo "  🔧 Backend API: https://$DOMAIN/api"
echo "  📊 Base de données: $DB_NAME"
echo "  👤 Utilisateur DB: $DB_USER"
echo ""

log_info "Commandes utiles:"
echo ""
echo "  # Voir les logs backend:"
echo "  pm2 logs finanzplus-backend"
echo ""
echo "  # Redémarrer le backend:"
echo "  pm2 restart finanzplus-backend"
echo ""
echo "  # Voir les logs Nginx:"
echo "  tail -f /var/log/nginx/error.log"
echo ""
echo "  # Statut des services:"
echo "  pm2 status"
echo "  systemctl status nginx"
echo "  systemctl status postgresql"
echo ""

log_warning "N'oubliez pas de:"
echo "  1. Configurer les variables SMTP dans backend/.env"
echo "  2. Ajouter votre clé Google Maps dans frontend/.env"
echo "  3. Configurer Calendly"
echo "  4. Tester toutes les fonctionnalités"
echo ""

log_success "Déploiement terminé! Votre site est maintenant en ligne! 🚀"

# Made with Bob
