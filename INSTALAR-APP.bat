@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║  📦 INSTALADOR - Monitor Maternidade TJSE       ║
echo ╚══════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/4] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Instale Node.js em: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js instalado

echo.
echo [2/4] Instalando dependências...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
echo ✓ Dependências instaladas

echo.
echo [3/4] Criando atalhos...
powershell -ExecutionPolicy Bypass -File "%~dp0instalar.ps1"

echo.
echo [4/4] Configuração concluída!
echo.
echo ════════════════════════════════════════════════════
echo.
echo 📍 Atalhos criados:
echo    • Menu Iniciar: Monitor Maternidade TJSE
echo    • Área de trabalho (opcional)
echo.
echo 🚀 Para iniciar: Use o atalho ou execute "iniciar-maternidade.bat"
echo 🔧 Para configurar senha: Clique no ícone → "⚙️ edjan.santos"
echo.
echo ════════════════════════════════════════════════════
echo.
pause
