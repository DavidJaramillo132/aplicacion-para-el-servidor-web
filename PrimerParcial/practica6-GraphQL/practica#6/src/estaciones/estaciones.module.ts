import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estacion } from './entities/estacion.entity';
import { Fila } from '../fila/entities/fila.entity';
import { HorarioAtencion } from '../horarios-atencion/entities/horario-atencion.entity';
import { EstacionesService } from './estaciones.service';
import { EstacionesController } from './estaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estacion, Fila, HorarioAtencion])],
  controllers: [EstacionesController],
  providers: [EstacionesService],
})
export class EstacionesModule {}


