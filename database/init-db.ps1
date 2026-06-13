# Script d'initialisation de la base de données PostgreSQL pour FinanzPlus Austria
# Ce script crée la base de données, l'utilisateur et importe le schéma

Write-Host "=== Initialisation de la base de données FinanzPlus Austria ===" -ForegroundColor Green
Write-Host ""

# Configuration
$POSTGRES_PATH = "C:\Program Files\PostgreSQL\18\bin"
$DB_NAME = "finanzplus_austria"
$DB_USER = "finanzplus_user"
$DB_PASSWORD = "FinanzPlus2024!Secure"
$SCHEMA_FILE = "schema.sql"

# Ajouter PostgreSQL au PATH pour cette session
$env:Path += ";$POSTGRES_PATH"

Write-Host "Étape 1: Création de la base de données..." -ForegroundColor Yellow

# Créer la base de données (si elle n'existe pas)
& "$POSTGRES_PATH\psql.exe" -U postgres -c "CREATE DATABASE $DB_NAME;" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Base de données '$DB_NAME' créée avec succès" -ForegroundColor Green
} else {
    Write-Host "⚠ La base de données '$DB_NAME' existe déjà" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Étape 2: Création de l'utilisateur..." -ForegroundColor Yellow

# Créer l'utilisateur (si il n'existe pas)
& "$POSTGRES_PATH\psql.exe" -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Utilisateur '$DB_USER' créé avec succès" -ForegroundColor Green
} else {
    Write-Host "⚠ L'utilisateur '$DB_USER' existe déjà" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Étape 3: Attribution des privilèges..." -ForegroundColor Yellow

# Donner tous les privilèges à l'utilisateur
& "$POSTGRES_PATH\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
& "$POSTGRES_PATH\psql.exe" -U postgres -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
& "$POSTGRES_PATH\psql.exe" -U postgres -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
& "$POSTGRES_PATH\psql.exe" -U postgres -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"

Write-Host "✓ Privilèges attribués avec succès" -ForegroundColor Green

Write-Host ""
Write-Host "Étape 4: Import du schéma de base de données..." -ForegroundColor Yellow

# Importer le schéma
if (Test-Path $SCHEMA_FILE) {
    & "$POSTGRES_PATH\psql.exe" -U postgres -d $DB_NAME -f $SCHEMA_FILE
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Schéma importé avec succès" -ForegroundColor Green
    } else {
        Write-Host "✗ Erreur lors de l'import du schéma" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ Fichier schema.sql introuvable" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Étape 5: Vérification de l'installation..." -ForegroundColor Yellow

# Vérifier les tables créées
$tableCount = & "$POSTGRES_PATH\psql.exe" -U postgres -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
Write-Host "✓ Nombre de tables créées: $($tableCount.Trim())" -ForegroundColor Green

Write-Host ""
Write-Host "=== Initialisation terminée avec succès! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Informations de connexion:" -ForegroundColor Cyan
Write-Host "  Base de données: $DB_NAME" -ForegroundColor White
Write-Host "  Utilisateur: $DB_USER" -ForegroundColor White
Write-Host "  Mot de passe: $DB_PASSWORD" -ForegroundColor White
Write-Host "  Hôte: localhost" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host ""
Write-Host "Vous pouvez maintenant démarrer le serveur backend avec:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""

# Made with Bob
