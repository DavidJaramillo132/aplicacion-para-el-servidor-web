import { Module } from '@nestjs/common';
import { EstacionesService } from './estaciones.service';
import { EstacionesResolver } from './estaciones.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EstacionesResolver, EstacionesService],
})
export class EstacionesModule {}
