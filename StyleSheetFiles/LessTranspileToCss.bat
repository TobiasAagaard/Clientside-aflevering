@echo off
setlocal

echo.
echo === Transpilerer/Kompilerer LESS filer ===
call :TranspileLessFiles

echo.
echo === Done transpilering/kompilering af LESS filer ===
pause
exit /b


:TranspileLessFiles
for %%f in (*.less) do (
    echo Behandler %%f...
    where lessc >nul 2>&1
    if errorlevel 1 (
        echo [FEJL] Kommandoen 'lessc' ikke fundet – er LESS installeret?
    ) else (
        call lessc "%%f" "%%~nf.css" >nul 2>&1
        if errorlevel 1 (
            echo [FEJL] Kunne ikke transpilere/kompilere %%f
        ) else (
            echo [OK] %%f transpileret/kompileret til %%~nf.css
        )
    )
)
exit /b
