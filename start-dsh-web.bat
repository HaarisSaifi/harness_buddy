@echo off
title Harness Buddy AI Studio (localhost:3080)
color 0B
echo ======================================================================
echo           🚀 HARNESS BUDDY: MASTER AI AGENT STUDIO & CHAT
echo ======================================================================
echo.
echo [1/2] Opening AI Studio in your default browser...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://127.0.0.1:3080"
echo.
echo [2/2] Launching Fast Studio Server at http://127.0.0.1:3080 ...
echo [INFO] Close this window to stop the server.
echo ======================================================================
echo.
cd /d "%~dp0\dsh-studio"
node server.js
pause
