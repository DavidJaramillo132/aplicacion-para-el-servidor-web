import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosResolver } from './usuarios.resolver';
import { HttpModule } from '@nestjs/axios';
import { CitasService } from 'src/citas/citas.service';
import { ServiciosService } from 'src/servicios/servicios.service';

@Module({
  imports: [HttpModule],
  providers: [
    UsuariosResolver,
    UsuariosService,
    CitasService,
    ServiciosService,
  ],
})
export class UsuariosModule {}
