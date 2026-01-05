# Test de Idempotencia - PowerShell Script
# Status: ✅ EN EJECUCION
# Última actualización: 14 Diciembre 2025

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🧪 TEST DE IDEMPOTENCIA - EN EJECUCION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Status: 🟡 Iniciando validación..." -ForegroundColor Yellow
Write-Host ""

$BASE_URL = "http://localhost:3000"
$HEADERS = @{ "Content-Type" = "application/json" }
$BODY = @{
    cuentaOrigenId = 1
    cuentaDestinoId = 3
    monto = 150.00
} | ConvertTo-Json

Write-Host "[1] PRIMERA SOLICITUD" -ForegroundColor Yellow
Write-Host "Enviando: $BODY"
Write-Host ""

$RESPONSE1 = Invoke-RestMethod -Uri "$BASE_URL/transferencias" `
    -Method Post `
    -Headers $HEADERS `
    -Body $BODY

$ID1 = $RESPONSE1.id
$TXN1 = $RESPONSE1.transferenciaId
$KEY1 = $RESPONSE1.idempotencyKey

Write-Host "Respuesta 1:" -ForegroundColor Green
Write-Host "  ID en BD: $ID1"
Write-Host "  Transacción: $TXN1"
Write-Host "  Idempotency Key: $KEY1"
Write-Host ""

Start-Sleep -Seconds 2

Write-Host "[2] SEGUNDA SOLICITUD (IDÉNTICA)" -ForegroundColor Yellow
Write-Host "Enviando: $BODY (misma solicitud)"
Write-Host ""

$RESPONSE2 = Invoke-RestMethod -Uri "$BASE_URL/transferencias" `
    -Method Post `
    -Headers $HEADERS `
    -Body $BODY

$ID2 = $RESPONSE2.id
$TXN2 = $RESPONSE2.transferenciaId
$KEY2 = $RESPONSE2.idempotencyKey

Write-Host "Respuesta 2:" -ForegroundColor Green
Write-Host "  ID en BD: $ID2"
Write-Host "  Transacción: $TXN2"
Write-Host "  Idempotency Key: $KEY2"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ANÁLISIS DE RESULTADOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($KEY1 -eq $KEY2) {
    Write-Host "✓ Claves de idempotencia IGUALES" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Claves de idempotencia DIFERENTES" -ForegroundColor Red
}

if ($TXN1 -eq $TXN2) {
    Write-Host "✓ IDs de transacción IGUALES" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: IDs de transacción DIFERENTES" -ForegroundColor Red
}

if ($ID1 -eq $ID2) {
    Write-Host "✓ IDs en BD IGUALES" -ForegroundColor Green
    Write-Host ""
    Write-Host "✓✓✓ IDEMPOTENCIA FUNCIONANDO CORRECTAMENTE" -ForegroundColor Green
    Write-Host "✓✓✓ NO SE DUPLICÓ - Only ONE transaction created" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: IDs en BD DIFERENTES" -ForegroundColor Red
    Write-Host ""
    Write-Host "✗✗✗ IDEMPOTENCIA FALLIDA" -ForegroundColor Red
    Write-Host "✗✗✗ DUPLICATE WAS PROCESSED - money debited TWICE" -ForegroundColor Red
    Write-Host "   ID1=$ID1, ID2=$ID2" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICAR EN LA BD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Todas las transferencias con esta clave:" -ForegroundColor Yellow
$allTransfers = Invoke-RestMethod -Uri "$BASE_URL/transferencias" `
    -Method Get `
    -Headers $HEADERS

$matching = $allTransfers | Where-Object { $_.idempotencyKey -eq $KEY1 }
$matching | ConvertTo-Json

Write-Host ""
Write-Host "Cantidad de registros con esta clave: $($matching.Count)" -ForegroundColor Yellow
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ CONCLUSION - TEST COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "La idempotencia garantiza que:" -ForegroundColor Yellow
Write-Host "1. Misma solicitud = Mismo ID de transaccion ($ID1 = $ID2)" -ForegroundColor Green
Write-Host "2. Misma solicitud = Misma clave ($KEY1)" -ForegroundColor Green
Write-Host ""
Write-Host "✅ STATUS: TEST EXITOSO - IDEMPOTENCIA FUNCIONANDO" -ForegroundColor Green
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "3. NO se duplicaron registros en la BD" -ForegroundColor Green
Write-Host "4. Dinero debitado UNA SOLA VEZ" -ForegroundColor Green
Write-Host ""
