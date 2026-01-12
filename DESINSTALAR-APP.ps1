# Script de Desinstalação - Monitor Maternidade TJSE

$ErrorActionPreference = "Stop"
$appName = "Monitor Maternidade TJSE"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║  🗑️  DESINSTALADOR - Monitor Maternidade TJSE   ║" -ForegroundColor Red
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Deseja remover o Monitor Maternidade TJSE? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Removendo atalhos..." -ForegroundColor Cyan

$removed = 0

# Remove do Menu Iniciar
try {
    $startMenuPath = [Environment]::GetFolderPath("StartMenu")
    $shortcutPath = Join-Path $startMenuPath "$appName.lnk"
    if (Test-Path $shortcutPath) {
        Remove-Item $shortcutPath -Force
        Write-Host "✓ Removido do Menu Iniciar" -ForegroundColor Green
        $removed++
    }
} catch {
    Write-Host "⚠ Erro ao remover do Menu Iniciar: $_" -ForegroundColor Yellow
}

# Remove da Área de Trabalho
try {
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = Join-Path $desktopPath "$appName.lnk"
    if (Test-Path $shortcutPath) {
        Remove-Item $shortcutPath -Force
        Write-Host "✓ Removido da Área de Trabalho" -ForegroundColor Green
        $removed++
    }
} catch {
    Write-Host "⚠ Erro ao remover da Área de Trabalho: $_" -ForegroundColor Yellow
}

# Remove da Inicialização
try {
    $startupPath = [Environment]::GetFolderPath("Startup")
    $shortcutPath = Join-Path $startupPath "$appName.lnk"
    if (Test-Path $shortcutPath) {
        Remove-Item $shortcutPath -Force
        Write-Host "✓ Removido da Inicialização" -ForegroundColor Green
        $removed++
    }
} catch {
    Write-Host "⚠ Erro ao remover da Inicialização: $_" -ForegroundColor Yellow
}

Write-Host ""
if ($removed -eq 0) {
    Write-Host "Nenhum atalho encontrado." -ForegroundColor Yellow
} else {
    Write-Host "Desinstalação concluída! ($removed atalho(s) removido(s))" -ForegroundColor Green
}

Write-Host ""
Write-Host "NOTA: Os arquivos do aplicativo permanecem na pasta atual." -ForegroundColor Cyan
Write-Host "      Para remover completamente, delete a pasta manualmente." -ForegroundColor Cyan
Write-Host ""

Read-Host "Pressione ENTER para sair"
