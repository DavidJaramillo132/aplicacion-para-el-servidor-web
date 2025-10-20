import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from './entities/negocio.entity';
import { Estacion } from '../estaciones/entities/estacion.entity';
import { NegociosService } from './negocios.service';
import { NegociosController } from './negocios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Negocio, Estacion])],
  controllers: [NegociosController],
  providers: [NegociosService],
})
export class NegociosModule {}


