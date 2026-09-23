@echo off
title DeepSeek Harness Web Control Center (localhost:3080)
color 0B
echo ======================================================================
echo           DEEPSEEK HARNESS WEB CONTROL CENTER (SUPER OS ENGINE)
echo ======================================================================
echo.
echo [INFO] Starting Web UI Server at http://127.0.0.1:3080 ...
echo [INFO] Close this window to stop the server.
echo.
cd /d "%~dp0"
if exist "dsh-engine\apps\cli\lib\bin.js" (
  node dsh-engine\apps\cli\lib\bin.js web --port 3080
) else (
  npx -y @deepseek-ai/dsh web --port 3080
)
pause
