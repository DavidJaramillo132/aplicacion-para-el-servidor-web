# Test Completo del Sistema - PowerShell

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "TEST COMPLETO DEL SISTEMA - MICROSERVICIOS" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$BASE_URL = "http://localhost:3000"
$HEADERS = @{ "Content-Type" = "application/json" }

Write-Host "[1] OBTENER CUENTAS EXISTENTES" -ForegroundColor Yellow
$cuentas = Invoke-RestMethod -Uri "$BASE_URL/cuentas" -Method Get -Headers $HEADERS
Write-Host "Total de cuentas: $($cuentas.Count)" -ForegroundColor Green
Write-Host ""

Write-Host "[2] CREAR TRANSFERENCIAS" -ForegroundColor Yellow

$t1 = @{ origen = 1; destino = 2; monto = 100.00 }
$body1 = @{ cuentaOrigenId = $t1.origen; cuentaDestinoId = $t1.destino; monto = $t1.monto } | ConvertTo-Json
$r1 = Invoke-RestMethod -Uri "$BASE_URL/transferencias" -Method Post -Headers $HEADERS -Body $body1
Write-Host "Transferencia 1: ID=$($r1.id), Monto=$($r1.monto)" -ForegroundColor Green

Start-Sleep -Seconds 1

$t2 = @{ origen = 2; destino = 3; monto = 50.00 }
$body2 = @{ cuentaOrigenId = $t2.origen; cuentaDestinoId = $t2.destino; monto = $t2.monto } | ConvertTo-Json
$r2 = Invoke-RestMethod -Uri "$BASE_URL/transferencias" -Method Post -Headers $HEADERS -Body $body2
Write-Host "Transferencia 2: ID=$($r2.id), Monto=$($r2.monto)" -ForegroundColor Green

Write-Host ""
Write-Host "[3] TEST DE IDEMPOTENCIA" -ForegroundColor Yellow

$bodyTest = @{ cuentaOrigenId = 1; cuentaDestinoId = 4; monto = 75.00 } | ConvertTo-Json
$rTest1 = Invoke-RestMethod -Uri "$BASE_URL/transferencias" -Method Post -Headers $HEADERS -Body $bodyTest
Write-Host "Primera solicitud: ID=$($rTest1.id), TXN=$($rTest1.transferenciaId)" -ForegroundColor Green

Start-Sleep -Seconds 1

$rTest2 = Invoke-RestMethod -Uri "$BASE_URL/transferencias" -Method Post -Headers $HEADERS -Body $bodyTest
Write-Host "Segunda solicitud: ID=$($rTest2.id), TXN=$($rTest2.transferenciaId)" -ForegroundColor Green

if ($rTest1.id -eq $rTest2.id) {
    Write-Host "RESULTADO: Idempotencia FUNCIONANDO" -ForegroundColor Green
} else {
    Write-Host "RESULTADO: ERROR - Duplicado procesado" -ForegroundColor Red
}

Write-Host ""
Write-Host "[4] TODAS LAS TRANSFERENCIAS" -ForegroundColor Yellow
$allTxns = Invoke-RestMethod -Uri "$BASE_URL/transferencias" -Method Get -Headers $HEADERS
Write-Host "Total: $($allTxns.Count) transacciones" -ForegroundColor Green

Write-Host ""
Write-Host "[5] SALDOS ACTUALIZADOS" -ForegroundColor Yellow
$cuentasActuales = Invoke-RestMethod -Uri "$BASE_URL/cuentas" -Method Get -Headers $HEADERS
$cuentasActuales | Select-Object id, numero, saldo | Format-Table -AutoSize

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "TEST COMPLETADO EXITOSAMENTE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
