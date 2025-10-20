import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioAtencion } from './entities/horario-atencion.entity';
import { HorariosAtencionService } from './horarios-atencion.service';
import { HorariosAtencionController } from './horarios-atencion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioAtencion])],
  controllers: [HorariosAtencionController],
  providers: [HorariosAtencionService],
})
export class HorariosAtencionModule {}


