@echo off
chcp 65001 >nul
echo ========================================
echo   AJOUT DES COMMENTAIRES
echo   FinanzPlus Austria
echo ========================================
echo.

set PGPASSWORD=aristide200
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=finanzplus_austria
set DB_USER=postgres

echo Ajout des commentaires de demonstration...
echo.

"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f database\add-comments.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   COMMENTAIRES AJOUTES AVEC SUCCES!
    echo ========================================
    echo.
    echo Les commentaires clients sont maintenant visibles sur les produits!
) else (
    echo.
    echo ERREUR lors de l'ajout des commentaires!
    echo Code d'erreur: %ERRORLEVEL%
)

set PGPASSWORD=

echo.
pause

@REM Made with Bob
