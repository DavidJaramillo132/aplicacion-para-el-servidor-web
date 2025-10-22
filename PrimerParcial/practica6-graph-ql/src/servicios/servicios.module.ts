import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosResolver } from './servicios.resolver';
import { HttpModule } from '@nestjs/axios';
import { CitasService } from '../citas/citas.service';

@Module({
  imports: [HttpModule],
  providers: [ServiciosResolver, ServiciosService, CitasService],
})
export class ServiciosModule {}
