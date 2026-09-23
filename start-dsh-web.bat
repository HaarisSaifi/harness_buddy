@echo off
title Harness Buddy Web Control Center (localhost:3080)
color 0B
echo ======================================================================
echo           🚀 HARNESS BUDDY WEB CONTROL CENTER & AI DASHBOARD
echo ======================================================================
echo.
echo [1/2] Opening Web Dashboard in your default browser...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://127.0.0.1:3080"
echo.
echo [2/2] Launching Fast Web Server at http://127.0.0.1:3080 ...
echo [INFO] Close this window to stop the server.
echo ======================================================================
echo.
cd /d "%~dp0"
opencode web --port 3080
pause
