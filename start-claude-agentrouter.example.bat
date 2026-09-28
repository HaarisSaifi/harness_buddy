@echo off
title Claude Code - Agent Router Bridge
color 0a

echo ======================================================================
echo    🌟 CLAUDE CODE VIA AGENT ROUTER BRIDGE
echo    Powered by Agent Router + Zero-WAF Bridge
echo ======================================================================
echo.

:: 1. Ensure Agent Router Bridge is running
curl -s http://127.0.0.1:3085/health >nul 2>&1
if errorlevel 1 (
    echo [INFO] Starting Agent Router Bridge daemon...
    start "" /b node "%~dp0claude-bridge.js"
    timeout /t 2 /nobreak >nul
)

echo [OK] Bridge is active at http://127.0.0.1:3085
echo.

:: 2. Set Claude Code Environment
set "ANTHROPIC_BASE_URL=http://127.0.0.1:3085"
set "ANTHROPIC_API_KEY=YOUR_AGENTROUTER_API_KEY_HERE"
set "ANTHROPIC_AUTH_TOKEN="
set "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1"

echo Starting Claude Code...
echo.

claude
pause
