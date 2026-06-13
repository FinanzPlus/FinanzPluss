# Script d'initialisation automatique de la base de donnees
# FinanzPlus Austria

Write-Host "========================================"
Write-Host "  INITIALISATION BASE DE DONNEES"
Write-Host "  FinanzPlus Austria"
Write-Host "========================================"
Write-Host ""

$PGPATH = "C:\Program Files\PostgreSQL\18\bin"
$PGPASSWORD = "aristide200"
$PGUSER = "postgres"
$DBNAME = "finanzplus_austria"
$DBUSER = "finanzplus_user"
$DBPASS = "FinanzPlus2024!Secure"

# Definir la variable d'environnement pour le mot de passe
$env:PGPASSWORD = $PGPASSWORD

Write-Host "[1/4] Creation de la base de donnees..."
& "$PGPATH\createdb.exe" -U $PGUSER $DBNAME 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Base de donnees creee avec succes"
} else {
    Write-Host "[INFO] La base de donnees existe peut-etre deja"
}
Write-Host ""

Write-Host "[2/4] Creation de l'utilisateur..."
& "$PGPATH\psql.exe" -U $PGUSER -c "CREATE USER $DBUSER WITH PASSWORD '$DBPASS';" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Utilisateur cree avec succes"
} else {
    Write-Host "[INFO] L'utilisateur existe peut-etre deja"
}
Write-Host ""

Write-Host "[3/4] Attribution des privileges..."
& "$PGPATH\psql.exe" -U $PGUSER -c "GRANT ALL PRIVILEGES ON DATABASE $DBNAME TO $DBUSER;" 2>$null
& "$PGPATH\psql.exe" -U $PGUSER -d $DBNAME -c "GRANT ALL ON SCHEMA public TO $DBUSER;" 2>$null
& "$PGPATH\psql.exe" -U $PGUSER -d $DBNAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DBUSER;" 2>$null
& "$PGPATH\psql.exe" -U $PGUSER -d $DBNAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DBUSER;" 2>$null
Write-Host "[OK] Privileges attribues"
Write-Host ""

Write-Host "[4/4] Import du schema (cela peut prendre 30 secondes)..."
if (Test-Path "database\schema.sql") {
    & "$PGPATH\psql.exe" -U $PGUSER -d $DBNAME -f "database\schema.sql" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Schema importe avec succes"
        Write-Host ""
        Write-Host "========================================"
        Write-Host "  INITIALISATION REUSSIE !"
        Write-Host "========================================"
        Write-Host ""
        Write-Host "La base de donnees est prete."
        Write-Host ""
        Write-Host "Prochaines etapes:"
        Write-Host "  1. Demarrer le backend:"
        Write-Host "     cd backend"
        Write-Host "     npm run dev"
        Write-Host ""
        Write-Host "  2. Demarrer le frontend (dans un autre terminal):"
        Write-Host "     cd frontend"
        Write-Host "     npm run dev"
        Write-Host ""
        Write-Host "  3. Ouvrir http://localhost:3000 dans votre navigateur"
        Write-Host ""
    } else {
        Write-Host "[ERREUR] Erreur lors de l'import du schema"
        Write-Host "Verifiez les logs ci-dessus pour plus de details"
    }
} else {
    Write-Host "[ERREUR] Fichier database\schema.sql introuvable"
}

# Nettoyer la variable d'environnement
Remove-Item Env:\PGPASSWORD

# Made with Bob
