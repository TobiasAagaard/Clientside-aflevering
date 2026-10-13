@echo off
setlocal

echo === Transpilerer/Kompilerer SCSS og SASS filer ===
call :TranspileScss_SassFiles

echo.
echo === Done kompilering af SCSS/SASS filer ===
pause
exit /b


:TranspileScss_SassFiles
for %%f in (*.scss *.sass) do (
    echo Behandler %%f...
    sass "%%f" "%%~nf.css" >nul 2>&1
    if errorlevel 1 (
        echo [FEJL] Kunne ikke transpilere/kompilere %%f
    ) else (
        echo [OK] %%f transpileret/kompileret til %%~nf.css
    )
)

exit /b
