import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('MS-Worker');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3002;

  await app.listen(port);

  logger.log(`🚀 MS-Worker listening on HTTP: http://localhost:${port}`);
  logger.log(`📮 MS-Worker ready to emit 'transferencia.creada' events to RabbitMQ`);
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed:', err);
  process.exit(1);
});
