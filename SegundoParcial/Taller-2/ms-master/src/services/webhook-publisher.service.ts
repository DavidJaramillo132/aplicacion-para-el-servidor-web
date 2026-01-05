import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosError } from 'axios';
import { WebhookSecurityService } from './webhook-security.service';

/**
 * Interfaz para suscripción de webhook
 * Representa una URL registrada para recibir eventos
 */
interface WebhookSubscription {
  id: number;
  event_type: string;
  url: string;
  secret: string;
  is_active: boolean;
  retry_config: {
    max_attempts: number;
    backoff_type: string;
    initial_delay_ms: number;
  };
}

/**
 * Interfaz para payload estándar de webhook
 * Sigue estándares de industria (Stripe, GitHub, Shopify)
 */
interface WebhookPayload {
  event: string;
  version: string;
  id: string;
  idempotency_key: string;
  timestamp: string;
  data: Record<string, any>;
  metadata: {
    source: string;
    environment: string;
    correlation_id: string;
  };
}

/**
 * Servicio de Publicación de Webhooks
 * Responsable de:
 * - Escuchar eventos internos
 * - Transformar a formato estándar
 * - Firmar con HMAC
 * - Enviar a URLs registradas
 * - Implementar retry con exponential backoff
 * - Registrar intentos en base de datos
 */
@Injectable()
export class WebhookPublisherService {
  private readonly logger = new Logger(WebhookPublisherService.name);

  constructor(
    private securityService: WebhookSecurityService,
  ) {}

  /**
   * Construye un webhook en formato estándar
   * 
   * @param eventType - Tipo de evento (ej. "transferencia.completada")
   * @param data - Datos específicos del evento
   * @param source - Microservicio origen
   * @param environment - Entorno (production, staging, development)
   * @returns WebhookPayload formateado
   */
  buildWebhookPayload(
    eventType: string,
    data: Record<string, any>,
    source: string = 'microservice-master',
    environment: string = process.env.NODE_ENV || 'development',
  ): WebhookPayload {
    const webhookId = this.securityService.generateWebhookId();
    const timestamp = new Date().toISOString();
    const entityId = data.id || data.transferencia_id || data.cuenta_id || 'unknown';
    const action = this.extractActionFromEvent(eventType);
    const idempotencyKey = this.securityService.generateIdempotencyKey(
      eventType,
      entityId,
      action,
    );
    const correlationId = this.securityService.generateCorrelationId();

    return {
      event: eventType,
      version: '1.0',
      id: webhookId,
      idempotency_key: idempotencyKey,
      timestamp,
      data,
      metadata: {
        source,
        environment,
        correlation_id: correlationId,
      },
    };
  }

