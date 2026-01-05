import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('MS-Master');

async function bootstrap() {
  // HTTP App for REST endpoints
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  // Connect Microservice for RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: 'cuentas_queue',
      queueOptions: {
        durable: true,
      },
      prefetch: 1, // Process one message at a time (sequential processing)
    },
  });

  // Start all
  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`🚀 MS-Master listening on HTTP: http://localhost:${port}`);
  logger.log(`📬 MS-Master consuming from RabbitMQ queue: cuentas_queue`);
  logger.log(`🔑 Idempotency keys stored in Redis with 24h TTL`);
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed:', err);
  process.exit(1);
});
