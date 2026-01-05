#!/usr/bin/env pwsh

<#
.SYNOPSIS
Prueba completa del patron Idempotent Consumer

.DESCRIPTION
Este script demuestra que el sistema NO permite duplicados:
1. Crea una transferencia
2. Intenta crearla nuevamente con el mismo ID
3. Verifica que solo existe UNA transferencia (no duplicada)
4. Verifica que el saldo se debito UNA SOLA VEZ

.EXAMPLE
.\test_idempotencia_completo.ps1
#>

$ErrorActionPreference = "Stop"

# URLs
$GATEWAY_URL = "http://localhost:3000"
$MS_MASTER_URL = "http://localhost:3001"
$MS_WORKER_URL = "http://localhost:3002"

# Colores
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Error-Msg { param($msg) Write-Host $msg -ForegroundColor Red }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }
function Write-Warning-Msg { param($msg) Write-Host $msg -ForegroundColor Yellow }

function Show-Banner {
    Write-Host ""
    Write-Host "══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "       PRUEBA COMPLETA: PATRON IDEMPOTENT CONSUMER" -ForegroundColor Cyan
    Write-Host "              (Garantia: NO DUPLICADOS)" -ForegroundColor Cyan
    Write-Host "══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Test-Service {
    param([string]$Url, [string]$Name)
    
    try {
        # Probar endpoint especifico segun el servicio
        $testUrl = switch ($Name) {
            "Gateway" { "$Url/cuentas" }
            "MS-Master" { "$Url/cuentas" }
            "MS-Worker" { "$Url/transferencias" }
            default { "$Url" }
        }
        
        $response = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Success "[OK] $Name esta activo"
            return $true
        }
    }
    catch {
        # Si es 401 o cualquier respuesta, el servicio esta activo
        if ($_.Exception.Response.StatusCode.Value__ -ge 200 -and $_.Exception.Response.StatusCode.Value__ -lt 500) {
            Write-Success "[OK] $Name esta activo"
            return $true
        }
        Write-Error-Msg "[XX] $Name no responde"
        return $false
    }
    return $false
}

function Get-AccountBalance {
    param([int]$AccountId)
    
    try {
        $response = Invoke-RestMethod -Uri "$MS_MASTER_URL/cuentas/$AccountId" -Method GET
        return $response.saldo
    }
    catch {
        return $null
    }
}

function Show-TestResult {
    param(
        [string]$TestName,
        [bool]$Passed,
        [string]$Details
    )
    
    if ($Passed) {
        Write-Success "[PASS] $TestName"
        Write-Host "       $Details" -ForegroundColor Gray
    }
    else {
        Write-Error-Msg "[FAIL] $TestName"
        Write-Host "       $Details" -ForegroundColor Gray
    }
}

# ============================================================================
# MAIN
# ============================================================================

Show-Banner

Write-Info "PASO 1: Verificar servicios"
Write-Host "──────────────────────────────────────────────────────────────────" -ForegroundColor Gray

$gatewayOk = Test-Service -Url $GATEWAY_URL -Name "Gateway"
$masterOk = Test-Service -Url $MS_MASTER_URL -Name "MS-Master"
$workerOk = Test-Service -Url $MS_WORKER_URL -Name "MS-Worker"

if (-not ($gatewayOk -and $masterOk -and $workerOk)) {
    Write-Error-Msg "`n[ERROR] Servicios no estan activos. Ejecuta: docker-compose up -d"
    exit 1
}

Write-Host ""
Write-Info "PASO 2: Crear cuentas de prueba"
Write-Host "──────────────────────────────────────────────────────────────────" -ForegroundColor Gray

# Crear cuenta origen
$cuentaOrigen = @{
    numero_cuenta = "CUENTA-ORIGEN-$(Get-Random -Minimum 1000 -Maximum 9999)"
    nombre_titular = "Juan Perez"
    saldo = 1000.00
    tipo = "ahorros"
} | ConvertTo-Json

$cuentaDestino = @{
    numero_cuenta = "CUENTA-DESTINO-$(Get-Random -Minimum 1000 -Maximum 9999)"
    nombre_titular = "Maria Garcia"
    saldo = 500.00
    tipo = "corriente"
} | ConvertTo-Json

