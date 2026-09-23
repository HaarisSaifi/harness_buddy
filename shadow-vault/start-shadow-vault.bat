@echo off
title ShadowVault AI - Workspace Time Machine
color 0b

echo ===============================================================
echo    SHADOWVAULT AI v2.0 - WORKSPACE TIME MACHINE & RESCUE
echo ===============================================================
echo.
echo [1/2] Launching Shadow Vault daemon...
cd /d "%~dp0"

echo [2/2] Opening dashboard in your browser (http://localhost:4567)...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:4567"

echo.
echo ===============================================================
echo  Dashboard Live: http://localhost:4567
echo  Is window me Ctrl+C dabakar vault ko roka ja sakta hai.
echo ===============================================================
echo.

node server.js
pause
