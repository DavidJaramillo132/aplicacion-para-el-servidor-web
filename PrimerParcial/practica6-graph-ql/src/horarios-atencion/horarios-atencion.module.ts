import { Module } from '@nestjs/common';
import { HorariosAtencionService } from './horarios-atencion.service';
import { HorariosAtencionResolver } from './horarios-atencion.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [HorariosAtencionResolver, HorariosAtencionService],
})
export class HorariosAtencionModule {}
