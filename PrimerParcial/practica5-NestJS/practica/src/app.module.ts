import { Module } from '@nestjs/common';
import { DispositivosModule } from './dispositivos/dispositivos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispositivo } from './dispositivos/entities/dispositivo.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE,
      entities: [Dispositivo],
      synchronize: true,
    }),
    DispositivosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
