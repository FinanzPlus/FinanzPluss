@echo off
echo ========================================
echo FinanzPlus Austria - Migration Database
echo ========================================
echo.

set PGPASSWORD=aristide200
set PSQL="C:\Program Files\PostgreSQL\18\bin\psql.exe"
set DB_NAME=finanzplus_austria
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo [1/4] Verification de la connexion...
%PSQL% -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT version();" > nul 2>&1
if errorlevel 1 (
    echo ERREUR: Impossible de se connecter a la base de donnees
    echo Verifiez que PostgreSQL est demarre et que les identifiants sont corrects
    pause
    exit /b 1
)
echo OK - Connexion etablie

echo.
echo [2/4] Execution Migration 001 - Nettoyage tables e-commerce...
%PSQL% -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migrations/001_cleanup_old_tables.sql"
if errorlevel 1 (
    echo ERREUR lors de la migration 001
    pause
    exit /b 1
)
echo OK - Migration 001 terminee

echo.
echo [3/4] Execution Migration 002 - Creation nouveau schema...
%PSQL% -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migrations/002_create_new_schema.sql"
if errorlevel 1 (
    echo ERREUR lors de la migration 002
    pause
    exit /b 1
)
echo OK - Migration 002 terminee

echo.
echo [4/4] Execution Migration 003 - Donnees initiales...
%PSQL% -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migrations/003_seed_initial_data.sql"
if errorlevel 1 (
    echo ERREUR lors de la migration 003
    pause
    exit /b 1
)
echo OK - Migration 003 terminee

echo.
echo ========================================
echo MIGRATION TERMINEE AVEC SUCCES!
echo ========================================
echo.
echo La base de donnees est prete pour la plateforme financiere
echo.
echo Prochaines etapes:
echo 1. Verifier les donnees avec: psql -U postgres -d finanzplus_austria
echo 2. Demarrer le backend: cd backend ^&^& npm run dev
echo 3. Demarrer le frontend: cd frontend ^&^& npm run dev
echo.

set PGPASSWORD=
pause

@REM Made with Bob
