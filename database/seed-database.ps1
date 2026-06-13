# Script PowerShell pour insérer les données de démonstration
# FinanzPlus Austria - Seed Database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSERTION DES DONNEES DE DEMONSTRATION" -ForegroundColor Cyan
Write-Host "  FinanzPlus Austria" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "finanzplus_austria"
$DB_USER = "postgres"
$SCRIPT_PATH = "database/seed-data.sql"

# Demander le mot de passe
Write-Host "Veuillez entrer le mot de passe PostgreSQL:" -ForegroundColor Yellow
$DB_PASSWORD = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Définir la variable d'environnement pour le mot de passe
$env:PGPASSWORD = $PlainPassword

Write-Host ""
Write-Host "Insertion des donnees de demonstration..." -ForegroundColor Green

try {
    # Exécuter le script SQL
    & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SCRIPT_PATH
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  DONNEES INSEREES AVEC SUCCES!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Contenu ajoute:" -ForegroundColor Cyan
        Write-Host "  - 5 voitures (BMW, Mercedes, Audi, VW, Porsche)" -ForegroundColor White
        Write-Host "  - 8 meubles (canapes, tables, lits, etc.)" -ForegroundColor White
        Write-Host "  - 4 offres financieres" -ForegroundColor White
        Write-Host "  - Horaires d'ouverture" -ForegroundColor White
        Write-Host "  - Images de demonstration" -ForegroundColor White
        Write-Host ""
        Write-Host "Vous pouvez maintenant tester l'application!" -ForegroundColor Green
        Write-Host "Accedez a: http://localhost:3000" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "ERREUR lors de l'insertion des donnees!" -ForegroundColor Red
        Write-Host "Code d'erreur: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "ERREUR: $_" -ForegroundColor Red
} finally {
    # Nettoyer la variable d'environnement
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Made with Bob
