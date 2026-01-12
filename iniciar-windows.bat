@echo off
REM ========================================
REM   Monitor Maternidade TJSE - RCPN
REM   Inicializacao Automatica Windows
REM   Funciona em qualquer PC!
REM ========================================

cd /d "%~dp0"

echo.
echo ========================================
echo   Monitor Maternidade TJSE - INICIANDO
echo ========================================
echo.
echo Detectando configuracoes...
echo - Chrome: Deteccao automatica
echo - Perfil: Usuario atual do Windows
echo - Caminho: %~dp0
echo.

REM Verifica se node_modules existe
if not exist "node_modules\" (
    echo [ATENCAO] Dependencias nao instaladas!
    echo Execute o arquivo INSTALAR.bat primeiro.
    echo.
    pause
    exit /b 1
)

echo Iniciando monitor em segundo plano...
echo.

REM Inicia o Electron em modo silencioso
start /min "" npm start

REM Aguarda 3 segundos para garantir que iniciou
timeout /t 3 /nobreak >nul

echo ========================================
echo   MONITOR INICIADO COM SUCESSO!
echo ========================================
echo.
echo Verifique o icone na bandeja do sistema
echo (canto inferior direito da tela)
echo.
echo Icone Verde: Sistema online
echo Icone Amarelo: NOVA SOLICITACAO!
echo.
echo ========================================
echo.

REM Fecha esta janela automaticamente
exit
