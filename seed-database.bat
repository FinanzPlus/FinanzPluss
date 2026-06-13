@echo off
chcp 65001 >nul
echo ========================================
echo   INSERTION DES DONNEES DE DEMONSTRATION
echo   FinanzPlus Austria
echo ========================================
echo.

set PGPASSWORD=aristide200
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=finanzplus_austria
set DB_USER=postgres

echo Insertion des donnees de demonstration...
echo.

"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f database\seed-data-fixed.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   DONNEES INSEREES AVEC SUCCES!
    echo ========================================
    echo.
    echo Contenu ajoute:
    echo   - 5 voitures (BMW, Mercedes, Audi, VW, Porsche^)
    echo   - 8 meubles (canapes, tables, lits, etc.^)
    echo   - 4 offres financieres
    echo   - Horaires d'ouverture
    echo   - Images de demonstration
    echo.
    echo Vous pouvez maintenant tester l'application!
    echo Accedez a: http://localhost:3000
) else (
    echo.
    echo ERREUR lors de l'insertion des donnees!
    echo Code d'erreur: %ERRORLEVEL%
)

set PGPASSWORD=

echo.
pause

@REM Made with Bob
