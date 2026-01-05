import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('Gateway');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`🚀 API Gateway listening on http://localhost:${port}`);
  logger.log(`📍 Routes:`);
  logger.log(`   - GET  /health`);
  logger.log(`   - GET  /cuentas`);
  logger.log(`   - GET  /cuentas/:id`);
  logger.log(`   - POST /cuentas`);
  logger.log(`   - GET  /transferencias`);
  logger.log(`   - GET  /transferencias/:id`);
  logger.log(`   - POST /transferencias (triggers RabbitMQ event + idempotency check)`);
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed:', err);
  process.exit(1);
});
