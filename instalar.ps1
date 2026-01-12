# Script de Instalação - Monitor Maternidade TJSE
# Cria atalhos e configura a aplicação

$ErrorActionPreference = "Stop"
$currentPath = $PSScriptRoot
$appName = "Monitor Maternidade TJSE"
$exeName = "iniciar-maternidade.bat"
$iconPath = Join-Path $currentPath "icons\maternidade-ok.ico"

Write-Host ""
Write-Host "Criando atalhos..." -ForegroundColor Cyan

# Cria objeto WScript Shell
$WScriptShell = New-Object -ComObject WScript.Shell

# 1. Atalho no Menu Iniciar
try {
    $startMenuPath = [Environment]::GetFolderPath("StartMenu")
    $shortcutPath = Join-Path $startMenuPath "$appName.lnk"
    
    $shortcut = $WScriptShell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = Join-Path $currentPath $exeName
    $shortcut.WorkingDirectory = $currentPath
    $shortcut.Description = "Monitor de solicitações de maternidade do TJSE"
    
    if (Test-Path $iconPath) {
        $shortcut.IconLocation = $iconPath
    }
    
    $shortcut.Save()
    Write-Host "✓ Atalho criado no Menu Iniciar" -ForegroundColor Green
} catch {
    Write-Host "⚠ Erro ao criar atalho no Menu Iniciar: $_" -ForegroundColor Yellow
}

# 2. Pergunta sobre atalho na Área de Trabalho
Write-Host ""
$createDesktop = Read-Host "Criar atalho na Área de Trabalho? (S/N)"
if ($createDesktop -eq "S" -or $createDesktop -eq "s") {
    try {
        $desktopPath = [Environment]::GetFolderPath("Desktop")
        $shortcutPath = Join-Path $desktopPath "$appName.lnk"
        
        $shortcut = $WScriptShell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = Join-Path $currentPath $exeName
        $shortcut.WorkingDirectory = $currentPath
        $shortcut.Description = "Monitor de solicitações de maternidade do TJSE"
        
        if (Test-Path $iconPath) {
            $shortcut.IconLocation = $iconPath
        }
        
        $shortcut.Save()
        Write-Host "✓ Atalho criado na Área de Trabalho" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Erro ao criar atalho na Área de Trabalho: $_" -ForegroundColor Yellow
    }
}

# 3. Pergunta sobre iniciar com o Windows
Write-Host ""
$startWithWindows = Read-Host "Iniciar automaticamente com o Windows? (S/N)"
if ($startWithWindows -eq "S" -or $startWithWindows -eq "s") {
    try {
        $startupPath = [Environment]::GetFolderPath("Startup")
        $shortcutPath = Join-Path $startupPath "$appName.lnk"
        
        $shortcut = $WScriptShell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = Join-Path $currentPath $exeName
        $shortcut.WorkingDirectory = $currentPath
        $shortcut.WindowStyle = 7  # Minimizado
        
        if (Test-Path $iconPath) {
            $shortcut.IconLocation = $iconPath
        }
        
        $shortcut.Save()
        Write-Host "✓ Configurado para iniciar com o Windows" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Erro ao configurar inicialização: $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Instalação concluída!" -ForegroundColor Green
