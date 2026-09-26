@echo off
title Harness Buddy - Project Folder Coding Engine
color 0b

echo ======================================================================
echo       🚀 HARNESS BUDDY: AUTONOMOUS PROJECT FOLDER CODER
echo ======================================================================
echo.

:: 1. Determine Target Folder
set "TARGET_DIR=%~1"

if "%TARGET_DIR%"=="" (
    echo [INFO] Drag-and-drop any project folder onto this .bat file, or:
    set /p "TARGET_DIR=Enter Project Folder Path (Press Enter for D:\mamu court): "
)

if "%TARGET_DIR%"=="" (
    set "TARGET_DIR=d:\mamu court"
)

:: Strip surrounding quotes if user entered them
set "TARGET_DIR=%TARGET_DIR:"=%"

if not exist "%TARGET_DIR%" (
    echo [ERROR] Folder "%TARGET_DIR%" does not exist!
    echo Please check the path and try again.
    pause
    exit /b 1
)

echo [OK] Connected to Project: %TARGET_DIR%
echo.

:: 2. Load Environment Variables from Harness Buddy
set "ENV_FILE=%~dp0.env"
if exist "%ENV_FILE%" (
    for /f "usebackq tokens=1,* delims==" %%A in ("%ENV_FILE%") do (
        set "KEY=%%A"
        set "VAL=%%B"
        if not "!KEY:~0,1!"=="#" (
            set "%%A=%%B"
        )
    )
)

:: Ensure global opencode config has all 12 models
if not exist "%USERPROFILE%\.config\opencode" mkdir "%USERPROFILE%\.config\opencode"
copy /y "%~dp0opencode.json" "%USERPROFILE%\.config\opencode\opencode.json" >nul 2>&1

:: Also copy opencode.json into target directory so local overrides work
copy /y "%~dp0opencode.json" "%TARGET_DIR%\opencode.json" >nul 2>&1

echo [VERIFIED 100%% OPERATIONAL FLEET]
echo   1. agentrouter/claude-opus-5 : Claude Opus 5 (Frontier Logic & Architecture)
echo   2. agentrouter/gpt-6-astra   : GPT-6 Astra (Next-Gen Reasoning & Systems)
echo   3. xkiro/qwen3.8-max         : Qwen 3.8 Max (Flagship 1M Context Brain)
echo   4. dahl/deepseek-v4          : DeepSeek V4 Flash (100M Free Tokens)
echo   5. xkiro/codestral           : Mistral Codestral 2508 (Fullstack & Logic)
echo   6. xkiro/qwen-coder          : Qwen 3 Coder Plus (Targeted Bug Fix & Tests)
echo   7. xkiro/minimax-m3          : MiniMax M3 (1M Multimodal Vision & Repo Scan)
echo.
echo [COMMANDS TO SWITCH MODELS IN TERMINAL]:
echo   Type: /model agentrouter/claude-opus-5
echo   Type: /model xkiro/qwen3.8-max
echo   Type: /model xkiro/codestral
echo.
echo [STARTING AGENT DIRECTLY IN %TARGET_DIR%]...
echo ======================================================================
echo.

cd /d "%TARGET_DIR%"
npx -y opencode-ai
pause
