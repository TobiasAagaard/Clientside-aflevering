@echo off
setlocal

echo.
echo === Transpilerer/Kompilerer TS filer ===
call :TranspileTSFiles

echo.
echo === Done transpiling/kompilering af TS filer ===
pause
exit /b


:TranspileTSFiles
for %%f in (*.ts) do (
    echo Behandler %%f...
    where tsc >nul 2>&1
    if errorlevel 1 (
        echo [FEJL] Kommandoen 'tsc' ikke fundet – er Typescript installeret?
    ) else (
        call tsc "%%f"  >nul 2>&1
        if errorlevel 1 (
            echo [FEJL] Kunne ikke transpilere %%f
        ) else (
            echo [OK] %%f transpileret til %%~nf.js
        )
    )
)
exit /b
