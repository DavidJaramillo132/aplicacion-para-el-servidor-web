import { Module } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { NegociosResolver } from './negocios.resolver';
import { HttpModule } from '@nestjs/axios';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CitasService } from '../citas/citas.service';
import { ServiciosService } from '../servicios/servicios.service';
import { EstacionesService } from '../estaciones/estaciones.service';
import { FilaService } from '../fila/fila.service';

@Module({
  imports: [HttpModule],
  providers: [
    NegociosResolver,
    NegociosService,
    UsuariosService,
    CitasService,
    ServiciosService,
    EstacionesService,
    FilaService,
  ],
})
export class NegociosModule {}
