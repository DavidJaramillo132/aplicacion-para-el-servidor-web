#!/usr/bin/env pwsh

<#
.SYNOPSIS
Despliega Edge Functions a Supabase usando Supabase CLI

.DESCRIPTION
Script para descargar, desplegar y probar Edge Functions en Supabase
- Descarga funciones existentes
- Despliega nuevas versiones
- Prueba endpoints con cURL

.EXAMPLE
.\deploy-edge-functions.ps1
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "deploy", # deploy, download, delete, test
    
    [Parameter(Mandatory=$false)]
    [string]$Function = "all" # all, webhook-event-logger, webhook-external-notifier
)

$ErrorActionPreference = "Stop"

# Configuración
$SUPABASE_PROJECT = "xcmdrgzjjghxgvlkovwm"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbWRyZ3pqamdoeGd2bGtvdndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjA4NjAsImV4cCI6MjA4MTMzNjg2MH0.m8KBeomApgJm_5aIE_vvFU825WcImkOXV_cT0VvpJHc"
$SUPABASE_URL = "https://$SUPABASE_PROJECT.supabase.co"

$FUNCTIONS = @(
    "webhook-event-logger",
    "webhook-external-notifier"
)

# Colores
$Colors = @{
    Green   = "`e[32m"
    Red     = "`e[31m"
    Yellow  = "`e[33m"
    Blue    = "`e[34m"
    Cyan    = "`e[36m"
    Reset   = "`e[0m"
}

function Write-Color {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "$($Colors[$Color])$Message$($Colors.Reset)"
}

function Show-Banner {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║          🚀 DEPLOYMENT: EDGE FUNCTIONS TO SUPABASE             ║" -ForegroundColor Cyan
    Write-Host "║                    Project: $SUPABASE_PROJECT               ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Check-Supabase {
    Write-Color "`n📋 Verificando Supabase CLI..." "Yellow"
    
    try {
        $version = supabase --version 2>&1
        Write-Color "✅ Supabase CLI encontrado: $version" "Green"
        return $true
    }
    catch {
        Write-Color "❌ Supabase CLI no está instalado" "Red"
        Write-Color "   Instálalo con: npm install -g @supabase/cli" "Yellow"
        return $false
    }
}

function Download-Function {
    param([string]$FunctionName)
    
    Write-Color "`n📥 Descargando: $FunctionName..." "Blue"
    
    try {
        supabase functions download $FunctionName --project-id $SUPABASE_PROJECT
        Write-Color "✅ Descargado: $FunctionName" "Green"
        return $true
    }
    catch {
        Write-Color "⚠️  No se pudo descargar (probablemente no existe aún): $FunctionName" "Yellow"
        return $false
    }
}

function Deploy-Function {
    param([string]$FunctionName)
    
    Write-Color "`n🚀 Desplegando: $FunctionName..." "Blue"
    
    try {
        supabase functions deploy $FunctionName --project-id $SUPABASE_PROJECT
        Write-Color "✅ Desplegado: $FunctionName" "Green"
        return $true
    }
    catch {
        Write-Color "❌ Error al desplegar: $FunctionName" "Red"
        Write-Color "   Error: $_" "Red"
        return $false
    }
}

function Delete-Function {
    param([string]$FunctionName)
    
    Write-Color "`n🗑️  Eliminando: $FunctionName..." "Yellow"
    
    try {
        supabase functions delete $FunctionName --project-id $SUPABASE_PROJECT
        Write-Color "✅ Eliminado: $FunctionName" "Green"
        return $true
    }
    catch {
        Write-Color "❌ Error al eliminar: $FunctionName" "Red"
        return $false
    }
}

function Test-Endpoint {
    param([string]$FunctionName)
    
    Write-Color "`n🧪 Probando: $FunctionName..." "Blue"
    
    $url = "$SUPABASE_URL/functions/v1/$FunctionName"
    $headers = @{
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        "apikey" = $SUPABASE_ANON_KEY
        "Content-Type" = "application/json"
    }
    $body = @{ name = "Functions" } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest `
            -Uri $url `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -ContentType "application/json" `
            -TimeoutSec 10
        
        Write-Color "✅ Respuesta 200 OK" "Green"
        Write-Color "   Status: $($response.StatusCode)" "Green"
        Write-Color "   Body: $($response.Content)" "Cyan"
        return $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        Write-Color "⚠️  Status: $statusCode" "Yellow"
        
        if ($statusCode -eq 404) {
            Write-Color "   La función no está desplegada aún" "Yellow"
        } elseif ($statusCode -eq 401) {
            Write-Color "   Error de autenticación (revisar claves)" "Yellow"
        }
        return $false
    }
}

function Show-Summary {
    param(
        [hashtable]$Results
    )
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                       📊 RESUMEN                               ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    foreach ($func in $FUNCTIONS) {
        $status = $Results[$func]
        $emoji = $status -eq $true ? "✅" : "❌"
        Write-Host "$emoji $func" -ForegroundColor ($status -eq $true ? "Green" : "Red")
    }
    
    Write-Host ""
}

# ============================================================================
# MAIN
# ============================================================================

Show-Banner

# Validar Supabase CLI
if (-not (Check-Supabase)) {
    exit 1
}

$results = @{}

# Determinar qué funciones procesar
$functionsToProcess = if ($Function -eq "all") {
    $FUNCTIONS
} else {
    @($Function)
}

# Ejecutar acción
switch ($Action.ToLower()) {
    "download" {
        Write-Color "`n📥 DESCARGANDO FUNCIONES..." "Yellow"
        foreach ($func in $functionsToProcess) {
            $results[$func] = Download-Function -FunctionName $func
        }
    }
    
    "deploy" {
        Write-Color "`n🚀 DESPLEGANDO FUNCIONES..." "Yellow"
        foreach ($func in $functionsToProcess) {
            $results[$func] = Deploy-Function -FunctionName $func
        }
        
        # Esperar un poco y probar
        Write-Color "`n⏳ Esperando 5 segundos para que los cambios se propaguen..." "Yellow"
        Start-Sleep -Seconds 5
        
        Write-Color "`n🧪 PROBANDO ENDPOINTS..." "Blue"
        foreach ($func in $functionsToProcess) {
            $testResult = Test-Endpoint -FunctionName $func
            $results[$func] = $results[$func] -and $testResult
        }
    }
    
    "delete" {
        Write-Color "`n🗑️  ELIMINANDO FUNCIONES..." "Yellow"
        foreach ($func in $functionsToProcess) {
            $results[$func] = Delete-Function -FunctionName $func
        }
    }
    
    "test" {
        Write-Color "`n🧪 PROBANDO ENDPOINTS..." "Blue"
        foreach ($func in $functionsToProcess) {
            $results[$func] = Test-Endpoint -FunctionName $func
        }
    }
    
    default {
        Write-Color "❌ Acción no válida: $Action" "Red"
        Write-Color "   Válidas: deploy, download, delete, test" "Yellow"
        exit 1
    }
}

Show-Summary -Results $results

Write-Color "`n✅ LISTO`n" "Green"
