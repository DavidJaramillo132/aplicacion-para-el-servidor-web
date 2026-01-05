import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class IdempotencyService {
  private redisClient: RedisClientType;

  async onModuleInit() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.disconnect();
    }
  }

  /**
   * Verifica si un mensaje ya fue procesado
   * @param idempotencyKey Llave única para el mensaje
   * @returns true si ya fue procesado, false si no
   */
  async isProcessed(idempotencyKey: string): Promise<boolean> {
    const result = await this.redisClient.get(`idempotency:${idempotencyKey}`);
    return result !== null;
  }

  /**
   * Marca un mensaje como procesado
   * @param idempotencyKey Llave única para el mensaje
   * @param ttlSeconds Tiempo de vida en segundos (por defecto 24 horas)
   */
  async markAsProcessed(idempotencyKey: string, ttlSeconds: number = 86400): Promise<void> {
    await this.redisClient.setEx(
      `idempotency:${idempotencyKey}`,
      ttlSeconds,
      JSON.stringify({
        processedAt: new Date().toISOString(),
        id: idempotencyKey,
      }),
    );
  }

  /**
   * Obtiene los detalles de procesamiento para una llave
   */
  async getProcessingDetails(idempotencyKey: string): Promise<any> {
    const result = await this.redisClient.get(`idempotency:${idempotencyKey}`);
    return result ? JSON.parse(result) : null;
  }
}
