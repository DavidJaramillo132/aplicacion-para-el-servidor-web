import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

/**
 * Edge Function: webhook-external-notifier
 * 
 * Responsabilidades:
 * 1. Validar firma HMAC del webhook
 * 2. Verificar idempotencia con PostgreSQL
 * 3. Enviar notificaciones a Telegram Bot
 * 4. Registrar resultado de notificación en base de datos
 * 5. Retornar 200 OK o reintentables según el error
 * 
 * Envíos soportados:
 * - Telegram Bot API
 * - Email (sendgrid, AWS SES, etc.)
 * - SMS (Twilio)
 * 
 * Flow:
 * Webhook -> Validar -> Deduplicar -> Enviar notificación -> Log
 */

// Configuración
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') || 'webhook_secret_123456';
const TELEGRAM_TOKEN = Deno.env.get('TELEGRAM_TOKEN') || '';
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const ENVIRONMENT = Deno.env.get('ENVIRONMENT') || 'development';

// Cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Validar firma HMAC-SHA256
 */
async function validateSignature(
  bodyString: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    const receivedHash = signature.replace('sha256=', '');
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(bodyString);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);

    const expectedHash = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return timingSafeEqual(receivedHash, expectedHash);
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}

/**
 * Comparación segura contra timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verifica idempotencia
 */
async function checkIdempotency(idempotencyKey: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('processed_webhooks')
      .select('id')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking idempotency:', error);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error('Error checking idempotency:', error);
    return false;
  }
}

/**
 * Marca clave como procesada
 */
async function markAsProcessed(
  idempotencyKey: string,
  metadata: any,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('processed_webhooks')
      .insert({
        idempotency_key: idempotencyKey,
        source_service: metadata.source,
        correlation_id: metadata.correlation_id,
        result: { notification_sent: true },
        processed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error marking as processed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking as processed:', error);
    return false;
  }
}

/**
 * Envía notificación a Telegram
 */
async function sendTelegramNotification(
  payload: any,
): Promise<{ success: boolean; error?: string }> {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return { success: false, error: 'Telegram not configured' };
  }

  try {
    // Construir mensaje formateado
    const message = formatTelegramMessage(payload);

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', result);
      return {
        success: false,
        error: result.description || 'Unknown Telegram error',
      };
    }

    console.log('✅ Telegram notification sent successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error sending Telegram notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Formatea mensaje para Telegram
 */
function formatTelegramMessage(payload: any): string {
  const timestamp = new Date(payload.timestamp).toLocaleString();
  const eventEmoji = getEventEmoji(payload.event);

  let message = `${eventEmoji} <b>${payload.event}</b>\n\n`;
  message += `<b>Timestamp:</b> ${timestamp}\n`;
  message += `<b>ID:</b> <code>${payload.id}</code>\n`;
  message += `<b>Service:</b> ${payload.metadata.source}\n`;
  message += `<b>Environment:</b> ${payload.metadata.environment}\n`;

  // Agregar datos específicos según el evento
  if (payload.event.includes('transferencia')) {
    message += `\n<b>Datos de Transferencia:</b>\n`;
    message += `Monto: $${payload.data.monto?.toFixed(2)}\n`;
    message += `Estado: ${payload.data.estado}\n`;
  }

  message += `\n<b>Correlation ID:</b> <code>${payload.metadata.correlation_id}</code>`;

  return message;
}

/**
 * Obtiene emoji según el tipo de evento
 */
function getEventEmoji(eventType: string): string {
  if (eventType.includes('completada')) return '✅';
  if (eventType.includes('fallida')) return '❌';
  if (eventType.includes('iniciada')) return '⏳';
  if (eventType.includes('creada')) return '📝';
  return '📌';
}

/**
 * Registra entrega en la base de datos
 */
async function logDelivery(
  webhookId: string,
  eventType: string,
  success: boolean,
  error?: string,
): Promise<void> {
  try {
    const { error: dbError } = await supabase
      .from('webhook_deliveries')
      .insert({
        event_id: webhookId,
        status: success ? 'success' : 'failed',
        status_code: success ? 200 : 500,
        error_message: error,
        duration_ms: 0,
        attempt_number: 1,
      });

    if (dbError) {
      console.error('Error logging delivery:', dbError);
    }
  } catch (error) {
    console.error('Error logging delivery:', error);
  }
}

/**
 * Handler principal
 */
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers':
          'Content-Type, X-Webhook-Signature, X-Webhook-Timestamp',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 1. Extraer headers
    const signature = req.headers.get('X-Webhook-Signature');
    const timestamp = req.headers.get('X-Webhook-Timestamp');
    const webhookId = req.headers.get('X-Webhook-ID');

    if (!signature || !timestamp || !webhookId) {
      return new Response(
        JSON.stringify({ error: 'Missing required headers' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 2. Leer y parsear body
    const bodyString = await req.text();
    let payload: any;

    try {
      payload = JSON.parse(bodyString);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 3. Validar firma
    const signatureValid = await validateSignature(
      bodyString,
      signature,
      WEBHOOK_SECRET,
    );

    if (!signatureValid) {
      console.error(`❌ Invalid signature: ${webhookId}`);
      await logDelivery(webhookId, payload.event, false, 'Invalid signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 4. Verificar idempotencia
    const isDuplicate = await checkIdempotency(payload.idempotency_key);

    if (isDuplicate) {
      console.warn(`⚠️ Duplicate webhook: ${payload.idempotency_key}`);
      return new Response(
        JSON.stringify({
          status: 'duplicate',
          event_id: webhookId,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 5. Enviar notificación a Telegram
    const notificationResult = await sendTelegramNotification(payload);

    if (!notificationResult.success) {
      console.error(
        `❌ Notification failed: ${notificationResult.error}`,
      );
      await logDelivery(
        webhookId,
        payload.event,
        false,
        notificationResult.error,
      );

      // Retornar 500 para que el Publisher reintente
      return new Response(
        JSON.stringify({
          error: 'Notification delivery failed',
          message: notificationResult.error,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 6. Marcar como procesado
    await markAsProcessed(payload.idempotency_key, payload.metadata);

    // 7. Registrar entrega exitosa
    await logDelivery(webhookId, payload.event, true);

    console.log(
      `✅ Webhook processed and notification sent: ${webhookId}`,
    );

    return new Response(
      JSON.stringify({
        status: 'success',
        event_id: webhookId,
        notification_sent: true,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
