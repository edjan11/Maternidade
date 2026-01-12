@echo off
chcp 65001 >nul
color 0A
title 🏥 Maternidade TJSE - Standalone

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              MATERNIDADE TJSE - INICIANDO                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📍 Diretório: %CD%
echo 🕒 Horário: %TIME%
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo ⚠️ Dependências não instaladas!
    echo 📦 Instalando agora...
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências!
        echo.
        echo 💡 Soluções:
        echo    1. Instale o Node.js: https://nodejs.org
        echo    2. Execute como Administrador
        pause
        exit /b 1
    )
)

echo ✅ Dependências OK
echo 🚀 Iniciando Electron...
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  💡 DICA: Feche esta janela para encerrar o programa       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

npm start

if errorlevel 1 (
    echo.
    echo ❌ Erro ao iniciar Maternidade!
    pause
)
