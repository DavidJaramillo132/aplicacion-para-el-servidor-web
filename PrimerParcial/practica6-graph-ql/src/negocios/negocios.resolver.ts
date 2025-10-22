import { Resolver, Query, Args } from '@nestjs/graphql';
import { NegociosService } from './negocios.service';
import { Negocio } from './entities/negocio.entity';
import { ResumenNegocio } from './dto/resumen-negocio';
import { DashboardNegocio } from './dto/dashboard-negocio.dto';

import { UsuariosService } from '../usuarios/usuarios.service';
import { CitasService } from '../citas/citas.service';
import { ServiciosService } from '../servicios/servicios.service';
import { EstacionesService } from '../estaciones/estaciones.service';
import { FilaService } from '../fila/fila.service';


import { EstacionStats } from '../estaciones/dto/estacion.dto';

@Resolver(() => Negocio)
export class NegociosResolver {
  constructor(
    private readonly negociosService: NegociosService,
    private readonly usuariosService: UsuariosService,
    private readonly citasService: CitasService,
    private readonly serviciosService: ServiciosService,
    private readonly estacionesService: EstacionesService,
    private readonly filaService: FilaService,
  ) {}

  // Query simple: todos los negocios
  @Query(() => [Negocio], { name: 'negocios' })
  findAll() {
    return this.negociosService.findAllNegocios();
  }

  // Query simple: un negocio por id
  @Query(() => Negocio, { name: 'negocio' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.negociosService.findOneNegocio(id);
  }

  @Query(() => DashboardNegocio, {
    description:
      'Dashboard unificado con información agregada de múltiples entidades: negocios, estaciones, servicios, citas, usuarios y fila',
  })
  async dashboardNegocio(
    @Args('negocioId', {
      type: () => String,
      description: 'ID del negocio para obtener el dashboard',
    })
    negocioId: string,
  ): Promise<DashboardNegocio> {
    const negocio = await this.negociosService.findOneNegocio(negocioId);

    const todasEstaciones = await this.estacionesService.findAllEstaciones();
    const estacionesNegocio = todasEstaciones.filter(
      (e: any) => e.negocio_id === negocioId,
    );

    const servicios = await this.serviciosService.findAllServicios();
    const serviciosVisibles = servicios.filter((s: any) => s.visible);

    const todasCitas = await this.citasService.findAllCitas();
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoy = todasCitas.filter((c: any) => {
      if (!c.fecha) return false;
      const fechaCita = new Date(c.fecha).toISOString().split('T')[0];
      return fechaCita === hoy;
    });

    const usuarios = await this.usuariosService.findAllUsers();

    const citasCompletadas = todasCitas.filter(
      (c: any) => c.estado === 'atendida',
    );
    const tiempoPromedio =
      citasCompletadas.length > 0
        ? citasCompletadas.reduce((acc: number, c: any) => {
            const servicio = servicios.find((s: any) => s.id === c.servicio_id);
            return acc + (servicio?.duracion_minutos || 0);
          }, 0) / citasCompletadas.length
        : 0;

    const fila = await this.filaService.findAllFila();
    const personasEnFila = fila.filter(
      (f: any) => f.estado === 'espera',
    ).length;

    return {
      negocioId,
      nombreNegocio: negocio.nombre,
      totalEstaciones: estacionesNegocio.filter((e: any) => e.estado === 'activo')
        .length,
      totalServicios: serviciosVisibles.length,
      citasHoy: citasHoy.length,
      totalUsuarios: usuarios.length,
      tiempoPromedioAtencion: Math.round(tiempoPromedio * 100) / 100,
      personasEnFila,
    };
  }

  @Query(() => ResumenNegocio, {
    description:
      'Resumen general de la actividad de un negocio con estadísticas de citas',
  })
  async resumenNegocio(
    @Args('negocioId', {
      type: () => String,
      description: 'ID del negocio para obtener el resumen',
    })
    negocioId: string,
  ): Promise<ResumenNegocio> {
    const todasEstaciones = await this.estacionesService.findAllEstaciones();
    const estaciones = todasEstaciones.filter(
      (e: any) => e.negocio_id === negocioId,
    );

    const servicios = await this.serviciosService.findAllServicios();

    // 3️Obtener todas las citas
    const todasCitas = await this.citasService.findAllCitas();
    const servicioIds = servicios.map((s: any) => s.id);
    const citasNegocio = todasCitas.filter((c: any) =>
      servicioIds.includes(c.servicio_id),
    );

    const totalEstaciones = estaciones.filter(
      (e: any) => e.estado === 'activo',
    ).length;
    const totalServicios = servicios.filter((s: any) => s.visible).length;
    const totalCitas = citasNegocio.length;
    const citasPendientes = citasNegocio.filter(
      (c: any) => c.estado === 'pendiente',
    ).length;
    const citasCompletadas = citasNegocio.filter(
      (c: any) => c.estado === 'atendida',
    ).length;

    return {
      negocioId,
      totalEstaciones,
      totalServicios,
      totalCitas,
      citasPendientes,
      citasCompletadas,
    };
  }

  @Query(() => [EstacionStats], {
    description:
      'Compara el rendimiento de todas las estaciones de un negocio con métricas de uso',
  })
  async estadisticasEstaciones(
    @Args('negocioId', {
      type: () => String,
      description: 'ID del negocio',
    })
    negocioId: string,
  ): Promise<EstacionStats[]> {
    // 1️⃣ Obtener estaciones del negocio
    const todasEstaciones = await this.estacionesService.findAllEstaciones();
    const estaciones = todasEstaciones.filter(
      (e: any) => e.negocio_id === negocioId,
    );

    // 2️⃣ Obtener todas las citas
    const todasCitas = await this.citasService.findAllCitas();

    // 3️⃣ Obtener fila para contar personas en espera por estación
    const fila = await this.filaService.findAllFila();

    // 4️⃣ Calcular estadísticas por estación
    return estaciones.map((estacion: any) => {
      const citasEstacion = todasCitas.filter(
        (c: any) => c.estacion_id === estacion.id,
      );
      const personasEnEspera = fila.filter(
        (f: any) => f.estacion_id === estacion.id && f.estado === 'espera',
      ).length;

      return {
        estacionId: estacion.id,
        nombreEstacion: estacion.nombre,
        estado: estacion.estado,
        totalCitas: citasEstacion.length,
        citasCompletadas: citasEstacion.filter(
          (c: any) => c.estado === 'atendida',
        ).length,
        personasEnEspera,
        tasaUso:
          citasEstacion.length > 0
            ? Math.round(
                (citasEstacion.filter((c: any) => c.estado === 'atendida')
                  .length /
                  citasEstacion.length) *
                  100,
              )
            : 0,
      };
    });
  }

}

