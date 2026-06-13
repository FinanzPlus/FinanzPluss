@echo off
chcp 65001 >nul
echo ========================================
echo   INITIALISATION BASE DE DONNÉES
echo   FinanzPlus Austria
echo ========================================
echo.
echo Ce script va créer la base de données et importer le schéma.
echo.
echo IMPORTANT: Vous devrez entrer votre mot de passe PostgreSQL
echo            plusieurs fois (c'est normal).
echo.
pause
echo.

set PGPATH=C:\Program Files\PostgreSQL\18\bin
set PGUSER=postgres
set DBNAME=finanzplus_austria

echo [1/4] Création de la base de données...
echo.
"%PGPATH%\createdb.exe" -U %PGUSER% %DBNAME%
if %ERRORLEVEL% EQU 0 (
    echo ✓ Base de données créée avec succès
) else (
    echo ⚠ La base de données existe peut-être déjà (c'est OK)
)
echo.

echo [2/4] Création de l'utilisateur finanzplus_user...
echo.
"%PGPATH%\psql.exe" -U %PGUSER% -c "CREATE USER finanzplus_user WITH PASSWORD 'FinanzPlus2024!Secure';"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Utilisateur créé avec succès
) else (
    echo ⚠ L'utilisateur existe peut-être déjà (c'est OK)
)
echo.

echo [3/4] Attribution des privilèges...
echo.
"%PGPATH%\psql.exe" -U %PGUSER% -c "GRANT ALL PRIVILEGES ON DATABASE %DBNAME% TO finanzplus_user;"
"%PGPATH%\psql.exe" -U %PGUSER% -d %DBNAME% -c "GRANT ALL ON SCHEMA public TO finanzplus_user;"
echo ✓ Privilèges attribués
echo.

echo [4/4] Import du schéma (cela peut prendre 30 secondes)...
echo.
cd database
"%PGPATH%\psql.exe" -U %PGUSER% -d %DBNAME% -f schema.sql
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✓ INITIALISATION RÉUSSIE !
    echo ========================================
    echo.
    echo La base de données est prête.
    echo.
    echo Prochaines étapes:
    echo   1. Démarrer le backend:
    echo      cd backend
    echo      npm run dev
    echo.
    echo   2. Démarrer le frontend (dans un autre terminal):
    echo      cd frontend
    echo      npm run dev
    echo.
    echo   3. Ouvrir http://localhost:3000 dans votre navigateur
    echo.
) else (
    echo.
    echo ========================================
    echo   ✗ ERREUR LORS DE L'IMPORT
    echo ========================================
    echo.
    echo Vérifiez que:
    echo   - PostgreSQL est démarré
    echo   - Le mot de passe est correct
    echo   - Le fichier database/schema.sql existe
    echo.
)

pause

@REM Made with Bob
