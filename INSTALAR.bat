@echo off
REM ========================================
REM   INSTALADOR AUTOMATICO - MATERNIDADE TJSE
REM   Funciona em qualquer PC Windows
REM ========================================

echo.
echo ========================================
echo   INSTALADOR MONITOR MATERNIDADE TJSE
echo ========================================
echo.

REM Verifica se o Node.js esta instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado: 
node --version
echo.

REM Navega para a pasta do projeto
cd /d "%~dp0"

echo Instalando dependencias...
echo.
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Opcoes de inicializacao:
echo.
echo 1) MANUAL: Execute "iniciar-windows.bat"
echo 2) AUTOMATICO: Siga o guia "INICIAR-COM-WINDOWS.md"
echo.
echo ========================================
echo.

pause
