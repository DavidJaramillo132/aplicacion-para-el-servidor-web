#!/usr/bin/env pwsh
# Script para esperar a que Docker esté completamente inicializado

Write-Host "🐳 Iniciando Docker Desktop..." -ForegroundColor Cyan

# Intenta iniciar Docker Desktop
$dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerPath) {
    Write-Host "Lanzando Docker Desktop..." -ForegroundColor Yellow
    & $dockerPath | Out-Null
} else {
    Write-Host "⚠️  Docker Desktop no encontrado en ruta estándar" -ForegroundColor Yellow
    Write-Host "Por favor, abre Docker Desktop manualmente desde el menú Inicio"
}

Write-Host "Esperando a que Docker esté listo (máximo 3 minutos)..." -ForegroundColor Cyan
$maxAttempts = 36  # 3 minutos con intervalos de 5 segundos
$attempt = 0

do {
    $attempt++
    Start-Sleep -Seconds 5
    
    # Intenta ejecutar un comando simple de Docker
    $output = docker ps 2>&1
    $connected = $LASTEXITCODE -eq 0
    
    if ($connected) {
        Write-Host "✅ Docker conectado exitosamente después de $($attempt * 5) segundos" -ForegroundColor Green
        return $true
    }
    
    $progress = [math]::Round(($attempt / $maxAttempts) * 100)
    Write-Host "   ⏳ Intento $attempt/$maxAttempts ($progress%) - Esperando a Docker..." -ForegroundColor Gray -NoNewline
    Write-Host ""
    
    if ($attempt % 6 -eq 0) {
        Write-Host "   Docker aún no disponible, continuando..." -ForegroundColor Gray
    }
    
} while ($attempt -lt $maxAttempts -and -not $connected)

if (-not $connected) {
    Write-Host ""
    Write-Host "❌ Docker no se conectó después de 3 minutos" -ForegroundColor Red
    Write-Host ""
    Write-Host "Soluciones:" -ForegroundColor Yellow
    Write-Host "1. Abre Docker Desktop manualmente (busca en Inicio)"
    Write-Host "2. Espera a que esté completamente inicializado"
    Write-Host "3. Ejecuta nuevamente este script"
    Write-Host "4. Si el problema persiste, reinicia tu computadora"
    return $false
}
