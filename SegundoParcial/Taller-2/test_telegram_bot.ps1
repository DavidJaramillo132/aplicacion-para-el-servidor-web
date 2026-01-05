# test_telegram_bot.ps1
# Script para verificar que el Bot de Telegram funciona correctamente

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🤖 VERIFICACIÓN BOT DE TELEGRAM" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Leer credenciales del archivo .env
$envPath = "edge-functions\.env"

if (-not (Test-Path $envPath)) {
    Write-Host "❌ No se encontró el archivo: $envPath" -ForegroundColor Red
    Write-Host "   Asegúrate de que existe edge-functions\.env" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Leyendo configuración desde $envPath..." -ForegroundColor Gray

$envContent = Get-Content $envPath -Raw
$token = $null
$chatId = $null

# Extraer TELEGRAM_TOKEN
if ($envContent -match 'TELEGRAM_TOKEN[=\s]+"?([^"\r\n]+)"?') {
    $token = $matches[1].Trim()
} elseif ($envContent -match "TELEGRAM_TOKEN[=\s]+'?([^'\r\n]+)'?") {
    $token = $matches[1].Trim()
}

# Extraer TELEGRAM_CHAT_ID
if ($envContent -match 'TELEGRAM_CHAT_ID[=\s]+"?([^"\r\n]+)"?') {
    $chatId = $matches[1].Trim()
} elseif ($envContent -match "TELEGRAM_CHAT_ID[=\s]+'?([^'\r\n]+)'?") {
    $chatId = $matches[1].Trim()
}

# Validar que se encontraron las credenciales
if (-not $token -or $token -eq "") {
    Write-Host "❌ No se encontró TELEGRAM_TOKEN en .env" -ForegroundColor Red
    Write-Host "   Agrega: TELEGRAM_TOKEN=tu_token_aqui" -ForegroundColor Yellow
    exit 1
}

if (-not $chatId -or $chatId -eq "") {
    Write-Host "❌ No se encontró TELEGRAM_CHAT_ID en .env" -ForegroundColor Red
    Write-Host "   Agrega: TELEGRAM_CHAT_ID=tu_chat_id_aqui" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Credenciales encontradas" -ForegroundColor Green
Write-Host "   Token: $($token.Substring(0, [Math]::Min(15, $token.Length)))..." -ForegroundColor Gray
Write-Host "   Chat ID: $chatId" -ForegroundColor Gray
Write-Host ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PASO 1: Verificar que el token es válido
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "1️⃣ Verificando token del bot..." -ForegroundColor Yellow

try {
    $botInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getMe" -ErrorAction Stop
    
    if ($botInfo.ok) {
        Write-Host "✅ Bot válido:" -ForegroundColor Green
        Write-Host "   Nombre: $($botInfo.result.first_name)" -ForegroundColor Gray
        Write-Host "   Username: @$($botInfo.result.username)" -ForegroundColor Gray
        Write-Host "   Bot ID: $($botInfo.result.id)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Token inválido" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al verificar token:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Verifica que el token sea correcto" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PASO 2: Enviar mensaje de prueba
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "2️⃣ Enviando mensaje de prueba a Telegram..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
$hostname = $env:COMPUTERNAME

$message = @"
🧪 <b>TEST DEL BOT - Sistema Operacional</b>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>📊 Información del Sistema</b>

✅ <b>Sistema:</b> Idempotent Consumer
🏗️ <b>Arquitectura:</b> Microservicios + Edge Functions
⏰ <b>Timestamp:</b> $timestamp
💻 <b>Host:</b> $hostname
🔧 <b>Estado:</b> Operacional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>🎯 Componentes Activos</b>

✅ API Gateway :3000
✅ MS-Master :3001
✅ MS-Worker :3002
✅ PostgreSQL Master :5433
✅ PostgreSQL Worker :5434
✅ Redis :6379
✅ RabbitMQ :5672

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este es un mensaje de prueba para verificar que el bot de Telegram está configurado correctamente y puede recibir notificaciones del sistema.

<b>✅ Bot funcionando correctamente</b>
"@

try {
    $body = @{
        chat_id = $chatId
        text = $message
        parse_mode = "HTML"
    } | ConvertTo-Json -Compress

    $response = Invoke-RestMethod -Method POST `
        -Uri "https://api.telegram.org/bot$token/sendMessage" `
        -ContentType "application/json; charset=utf-8" `
        -Body $body `
        -ErrorAction Stop

    if ($response.ok) {
        Write-Host "✅ Mensaje enviado exitosamente" -ForegroundColor Green
        Write-Host "   Message ID: $($response.result.message_id)" -ForegroundColor Gray
        Write-Host "   Chat ID: $($response.result.chat.id)" -ForegroundColor Gray
        Write-Host "   Fecha: $(Get-Date $response.result.date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray
    } else {
        Write-Host "❌ Error al enviar mensaje" -ForegroundColor Red
        Write-Host "   Respuesta: $($response | ConvertTo-Json)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al enviar mensaje:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Message -like "*chat not found*") {
        Write-Host "💡 El Chat ID parece ser incorrecto" -ForegroundColor Yellow
        Write-Host "   Para obtener tu Chat ID:" -ForegroundColor Yellow
        Write-Host "   1. Envía un mensaje a tu bot en Telegram" -ForegroundColor Yellow
        Write-Host "   2. Ejecuta:" -ForegroundColor Yellow
        Write-Host "      `$updates = Invoke-RestMethod -Uri 'https://api.telegram.org/bot$token/getUpdates'" -ForegroundColor Cyan
        Write-Host "      `$updates.result[0].message.chat.id" -ForegroundColor Cyan
    }
    
    exit 1
}

Write-Host ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PASO 3: Enviar segundo mensaje con emojis y formato
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "3️⃣ Enviando mensaje con formato avanzado..." -ForegroundColor Yellow

Start-Sleep -Seconds 2

$advancedMessage = @"
🎉 <b>Verificación Completa</b>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ <b>Bot de Telegram:</b> Operacional
🔐 <b>Autenticación:</b> Verificada
📡 <b>Conectividad:</b> Estable
🧪 <b>Test:</b> Exitoso

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<i>El sistema está listo para enviar notificaciones automáticas cuando ocurran eventos de transferencias.</i>

<b>Próximos pasos:</b>
1. Ejecutar transferencias
2. Ver notificaciones automáticas
3. Verificar logs en Supabase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<code>Sistema: Idempotent Consumer v1.0</code>
"@

try {
    $body2 = @{
        chat_id = $chatId
        text = $advancedMessage
        parse_mode = "HTML"
    } | ConvertTo-Json -Compress

    $response2 = Invoke-RestMethod -Method POST `
        -Uri "https://api.telegram.org/bot$token/sendMessage" `
        -ContentType "application/json; charset=utf-8" `
        -Body $body2 `
        -ErrorAction Stop

    if ($response2.ok) {
        Write-Host "✅ Segundo mensaje enviado" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Error al enviar segundo mensaje (no crítico)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ VERIFICACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Revisa tu Telegram para ver los mensajes" -ForegroundColor Yellow
Write-Host "🎯 El bot está listo para recibir webhooks del sistema" -ForegroundColor Green
Write-Host ""
Write-Host "Para probar el flujo completo:" -ForegroundColor Cyan
Write-Host "  .\test_sistema.ps1" -ForegroundColor White
Write-Host ""
