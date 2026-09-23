@echo off
title ShadowVault AI - Autonomous Workspace Time-Machine
color 0b

echo ===============================================================
echo     SHADOW-VAULT AI: AUTONOMOUS WORKSPACE TIME-MACHINE
echo ===============================================================
echo.
echo [1/2] Launching Background Shadow Vault Daemon...
cd /d "%~dp0\shadow-vault"

echo [2/2] Opening Dashboard in your browser (http://localhost:4567)...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:4567"

echo.
echo ===============================================================
echo  Dashboard Live: http://localhost:4567
echo  Press Ctrl+C in this window if you want to stop the vault.
echo ===============================================================
echo.

node server.js
pause
