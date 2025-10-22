import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CitasService } from './citas.service';
import { Cita } from './entities/cita.entity';
import { MetricasTemporales } from './dto/metricas-temporales.dto';
import { FiltroCitasInput } from './dto/filtro-citas.input';
import { Estado } from './enums/estados.enums';

@Resolver(() => Cita)
export class CitasResolver {
  constructor(private readonly citasService: CitasService) { }

  @Query(() => [Cita], { name: 'citas' })
  findAll() {
    return this.citasService.findAllCitas();
  }

  @Query(() => Cita, { name: 'cita' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.citasService.findOneCita(id);
  }

  // Obtener citas por usuario
  @Query(() => [Cita], { name: 'citasPorUsuario' })
  async citasPorUsuario(
    @Args('usuarioId', { type: () => String }) usuarioId: string,
  ) {
    return this.citasService.obtenerCitasPorUsuario(usuarioId);
  }


  @Query(() => MetricasTemporales, {
    description:
      'Métricas temporales de citas con cálculos de tasas y comparaciones entre períodos',
  })
  async metricasTemporales(
    @Args('periodo', {
      type: () => String,
      defaultValue: 'mes',
      description: 'Período a analizar: dia, semana, mes',
    })
    periodo: string,
    @Args('fechaInicio', {
      type: () => String,
      nullable: true,
      description: 'Fecha de inicio (YYYY-MM-DD)',
    })
    fechaInicio?: string,
  ): Promise<MetricasTemporales> {
    const todasCitas = await this.citasService.findAllCitas();

    let fechaLimite: Date;
    const ahora = new Date();

    if (fechaInicio) {
      fechaLimite = new Date(fechaInicio);
    } else {
      switch (periodo) {
        case 'dia':
          fechaLimite = new Date(ahora.setDate(ahora.getDate() - 1));
          break;
        case 'semana':
          fechaLimite = new Date(ahora.setDate(ahora.getDate() - 7));
          break;
        case 'mes':
        default:
          fechaLimite = new Date(ahora.setMonth(ahora.getMonth() - 1));
          break;
      }
    }

    const citasPeriodo = todasCitas.filter((c: any) => {
      const fechaCita = new Date(c.fecha);
      return fechaCita >= fechaLimite;
    });

    const totalCitas = citasPeriodo.length;
    const citasCompletadas = citasPeriodo.filter(
      (c: any) => c.estado === Estado.ATENDIDA,
    ).length;
    const citasCanceladas = citasPeriodo.filter(
      (c: any) => c.estado === Estado.CANCELADA,
    ).length;
    const tasaCumplimiento =
      totalCitas > 0 ? (citasCompletadas / totalCitas) * 100 : 0;

    const usuariosUnicos = new Set(
      citasPeriodo.map((c: any) => c.usuario_id),
    ).size;

    let fechaLimiteAnterior: Date;
    switch (periodo) {
      case 'dia':
        fechaLimiteAnterior = new Date(fechaLimite);
        fechaLimiteAnterior.setDate(fechaLimiteAnterior.getDate() - 1);
        break;
      case 'semana':
        fechaLimiteAnterior = new Date(fechaLimite);
        fechaLimiteAnterior.setDate(fechaLimiteAnterior.getDate() - 7);
        break;
      case 'mes':
      default:
        fechaLimiteAnterior = new Date(fechaLimite);
        fechaLimiteAnterior.setMonth(fechaLimiteAnterior.getMonth() - 1);
        break;
    }

    const citasPeriodoAnterior = todasCitas.filter((c: any) => {
      const fechaCita = new Date(c.fecha);
      return fechaCita >= fechaLimiteAnterior && fechaCita < fechaLimite;
    });

    const totalCitasAnterior = citasPeriodoAnterior.length;
    const comparacionPeriodoAnterior =
      totalCitasAnterior > 0
        ? ((totalCitas - totalCitasAnterior) / totalCitasAnterior) * 100
        : 0;

    return {
      periodo,
      totalCitas,
      citasCompletadas,
      citasCanceladas,
      tasaCumplimiento: Math.round(tasaCumplimiento * 100) / 100,
      comparacionPeriodoAnterior:
        Math.round(comparacionPeriodoAnterior * 100) / 100,
      usuariosUnicos,
    };
  }


  @Query(() => [Cita], {
    description:
      'Búsqueda parametrizada de citas con múltiples filtros y paginación',
  })
  async buscarCitasAvanzado(
    @Args('filtros', {
      type: () => FiltroCitasInput,
      description: 'Filtros para la búsqueda',
    })
    filtros: FiltroCitasInput,
  ): Promise<Cita[]> {
    let citas = await this.citasService.findAllCitas();

    // Aplicar filtros
    if (filtros.usuarioId) {
      citas = citas.filter((c: any) => c.usuario_id === filtros.usuarioId);
    }

    if (filtros.servicioId) {
      citas = citas.filter((c: any) => c.servicio_id === filtros.servicioId);
    }

    if (filtros.estado) {
      citas = citas.filter((c: any) => c.estado === filtros.estado);
    }

    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      citas = citas.filter((c: any) => new Date(c.fecha) >= fechaInicio);
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      citas = citas.filter((c: any) => new Date(c.fecha) <= fechaFin);
    }

    // Ordenar por fecha descendente
    citas = citas.sort(
      (a: any, b: any) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );

    // Aplicar paginación
    const offset = filtros.offset || 0;
    const limite = filtros.limite || 10;
    return citas.slice(offset, offset + limite);
  }

  @Query(() => [Cita], {
    description:
      'Obtiene las próximas citas ordenadas por fecha con filtro de estado',
  })
  async citasProximas(
    @Args('dias', {
      type: () => Int,
      defaultValue: 7,
      description: 'Número de días hacia adelante',
    })
    dias: number,
    @Args('estado', {
      type: () => Estado,
      nullable: true,
      description: 'Filtrar por estado de la cita',
    })
    estado?: Estado,
  ): Promise<Cita[]> {
    const todasCitas = await this.citasService.findAllCitas();

    const ahora = new Date();
    const fechaLimite = new Date(ahora.setDate(ahora.getDate() + dias));

    let citasProximas = todasCitas.filter((c: any) => {
      const fechaCita = new Date(c.fecha);
      return fechaCita >= new Date() && fechaCita <= fechaLimite;
    });

    if (estado) {
      citasProximas = citasProximas.filter((c: any) => c.estado === estado);
    }

    return citasProximas.sort(
      (a: any, b: any) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    );
  }
}