  /**
   * Extrae la acción del tipo de evento
   * "transferencia.completada" -> "COMPLETADA"
   * 
   * @param eventType - Tipo de evento
   * @returns Acción extraída en mayúsculas
   */
  private extractActionFromEvent(eventType: string): string {
    const parts = eventType.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toUpperCase();
    }
    return 'PROCESSED';
  }

  /**
   * Publica un webhook a una suscripción específica
   * Maneja firma HMAC y retry con exponential backoff
   * 
   * @param subscription - Suscripción de destino
   * @param payload - Payload del webhook
   * @returns Promise que resuelve cuando se envía (no espera respuesta)
   * 
   * @example
   * const subscription = {
   *   url: "https://example.com/webhooks",
   *   secret: "secret123",
   *   retry_config: { max_attempts: 6, ... }
   * };
   * await publishWebhook(subscription, webhookPayload);
   */
  async publishWebhook(
    subscription: WebhookSubscription,
    payload: WebhookPayload,
  ): Promise<void> {
    if (!subscription.is_active) {
      this.logger.warn(
        `Webhook subscription ${subscription.id} is inactive, skipping`,
      );
      return;
    }

    // Generar firma HMAC
    const signature = this.securityService.generateSignature(
      payload,
      subscription.secret,
    );
    const timestamp = this.securityService.generateTimestamp();

    this.logger.debug(
      `Publishing webhook to ${subscription.url} for event ${payload.event}`,
    );

    // Encolar para procesamiento asincrónico (Bull/BullMQ)
    // Esto se integrará con el servicio de colas
    await this.sendWithRetry(
      subscription,
      payload,
      signature,
      timestamp,
      1, // attempt_number
    );
  }

  /**
   * Envía webhook con reintentos exponenciales
   * 
   * @param subscription - Suscripción de destino
   * @param payload - Payload del webhook
   * @param signature - Firma HMAC
   * @param timestamp - Timestamp del webhook
   * @param attemptNumber - Número de intento actual
   * @returns Promise<boolean> true si se envió exitosamente
   */
  private async sendWithRetry(
    subscription: WebhookSubscription,
    payload: WebhookPayload,
    signature: string,
    timestamp: string,
    attemptNumber: number,
  ): Promise<boolean> {
    try {
      const startTime = Date.now();

      // Realizar solicitud HTTP
      const response = await axios.post(subscription.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': timestamp,
          'X-Webhook-ID': payload.id,
          'X-Correlation-ID': payload.metadata.correlation_id,
        },
        timeout: 10000, // 10 segundos
      });

      const duration = Date.now() - startTime;

      this.logger.log(
        `✅ Webhook sent successfully (attempt ${attemptNumber}): ${subscription.url} | Status: ${response.status} | Duration: ${duration}ms`,
      );

      // Aquí se registraría en webhook_deliveries con status='success'
      return true;
    } catch (error: any) {
      const duration = Date.now() - (Date.now() - 0);
      const errorMessage = this.extractErrorMessage(error);

      this.logger.warn(
        `❌ Webhook delivery failed (attempt ${attemptNumber}/${subscription.retry_config.max_attempts}): ${subscription.url} | Error: ${errorMessage}`,
      );

      // Aquí se registraría el intento fallido en webhook_deliveries

      // Determinar si hay que reintentar
      if (attemptNumber < subscription.retry_config.max_attempts) {
        const delayMs = this.calculateBackoffDelay(
          attemptNumber,
          subscription.retry_config.initial_delay_ms,
        );

        this.logger.log(
          `⏳ Scheduling retry ${attemptNumber + 1} in ${delayMs}ms...`,
        );

        // Aquí se encolaría en Bull/BullMQ con delay
        setTimeout(() => {
          this.sendWithRetry(
            subscription,
            payload,
            signature,
            timestamp,
            attemptNumber + 1,
          );
        }, delayMs);

        return false;
      } else {
        this.logger.error(
          `🔴 Webhook exhausted max retries: ${subscription.url}. Moving to Dead Letter Queue.`,
        );

        // Aquí se movería a webhook_dead_letter_queue
        return false;
      }
    }
  }

  /**
   * Calcula delay exponencial para retry
   * Patrón: 1min, 5min, 30min, 2h, 12h, 24h
   * 
   * @param attemptNumber - Número del intento (1-indexed)
   * @param initialDelayMs - Delay inicial en milisegundos
   * @returns Delay en milisegundos para este intento
   */
  private calculateBackoffDelay(
    attemptNumber: number,
    initialDelayMs: number = 60000,
  ): number {
    const delays = [
      60000, // 1 minuto
      300000, // 5 minutos
      1800000, // 30 minutos
      7200000, // 2 horas
      43200000, // 12 horas
      86400000, // 24 horas
    ];

    // Asegurar que no se sale del array
    const index = Math.min(attemptNumber - 1, delays.length - 1);
    return delays[index];
  }

  /**
   * Extrae mensaje de error de AxiosError
   * 
   * @param error - Error capturado
   * @returns String con descripción del error
   */
  private extractErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // El servidor respondió con código de error
        return `HTTP ${error.response.status}: ${JSON.stringify(error.response.data).substring(0, 100)}`;
      } else if (error.request) {
        // Se hizo la solicitud pero no hay respuesta
        return `No response received (timeout or network error)`;
      } else {
        // Error en la configuración de la solicitud
        return error.message;
      }
    }
    return error.message || 'Unknown error';
  }

  /**
   * Valida que una suscripción sea válida
   * 
   * @param subscription - Suscripción a validar
   * @returns true si es válida
   */
  isValidSubscription(subscription: Partial<WebhookSubscription>): boolean {
    return (
      !!subscription.url &&
      !!subscription.secret &&
      !!subscription.event_type &&
      subscription.retry_config?.max_attempts > 0
    );
  }

  /**
   * Formatea log estructurado para observabilidad
   * 
   * @param level - Nivel de log
   * @param message - Mensaje
   * @param context - Contexto adicional
   * @returns String formateado como JSON
   */
  private formatLog(
    level: string,
    message: string,
    context: Record<string, any> = {},
  ): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'webhook-publisher',
      ...context,
    });
  }
}
