import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

/**
 * Edge Function: webhook-event-logger
 * 
 * Responsabilidades:
 * 1. Validar firma HMAC-SHA256 del webhook
 * 2. Verificar timestamp (anti-replay attack: máximo 5 minutos)
 * 3. Verificar idempotencia (deduplicar eventos duplicados)
 * 4. Guardar evento completo en tabla webhook_events
 * 5. Retornar 200 OK con event_id generado
 * 
 * Patrón de uso:
 * POST https://[proyecto].supabase.co/functions/v1/webhook-event-logger
 * Headers:
 *   - Content-Type: application/json
 *   - X-Webhook-Signature: sha256=<hmac_hex>
 *   - X-Webhook-Timestamp: <unix_timestamp>
 *   - X-Webhook-ID: evt_<id>
 *   - X-Correlation-ID: req_<id>
 * 
 * Body:
 * {
 *   "event": "transferencia.completada",
 *   "idempotency_key": "transferencia.completada-TRF-001-COMPLETADA-20251215",
 *   "timestamp": "2025-12-15T10:30:45.123Z",
 *   "data": {...},
 *   "metadata": {...}
 * }
 */

// Configuración
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') || 'webhook_secret_123456';
const MAX_TIMESTAMP_AGE_MINUTES = 5;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

// Cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Valida firma HMAC-SHA256 del webhook
 */
async function validateSignature(
  bodyString: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    // 1. Extraer hash de la firma
    const receivedHash = signature.replace('sha256=', '');

    // 2. Calcular hash esperado
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

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      messageData,
    );

    // 3. Convertir a hex
    const expectedHash = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // 4. Comparar de forma segura (timing-safe)
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
 * Valida que el timestamp no sea muy antiguo (anti-replay)
 */
function validateTimestamp(timestamp: string, maxAgeMinutes: number = 5): boolean {
  try {
    const now = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp);
    const age = now - requestTime;

    // Verificar que no sea muy antiguo
    if (age > maxAgeMinutes * 60) {
      console.warn(`Timestamp too old: ${age}s (max: ${maxAgeMinutes * 60}s)`);
      return false;
    }

    // Verificar que no sea del futuro
    if (age < -60) {
      console.warn(`Timestamp in future: ${Math.abs(age)}s`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating timestamp:', error);
    return false;
  }
}

/**
 * Verifica idempotencia en tabla processed_webhooks
 */
async function checkIdempotency(idempotencyKey: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('processed_webhooks')
      .select('id')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (expected)
      console.error('Error checking idempotency:', error);
      return false;
    }

    return data !== null; // true si ya fue procesado
  } catch (error) {
    console.error('Error checking idempotency:', error);
    return false;
  }
}

/**
 * Guarda evento en tabla webhook_events
 */
async function saveWebhookEvent(
  eventId: string,
  payload: any,
  metadata: any,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('webhook_events')
      .insert({
        event_id: eventId,
        event_type: payload.event,
        idempotency_key: payload.idempotency_key,
        payload,
        metadata,
        received_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving webhook event:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving webhook event:', error);
    return false;
  }
}

/**
 * Marca clave como procesada en tabla processed_webhooks
 */
async function markAsProcessed(
  idempotencyKey: string,
  eventId: string,
  metadata: any,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('processed_webhooks')
      .insert({
        idempotency_key: idempotencyKey,
        source_service: metadata.source,
        correlation_id: metadata.correlation_id,
        result: { processed: true },
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
 * Handler principal
 */
serve(async (req: Request) => {
  // Manejar CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Signature, X-Webhook-Timestamp, X-Webhook-ID, X-Correlation-ID',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    // 1. Extraer headers
    const signature = req.headers.get('X-Webhook-Signature');
    const timestamp = req.headers.get('X-Webhook-Timestamp');
    const webhookId = req.headers.get('X-Webhook-ID');
    const correlationId = req.headers.get('X-Correlation-ID');

    if (!signature || !timestamp || !webhookId) {
      return new Response(
        JSON.stringify({
          error: 'Missing required headers',
          required: ['X-Webhook-Signature', 'X-Webhook-Timestamp', 'X-Webhook-ID'],
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 2. Leer body
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

    // 3. Validar firma HMAC
    const signatureValid = await validateSignature(
      bodyString,
      signature,
      WEBHOOK_SECRET,
    );

    if (!signatureValid) {
      console.error(`❌ Invalid signature for webhook ${webhookId}`);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 4. Validar timestamp
    if (!validateTimestamp(timestamp, MAX_TIMESTAMP_AGE_MINUTES)) {
      console.error(`❌ Invalid timestamp for webhook ${webhookId}`);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired timestamp' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 5. Verificar idempotencia
    const isDuplicate = await checkIdempotency(payload.idempotency_key);

    if (isDuplicate) {
      console.warn(
        `⚠️ Duplicate webhook detected: ${payload.idempotency_key}`,
      );
      return new Response(
        JSON.stringify({
          status: 'duplicate',
          event_id: webhookId,
          message: 'Webhook already processed',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 6. Guardar evento
    const eventSaved = await saveWebhookEvent(webhookId, payload, {
      correlation_id: correlationId,
      ...payload.metadata,
    });

    if (!eventSaved) {
      return new Response(
        JSON.stringify({ error: 'Failed to save webhook event' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 7. Marcar como procesado
    const marked = await markAsProcessed(
      payload.idempotency_key,
      webhookId,
      payload.metadata,
    );

    if (!marked) {
      console.error('Failed to mark webhook as processed');
      // No retornar error 500 porque el evento fue guardado
    }

    console.log(
      `✅ Webhook processed successfully: ${webhookId} | Event: ${payload.event} | Idempotency: ${payload.idempotency_key}`,
    );

    return new Response(
      JSON.stringify({
        status: 'success',
        event_id: webhookId,
        idempotency_key: payload.idempotency_key,
        message: 'Webhook received and logged',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Unexpected error in webhook-event-logger:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
