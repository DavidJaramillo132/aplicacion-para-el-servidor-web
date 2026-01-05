import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import * as crypto from 'crypto';

/**
 * Servicio de Idempotencia Mejorado
 * Garantiza que solicitudes duplicadas produzcan el mismo resultado
 * 
 * PROBLEMA RESUELTO:
 * RabbitMQ garantiza "At-least-once delivery", no "Exactly-once"
 * Si la red falla antes del ACK, el mensaje se duplica
 * Procesar un pago dos veces = Catástrofe
 * 
 * SOLUCIÓN:
 * Usar idempotency_key único para deduplicar eventos
 * Almacenar en Redis para acceso rápido
 * Garantiza exactitud incluso con duplicados de red
 */
@Injectable()
export class IdempotencyService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IdempotencyService.name);
  private redisClient: RedisClientType;

  /**
   * TTL para claves de idempotencia: 7 días
   * Basado en recomendaciones de industria para operaciones financieras
   */
  private readonly KEY_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 días

  async onModuleInit() {
    try {
      this.redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });
      this.redisClient.on('error', (err) => {
        this.logger.error('Redis Client Error', err);
      });
      await this.redisClient.connect();
      this.logger.log('✅ Redis connected for idempotency service');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.disconnect();
      this.logger.log('Redis disconnected');
    }
  }

  /**
   * Verifica si una clave ya fue procesada
   * @param idempotencyKey Clave única para la operación
   * @returns true si ya fue procesada, false en caso contrario
   */
  async isProcessed(idempotencyKey: string): Promise<boolean> {
    const result = await this.redisClient.get(`idempotency:${idempotencyKey}`);
    return result !== null;
  }

  /**
   * Obtiene detalles de procesamiento de una clave
   * @param idempotencyKey Clave a buscar
   * @returns Objeto con detalles del procesamiento o null
   */
  async getProcessingDetails(idempotencyKey: string): Promise<any> {
    const result = await this.redisClient.get(`idempotency:${idempotencyKey}`);
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }

  /**
   * Marca una clave como procesada exitosamente
   * @param idempotencyKey Clave única para la operación
   * @param result Resultado de la operación
   * @param ttlSeconds Tiempo de vida en segundos (default 7 días)
   */
  async markAsProcessed(
    idempotencyKey: string,
    result: any = null,
    ttlSeconds: number = this.KEY_TTL_SECONDS,
  ): Promise<void> {
    await this.redisClient.setEx(
      `idempotency:${idempotencyKey}`,
      ttlSeconds,
      JSON.stringify({
        status: 'success',
        processedAt: new Date().toISOString(),
        id: idempotencyKey,
        result,
      }),
    );
    this.logger.debug(`✅ Key marked as processed: ${idempotencyKey}`);
  }

  /**
   * Procesa una operación con garantía de idempotencia
   * 
   * @param idempotencyKey Clave única para la operación
   * @param operation Función asíncrona a ejecutar
   * @returns Promise con resultado o indicación de duplicado
   */
  async processWithIdempotency<T>(
    idempotencyKey: string,
    operation: () => Promise<T>,
  ): Promise<{
    status: 'first_attempt' | 'duplicate_success' | 'duplicate_processing';
    result?: T;
    isDuplicate: boolean;
  }> {
    // Validar idempotency_key
    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      throw new Error('Invalid idempotency_key');
    }

    // Verificar si ya fue procesado
    const cached = await this.getProcessingDetails(idempotencyKey);

    if (cached) {
      this.logger.warn(
        `⚠️ Duplicate request detected: ${idempotencyKey} | Status: ${cached.status}`,
      );

      return {
        status: 'duplicate_success',
        result: cached.result,
        isDuplicate: true,
      };
    }

    // Ejecutar la operación
    try {
      const result = await operation();

      // Guardar resultado exitoso
      await this.markAsProcessed(idempotencyKey, result);

      this.logger.log(
        `✅ Operation completed successfully: ${idempotencyKey}`,
      );

      return {
        status: 'first_attempt',
        result,
        isDuplicate: false,
      };
    } catch (error: any) {
      this.logger.error(
        `❌ Operation failed: ${idempotencyKey} | Error: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Genera idempotency_key segura basada en componentes
   * Patrón: event_type + entity_id + action + date
   * 
   * @param eventType Tipo de evento (ej. "transferencia.completada")
   * @param entityId ID de la entidad (ej. transferencia_id)
   * @param action Acción (ej. "PROCESADA")
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
   * Genera idempotency_key con hash SHA-256
   * Más seguro para datos sensibles
   * 
   * @param components Partes que componen la clave
   * @returns String SHA-256 en base16
   */
  generateHashedIdempotencyKey(...components: (string | number)[]): string {
    const combined = components.map(c => String(c)).join(':');
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  /**
   * Elimina una clave de idempotencia
   * Útil para reintentos manuales o limpieza
   * 
   * @param idempotencyKey Clave a eliminar
   */
  async deleteKey(idempotencyKey: string): Promise<void> {
    await this.redisClient.del(`idempotency:${idempotencyKey}`);
    this.logger.debug(`Deleted idempotency key: ${idempotencyKey}`);
  }

  /**
   * Obtiene estadísticas de idempotencia
   * 
   * @returns Objeto con estadísticas de Redis
   */
  async getStats(): Promise<any> {
    try {
      const info = await this.redisClient.info();
      const keysCount = await this.redisClient.dbSize();
      return {
        redisConnected: true,
        totalKeys: keysCount,
        info,
      };
    } catch (error) {
      this.logger.error('Error getting stats', error);
      return {
        redisConnected: false,
        error: error.message,
      };
    }
  }
}
