import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Servicio de Seguridad para Webhooks
 * Responsable de generar y validar firmas HMAC-SHA256
 * Estándar industrial para seguridad de webhooks (Stripe, GitHub, Shopify)
 */
@Injectable()
export class WebhookSecurityService {
  private readonly logger = new Logger(WebhookSecurityService.name);

  /**
   * Genera firma HMAC-SHA256 del payload
   * 
   * @param payload - Objeto a firmar
   * @param secret - Secreto compartido para firma
   * @returns String en formato "sha256=<hex_hash>"
   * 
   * @example
   * const signature = generateSignature({id: 123}, "secret")
   * // Returns: "sha256=abc123def456..."
   */
  generateSignature(payload: any, secret: string): string {
    try {
      // 1. Serializar payload a JSON string sin espacios
      const payloadString = JSON.stringify(payload);

      // 2. Crear HMAC con SHA256
      const hmac = crypto
        .createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex');

      // 3. Retornar con prefijo estándar (Stripe, GitHub, etc)
      return `sha256=${hmac}`;
    } catch (error) {
      this.logger.error('Error generating signature', error);
      throw error;
    }
  }

  /**
   * Genera timestamp actual en formato Unix (segundos)
   * Usado para validación anti-replay en Edge Functions
   * 
   * @returns String con timestamp en segundos
   */
  generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  /**
   * Genera un UUID v4 único para el webhook
   * Usado como event_id para rastreo
   * 
   * @returns String UUID v4
   */
  generateWebhookId(): string {
    return `evt_${crypto.randomBytes(12).toString('hex')}`;
  }

  /**
   * Genera idempotency_key basado en event_type + entity_id + action
   * Garantiza deduplicación en la Edge Function
   * 
   * @param eventType - Tipo de evento (ej. "transferencia.completada")
   * @param entityId - ID de la entidad (ej. transferencia_id)
   * @param action - Acción (ej. "PROCESADA")
   * @returns String con idempotency_key
   * 
   * @example
   * generateIdempotencyKey("transferencia.completada", "TRF-001", "PROCESADA")
   * // Returns: "transferencia.completada-TRF-001-PROCESADA-20251215"
   */
  generateIdempotencyKey(
    eventType: string,
    entityId: string | number,
    action: string,
  ): string {
    const dateStr = new Date().toISOString().split('T')[0];
    return `${eventType}-${entityId}-${action}-${dateStr}`;
  }

  /**
   * Genera correlation_id para rastrear solicitud a través de múltiples sistemas
   * 
   * @returns String correlation_id formato "req_<12_hex_chars>"
   */
  generateCorrelationId(): string {
    return `req_${crypto.randomBytes(6).toString('hex')}`;
  }

  /**
   * Valida que el payload tenga estructura JSON válida
   * 
   * @param payload - Objeto a validar
   * @returns true si es válido
   */
  isValidPayload(payload: any): boolean {
    try {
      JSON.stringify(payload);
      return true;
    } catch {
      return false;
    }
  }
}
