import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WebhookPublisherService } from './services/webhook-publisher.service';
import { WebhookSecurityService } from './services/webhook-security.service';
import { IdempotencyService } from './services/idempotency.service';

/**
 * Módulo de Webhooks
 * Integra:
 * - Publicación de webhooks con firma HMAC
 * - Retry con exponential backoff
 * - Idempotencia garantizada
 * - Seguridad empresarial
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    // TypeOrmModule sería importado aquí si tuviéramos entidades
  ],
  providers: [
    WebhookPublisherService,
    WebhookSecurityService,
    IdempotencyService,
  ],
  exports: [
    WebhookPublisherService,
    WebhookSecurityService,
    IdempotencyService,
  ],
})
export class WebhookModule {}