try {
    $resOrigen = Invoke-RestMethod -Uri "$MS_MASTER_URL/cuentas" -Method POST -Body $cuentaOrigen -ContentType "application/json"
    $resDestino = Invoke-RestMethod -Uri "$MS_MASTER_URL/cuentas" -Method POST -Body $cuentaDestino -ContentType "application/json"
    
    Write-Success "[OK] Cuenta origen creada: ID=$($resOrigen.id), Saldo=$($resOrigen.saldo)"
    Write-Success "[OK] Cuenta destino creada: ID=$($resDestino.id), Saldo=$($resDestino.saldo)"
    
    $origenId = $resOrigen.id
    $destinoId = $resDestino.id
    $saldoOrigenInicial = $resOrigen.saldo
}
catch {
    Write-Error-Msg "[ERROR] No se pudieron crear las cuentas"
    Write-Error-Msg "Detalle: $_"
    exit 1
}

Write-Host ""
Write-Info "PASO 3: Crear transferencia (Primera vez)"
Write-Host "──────────────────────────────────────────────────────────────────" -ForegroundColor Gray

$transactionId = "TXN_$(Get-Date -Format 'yyyyMMddHHmmss')_TEST_IDEMPOTENCIA"

$transferencia = @{
    cuenta_origen_id = $origenId
    cuenta_destino_id = $destinoId
    monto = 100.00
    descripcion = "Prueba de idempotencia - NO debe duplicarse"
    transaction_id = $transactionId
} | ConvertTo-Json

Write-Host "Transaction ID: $transactionId" -ForegroundColor Yellow

try {
    $res1 = Invoke-RestMethod -Uri "$MS_WORKER_URL/transferencias" -Method POST -Body $transferencia -ContentType "application/json"
    
    Write-Success "[OK] Primera transferencia creada"
    Write-Host "    ID de transferencia: $($res1.id)" -ForegroundColor Gray
    Write-Host "    Transaction ID: $($res1.transaction_id)" -ForegroundColor Gray
    Write-Host "    Estado: $($res1.estado)" -ForegroundColor Gray
    
    $primeraTransferenciaId = $res1.id
    $primeraTransactionId = $res1.transaction_id
}
catch {
    Write-Error-Msg "[ERROR] No se pudo crear la primera transferencia"
    Write-Error-Msg "Detalle: $_"
    exit 1
}

# Esperar procesamiento
Write-Host ""
Write-Warning-Msg "Esperando 3 segundos para procesamiento..."
Start-Sleep -Seconds 3

Write-Host ""
Write-Info "PASO 4: Intentar crear DUPLICADO (Segunda vez - mismo Transaction ID)"
Write-Host "──────────────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Warning-Msg "IMPORTANTE: Esto NO debe crear una nueva transferencia"

try {
    $res2 = Invoke-RestMethod -Uri "$MS_WORKER_URL/transferencias" -Method POST -Body $transferencia -ContentType "application/json"
    
    Write-Success "[OK] Sistema acepto el request (sin error)"
    Write-Host "    ID de transferencia: $($res2.id)" -ForegroundColor Gray
    Write-Host "    Transaction ID: $($res2.transaction_id)" -ForegroundColor Gray
    
    $segundaTransferenciaId = $res2.id
    $segundaTransactionId = $res2.transaction_id
}
catch {
    Write-Error-Msg "[ERROR] Sistema rechazo el duplicado (comportamiento inesperado)"
    Write-Error-Msg "Detalle: $_"
}

Write-Host ""
Write-Info "PASO 5: VERIFICAR IDEMPOTENCIA"
Write-Host "──────────────────────────────────────────────────────────────────" -ForegroundColor Gray

# Test 1: Verificar que ambos requests devolvieron el MISMO ID
$test1Passed = $primeraTransferenciaId -eq $segundaTransferenciaId
Show-TestResult -TestName "IDs identicos" -Passed $test1Passed -Details "Primera: $primeraTransferenciaId, Segunda: $segundaTransferenciaId"

# Test 2: Verificar que el Transaction ID es el mismo
$test2Passed = $primeraTransactionId -eq $segundaTransactionId
Show-TestResult -TestName "Transaction IDs identicos" -Passed $test2Passed -Details "Ambos: $primeraTransactionId"

