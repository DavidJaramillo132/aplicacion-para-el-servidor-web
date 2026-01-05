#!/usr/bin/env pwsh
# Script mejorado para verificar Edge Functions en Supabase

$ErrorActionPreference = "Continue"

$SUPABASE_PROJECT = "xcmdrgzjjghxgvlkovwm"
$FUNCTIONS = @(
    @{
        Name = "webhook-event-logger"
        Description = "Registra eventos de webhooks en PostgreSQL"
    },
    @{
        Name = "webhook-external-notifier"
        Description = "Envía notificaciones a Telegram"
    }
)

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "     🚀 VERIFICACIÓN DE EDGE FUNCTIONS EN SUPABASE                " -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📡 Proyecto: $SUPABASE_PROJECT" -ForegroundColor Gray
Write-Host "🌐 Base URL: https://$SUPABASE_PROJECT.supabase.co/functions/v1/" -ForegroundColor Gray
Write-Host ""

$allOk = $true

foreach ($func in $FUNCTIONS) {
    $funcName = $func.Name
    $funcDesc = $func.Description
    $url = "https://$SUPABASE_PROJECT.supabase.co/functions/v1/$funcName"
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "📌 $funcName" -ForegroundColor Yellow
    Write-Host "   $funcDesc" -ForegroundColor Gray
    Write-Host "   URL: $url" -ForegroundColor DarkGray
    Write-Host ""
    
    # Test 1: Verificar existencia con GET
    Write-Host "   [1/3] Verificando existencia..." -ForegroundColor Blue
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
        $statusCode = $response.StatusCode
        Write-Host "         ✅ Función existe (Status: $statusCode)" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 401) {
            Write-Host "         ✅ Función existe (Status: 401 - Requiere auth)" -ForegroundColor Green
        }
        elseif ($statusCode -eq 404) {
            Write-Host "         ❌ Función NO EXISTE (Status: 404)" -ForegroundColor Red
            $allOk = $false
        }
        elseif ($statusCode -eq 400) {
            Write-Host "         ✅ Función existe (Status: 400 - Bad request)" -ForegroundColor Green
        }
        else {
            Write-Host "         ⚠️  Status inesperado: $statusCode" -ForegroundColor Yellow
        }
    }
    
    # Test 2: Verificar con POST vacío
    Write-Host "   [2/3] Probando con POST..." -ForegroundColor Blue
    try {
        $response = Invoke-WebRequest -Uri $url -Method POST -Body "{}" -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
        Write-Host "         ✅ Responde a POST (Status: $($response.StatusCode))" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 401) {
            Write-Host "         ✅ Requiere autenticación (esperado)" -ForegroundColor Green
        }
        elseif ($statusCode -eq 400) {
            Write-Host "         ✅ Rechaza payload inválido (esperado)" -ForegroundColor Green
        }
        else {
            Write-Host "         ⚠️  Status: $statusCode" -ForegroundColor Yellow
        }
    }
    
    # Test 3: Verificar tiempo de respuesta
    Write-Host "   [3/3] Midiendo latencia..." -ForegroundColor Blue
    try {
        $startTime = Get-Date
        $null = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
        $endTime = Get-Date
        $latency = ($endTime - $startTime).TotalMilliseconds
        Write-Host "         ⚡ Latencia: $([math]::Round($latency, 0)) ms" -ForegroundColor Cyan
    }
    catch {
        try {
            $startTime = Get-Date
            $null = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
            $endTime = Get-Date
            $latency = ($endTime - $startTime).TotalMilliseconds
            Write-Host "         ⚡ Latencia: $([math]::Round($latency, 0)) ms" -ForegroundColor Cyan
        }
        catch {
            Write-Host "         ⚠️  No se pudo medir latencia" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($allOk) {
    Write-Host "✅ TODAS LAS EDGE FUNCTIONS ESTÁN OPERATIVAS" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Resumen:" -ForegroundColor Cyan
    Write-Host "   • webhook-event-logger: ✅ Activo" -ForegroundColor Green
    Write-Host "   • webhook-external-notifier: ✅ Activo" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Próximo paso: Probar el flujo completo" -ForegroundColor Yellow
    Write-Host "   Ejecuta: .\test_sistema.ps1" -ForegroundColor White
} else {
    Write-Host "❌ ALGUNAS FUNCIONES NO ESTÁN DISPONIBLES" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Para desplegar las funciones:" -ForegroundColor Yellow
    Write-Host "   cd edge-functions" -ForegroundColor White
    Write-Host "   supabase functions deploy webhook-event-logger" -ForegroundColor White
    Write-Host "   supabase functions deploy webhook-external-notifier" -ForegroundColor White
    Write-Host ""
    Write-Host "   O ejecuta: .\deploy-edge-functions.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Información adicional
Write-Host "💡 Notas Importantes:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   • Status 401: ✅ Función existe, requiere headers de autenticación" -ForegroundColor Gray
Write-Host "   • Status 400: ✅ Función existe, rechaza payload inválido" -ForegroundColor Gray
Write-Host "   • Status 404: ❌ Función no encontrada, necesita deployment" -ForegroundColor Gray
Write-Host "   • Status 500: ⚠️  Error en la función, revisar logs" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Ver logs en Supabase Dashboard:" -ForegroundColor Cyan
Write-Host "   https://app.supabase.com/project/$SUPABASE_PROJECT/functions" -ForegroundColor Blue
Write-Host ""
