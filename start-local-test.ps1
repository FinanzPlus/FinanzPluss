# ============================================
# Script de Test Local - FinanzPlus Austria
# Exécution automatique du backend et frontend
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FINANZPLUS AUSTRIA - TEST LOCAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
Write-Host "[1/8] Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installé: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "Téléchargez-le sur: https://nodejs.org" -ForegroundColor Yellow
    pause
    exit 1
}

# Vérifier si npm est installé
Write-Host "[2/8] Vérification de npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installé: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm n'est pas installé!" -ForegroundColor Red
    pause
    exit 1
}

# Vérifier PostgreSQL
Write-Host "[3/8] Vérification de PostgreSQL..." -ForegroundColor Yellow
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue
if ($pgInstalled) {
    Write-Host "✓ PostgreSQL installé" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL non détecté" -ForegroundColor Yellow
    Write-Host "Le backend nécessite PostgreSQL pour fonctionner" -ForegroundColor Yellow
    Write-Host "Téléchargez-le sur: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continuer quand même? (o/n)"
    if ($continue -ne "o") {
        exit 1
    }
}

# Configuration Backend
Write-Host ""
Write-Host "[4/8] Configuration du Backend..." -ForegroundColor Yellow
cd backend

if (!(Test-Path ".env")) {
    Write-Host "Copie de .env.example vers .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Fichier .env créé" -ForegroundColor Green
    Write-Host "⚠ IMPORTANT: Éditez backend/.env avec vos identifiants PostgreSQL" -ForegroundColor Yellow
} else {
    Write-Host "✓ Fichier .env existe déjà" -ForegroundColor Green
}

# Installation dépendances Backend
Write-Host ""
Write-Host "[5/8] Installation des dépendances Backend..." -ForegroundColor Yellow
Write-Host "Cela peut prendre quelques minutes..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dépendances Backend installées" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors de l'installation des dépendances Backend" -ForegroundColor Red
    cd ..
    pause
    exit 1
}

cd ..

# Configuration Frontend
Write-Host ""
Write-Host "[6/8] Configuration du Frontend..." -ForegroundColor Yellow
cd frontend

if (!(Test-Path ".env")) {
    Write-Host "Copie de .env.example vers .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Fichier .env créé" -ForegroundColor Green
} else {
    Write-Host "✓ Fichier .env existe déjà" -ForegroundColor Green
}

# Installation dépendances Frontend
Write-Host ""
Write-Host "[7/8] Installation des dépendances Frontend..." -ForegroundColor Yellow
Write-Host "Cela peut prendre quelques minutes..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dépendances Frontend installées" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors de l'installation des dépendances Frontend" -ForegroundColor Red
    cd ..
    pause
    exit 1
}

cd ..

# Instructions finales
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALLATION TERMINÉE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. CONFIGURER LA BASE DE DONNÉES:" -ForegroundColor Cyan
Write-Host "   - Ouvrez pgAdmin ou psql" -ForegroundColor White
Write-Host "   - Créez la base de données: CREATE DATABASE finanzplus_austria;" -ForegroundColor White
Write-Host "   - Importez le schema: psql -U postgres -d finanzplus_austria -f database/schema.sql" -ForegroundColor White
Write-Host ""
Write-Host "2. CONFIGURER LES VARIABLES D'ENVIRONNEMENT:" -ForegroundColor Cyan
Write-Host "   - Éditez backend/.env avec vos identifiants PostgreSQL" -ForegroundColor White
Write-Host "   - DB_USER, DB_PASSWORD, DB_NAME, etc." -ForegroundColor White
Write-Host ""
Write-Host "3. DÉMARRER LES SERVEURS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "4. ACCÉDER À L'APPLICATION:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Proposer de créer des scripts de démarrage
Write-Host "Voulez-vous créer des scripts de démarrage rapide? (o/n)" -ForegroundColor Yellow
$createScripts = Read-Host

if ($createScripts -eq "o") {
    # Script Backend
    @"
@echo off
echo Démarrage du Backend FinanzPlus Austria...
cd backend
npm start
pause
"@ | Out-File -FilePath "start-backend.bat" -Encoding ASCII
    
    # Script Frontend
    @"
@echo off
echo Démarrage du Frontend FinanzPlus Austria...
cd frontend
npm run dev
pause
"@ | Out-File -FilePath "start-frontend.bat" -Encoding ASCII
    
    Write-Host "✓ Scripts créés:" -ForegroundColor Green
    Write-Host "  - start-backend.bat" -ForegroundColor White
    Write-Host "  - start-frontend.bat" -ForegroundColor White
    Write-Host ""
    Write-Host "Double-cliquez sur ces fichiers pour démarrer les serveurs!" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Appuyez sur une touche pour terminer..." -ForegroundColor Gray
pause

# Made with Bob
