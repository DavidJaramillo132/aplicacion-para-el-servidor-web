import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
import { CitasService } from 'src/citas/citas.service';
import { ServiciosService } from 'src/servicios/servicios.service';

import { Usuario } from './entities/usuario.entity';
import { UsuarioCitasDTO } from './dto/usuario-citas.dto';
import { PerfilCompletoUsuario } from './dto/perfil-completo-usuario.dto';

import { Estado } from 'src/citas/enums/estados.enums';
@Resolver(() => Usuario)
export class UsuariosResolver {
  constructor(
    private readonly usuariosServices: UsuariosService,
    private readonly citasServices: CitasService,
    private readonly serviciosServices: ServiciosService,
  ) {}

  @Query(() => [Usuario], {
    name: 'usuarios',
    description: 'Obtener todos los usuarios',
  })
  findAll() {
    return this.usuariosServices.findAllUsers();
  }

  @Query(() => Usuario, { name: 'usuario' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usuariosServices.findOneById(id);
  }

  @Query(() => [UsuarioCitasDTO], {
    name: 'usuariosConCitasPendientes',
    description:
      'Lista los usuarios con sus citas pendientes, incluyendo detalles del servicio.',
  })
  async usuariosConCitasPendientes() {
    const usuarios = await this.usuariosServices.findAllUsers();
    const citas = await this.citasServices.findAllCitas();
    const servicios = await this.serviciosServices.findAllServicios();

    const pendientes = citas.filter((c) => c.estado === Estado.PENDIENTE);

    return usuarios
      .map((u) => ({
        usuario: u.nombreCompleto,
        citas: pendientes
          .filter((c) => c.usuario_id === u.id)
          .map((c) => ({
            fecha: c.fecha,
            servicio: servicios.find((s) => s.id === c.servicio_id)?.nombre,
          })),
      }))
      .filter((u) => u.citas.length > 0);
  }

  @Query(() => [UsuarioCitasDTO], {
    name: 'usuariosConCitasAtendidas',
    description:
      'Lista los usuarios con sus citas atendidas, incluyendo detalles del servicio.',
  })
  async usuariosConCitasAtendidas() {
    const usuarios = await this.usuariosServices.findAllUsers();
    const citas = await this.citasServices.findAllCitas();
    const servicios = await this.serviciosServices.findAllServicios();

    const atendidas = citas.filter((c) => c.estado === Estado.ATENDIDA);

    return usuarios
      .map((u) => ({
        usuario: u.nombreCompleto,
        citas: atendidas
          .filter((c) => c.usuario_id === u.id)
          .map((c) => ({
            fecha: c.fecha,
            servicio: servicios.find((s) => s.id === c.servicio_id)?.nombre,
          })),
      }))
      .filter((u) => u.citas.length > 0);
  }


  @Query(() => PerfilCompletoUsuario, {
    description:
      'Perfil completo del usuario con información agregada de citas y servicios utilizados',
  })
  async perfilCompletoUsuario(
    @Args('usuarioId', {
      type: () => String,
      description: 'ID del usuario',
    })
    usuarioId: string,
  ): Promise<PerfilCompletoUsuario> {
    const usuario = await this.usuariosServices.findOneById(usuarioId);

    const todasCitas = await this.citasServices.findAllCitas();
    const citasUsuario = todasCitas.filter(
      (c: any) => c.usuario_id === usuarioId,
    );

    const totalCitas = citasUsuario.length;
    const citasCompletadas = citasUsuario.filter(
      (c: any) => c.estado === Estado.ATENDIDA,
    ).length;
    const citasPendientes = citasUsuario.filter(
      (c: any) => c.estado === Estado.PENDIENTE,
    ).length;
    const citasCanceladas = citasUsuario.filter(
      (c: any) => c.estado === Estado.CANCELADA,
    ).length;

    return {
      id: usuario.id,
      nombre: usuario.nombreCompleto,
      email: usuario.email,
      telefono: usuario.telefono || '',
      totalCitas,
      citasCompletadas,
      citasPendientes,
      citasCanceladas
    };
  }
}
