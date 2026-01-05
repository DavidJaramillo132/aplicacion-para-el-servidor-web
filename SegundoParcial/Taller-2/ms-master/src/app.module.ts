import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Cuenta } from './entities/cuenta.entity';
import { CuentaService } from './services/cuenta.service';
import { IdempotencyService } from './services/idempotency.service';
import { CuentaController } from './controllers/cuenta.controller';
import { TransferenciaListener } from './listeners/transferencia.listener';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5433,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'cuentas_db',
      entities: [Cuenta],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Cuenta]),
  ],
  controllers: [CuentaController, TransferenciaListener],
  providers: [CuentaService, IdempotencyService],
})
export class AppModule {
  static microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: 'cuentas_queue',
      queueOptions: {
        durable: true,
      },
      prefetch: 1, // Process one message at a time
    },
  };
}