# Test 3: Contar transferencias en la base de datos
Start-Sleep -Seconds 2
try {
    $allTransfers = Invoke-RestMethod -Uri "$MS_WORKER_URL/transferencias" -Method GET
    $matchingTransfers = $allTransfers | Where-Object { $_.transaction_id -eq $transactionId }
    $count = ($matchingTransfers | Measure-Object).Count
    
    $test3Passed = $count -eq 1
    Show-TestResult -TestName "Solo UNA transferencia en DB" -Passed $test3Passed -Details "Encontradas: $count (esperado: 1)"
}
catch {
    Write-Error-Msg "[FAIL] No se pudo consultar transferencias"
    $test3Passed = $false
}

# Test 4: Verificar que el saldo se debito UNA SOLA VEZ
Start-Sleep -Seconds 2
$saldoOrigenFinal = Get-AccountBalance -AccountId $origenId

if ($null -ne $saldoOrigenFinal) {
    $expectedSaldo = $saldoOrigenInicial - 100.00
    $test4Passed = [Math]::Abs($saldoOrigenFinal - $expectedSaldo) -lt 0.01
    
    Show-TestResult -TestName "Saldo debitado UNA SOLA VEZ" -Passed $test4Passed -Details "Inicial: $$saldoOrigenInicial, Final: $$saldoOrigenFinal, Esperado: $$expectedSaldo"
}
else {
    Write-Error-Msg "[FAIL] No se pudo obtener el saldo final"
    $test4Passed = $false
}

# Test 5: Verificar en Redis (cache)
Write-Host ""
Write-Info "Test adicional: Verificar cache Redis"
try {
    $redisKey = "idempotency:$transactionId"
    $redisCheck = docker exec redis-cache redis-cli GET $redisKey 2>$null
    
    if ($redisCheck) {
        Write-Success "[OK] Clave encontrada en Redis cache"
        Write-Host "    Key: $redisKey" -ForegroundColor Gray
        Write-Host "    TTL: 7 dias" -ForegroundColor Gray
    }
    else {
        Write-Warning-Msg "[INFO] Clave no en Redis (puede estar en PostgreSQL)"
    }
}
catch {
    Write-Warning-Msg "[INFO] No se pudo verificar Redis (normal si no tienes docker CLI)"
}

# ============================================================================
# RESUMEN FINAL
# ============================================================================

Write-Host ""
Write-Host "══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$allPassed = $test1Passed -and $test2Passed -and $test3Passed -and $test4Passed

if ($allPassed) {
    Write-Success "[EXITO] TODAS LAS PRUEBAS PASARON"
    Write-Host ""
    Write-Success "El patron Idempotent Consumer funciona correctamente:"
    Write-Host "  - El sistema acepta requests duplicados SIN error" -ForegroundColor White
    Write-Host "  - Devuelve el MISMO ID de transferencia" -ForegroundColor White
    Write-Host "  - NO crea registros duplicados en la base de datos" -ForegroundColor White
    Write-Host "  - El dinero se debita UNA SOLA VEZ" -ForegroundColor White
    Write-Host ""
    Write-Success "GARANTIA: NO hay duplicados en el sistema"
}
else {
    Write-Error-Msg "[FALLO] ALGUNAS PRUEBAS FALLARON"
    Write-Host ""
    Write-Host "Resultados:" -ForegroundColor Yellow
    Write-Host "  Test 1 (IDs identicos): $(if ($test1Passed) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($test1Passed) { 'Green' } else { 'Red' })
    Write-Host "  Test 2 (Transaction IDs): $(if ($test2Passed) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($test2Passed) { 'Green' } else { 'Red' })
    Write-Host "  Test 3 (Una sola en DB): $(if ($test3Passed) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($test3Passed) { 'Green' } else { 'Red' })
    Write-Host "  Test 4 (Saldo correcto): $(if ($test4Passed) { 'PASS' } else { 'FAIL' })" -ForegroundColor $(if ($test4Passed) { 'Green' } else { 'Red' })
}

Write-Host ""
Write-Host "══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Retornar codigo de salida
if ($allPassed) {
    exit 0
}
else {
    exit 1
}
