@echo off
echo ========================================
echo Initialisation Base de Donnees FinanzPlus Austria
echo ========================================
echo.

set PGPATH=C:\Program Files\PostgreSQL\18\bin
set PGPASSWORD=votre_mot_de_passe_postgres

echo Etape 1: Creation de la base de donnees...
"%PGPATH%\psql.exe" -U postgres -c "CREATE DATABASE finanzplus_austria;"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Base de donnees creee
) else (
    echo [INFO] La base existe deja
)

echo.
echo Etape 2: Creation de l'utilisateur...
"%PGPATH%\psql.exe" -U postgres -c "CREATE USER finanzplus_user WITH PASSWORD 'FinanzPlus2024!Secure';"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Utilisateur cree
) else (
    echo [INFO] L'utilisateur existe deja
)

echo.
echo Etape 3: Attribution des privileges...
"%PGPATH%\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE finanzplus_austria TO finanzplus_user;"
"%PGPATH%\psql.exe" -U postgres -d finanzplus_austria -c "GRANT ALL ON SCHEMA public TO finanzplus_user;"

echo.
echo Etape 4: Import du schema...
"%PGPATH%\psql.exe" -U postgres -d finanzplus_austria -f schema.sql
if %ERRORLEVEL% EQU 0 (
    echo [OK] Schema importe avec succes
) else (
    echo [ERREUR] Probleme lors de l'import
    pause
    exit /b 1
)

echo.
echo ========================================
echo Initialisation terminee avec succes!
echo ========================================
echo.
echo Vous pouvez maintenant demarrer le serveur backend:
echo   cd backend
echo   npm run dev
echo.
pause

@REM Made with Bob
