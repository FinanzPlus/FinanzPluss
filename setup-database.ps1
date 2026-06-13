# Script de Configuration de la Base de Données - FinanzPlus Austria
# Exécutez ce script pour créer automatiquement la base de données

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Base de Données" -ForegroundColor Cyan
Write-Host "FinanzPlus Austria" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Chemin vers le fichier SQL
$schemaPath = "C:\Users\ARISTIDE\Desktop\ARISTIDE404\database\schema.sql"

# Vérifier que le fichier existe
if (-Not (Test-Path $schemaPath)) {
    Write-Host "❌ Erreur: Le fichier schema.sql n'existe pas!" -ForegroundColor Red
    Write-Host "Chemin attendu: $schemaPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Fichier schema.sql trouvé" -ForegroundColor Green
Write-Host ""

# Créer la base de données et importer le schéma
Write-Host "Création de la base de données..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Mot de passe PostgreSQL requis (par défaut: postgres)" -ForegroundColor Cyan
Write-Host ""

# Commandes SQL
$sqlCommands = @"
-- Supprimer la base si elle existe déjà
DROP DATABASE IF EXISTS finanzplus_austria;

-- Créer la base de données
CREATE DATABASE finanzplus_austria
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Message de confirmation
\echo 'Base de données finanzplus_austria créée avec succès!'
"@

# Sauvegarder les commandes dans un fichier temporaire
$tempSqlFile = "$env:TEMP\create_db.sql"
$sqlCommands | Out-File -FilePath $tempSqlFile -Encoding UTF8

try {
    # Créer la base de données
    Write-Host "Étape 1/3: Création de la base de données..." -ForegroundColor Yellow
    psql -U postgres -f $tempSqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Base de données créée" -ForegroundColor Green
        Write-Host ""
        
        # Importer le schéma
        Write-Host "Étape 2/3: Importation du schéma..." -ForegroundColor Yellow
        psql -U postgres -d finanzplus_austria -f $schemaPath
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Schéma importé" -ForegroundColor Green
            Write-Host ""
            
            # Vérifier les tables
            Write-Host "Étape 3/3: Vérification des tables..." -ForegroundColor Yellow
            $checkQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
            $tables = psql -U postgres -d finanzplus_austria -t -c $checkQuery
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Tables créées:" -ForegroundColor Green
                $tables -split "`n" | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
                    Write-Host "  - $($_.Trim())" -ForegroundColor White
                }
                Write-Host ""
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host "✓ Configuration terminée avec succès!" -ForegroundColor Green
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Prochaines étapes:" -ForegroundColor Yellow
                Write-Host "1. Redémarrez le backend (Ctrl+C puis 'npm start')" -ForegroundColor White
                Write-Host "2. Testez l'application sur http://localhost:3000" -ForegroundColor White
                Write-Host "3. Créez un compte utilisateur" -ForegroundColor White
                Write-Host ""
            } else {
                Write-Host "⚠ Avertissement: Impossible de vérifier les tables" -ForegroundColor Yellow
            }
        } else {
            Write-Host "❌ Erreur lors de l'importation du schéma" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Erreur lors de la création de la base de données" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
} finally {
    # Nettoyer le fichier temporaire
    if (Test-Path $tempSqlFile) {
        Remove-Item $tempSqlFile -Force
    }
}

Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Made with Bob
