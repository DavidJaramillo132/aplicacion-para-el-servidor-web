import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ServiciosService } from './servicios.service';
import { Servicio } from './entities/servicio.entity';
import { EstadisticasServicio } from './dto/estadisticas-servicio.dto';
import { RankingServicios } from './dto/ranking-servicios.dto';
import { CitasService } from '../citas/citas.service';

@Resolver(() => Servicio)
export class ServiciosResolver {
  constructor(
    private readonly serviciosService: ServiciosService,
    private readonly citasService: CitasService,
  ) {}

  @Query(() => [Servicio], { name: 'servicios' })
  findAll() {
    return this.serviciosService.findAllServicios();
  }

  @Query(() => Servicio, { name: 'servicio' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.serviciosService.findOneServicioById(id);
  }


  @Query(() => EstadisticasServicio, {
    description:
      'Estadísticas y métricas detalladas de un servicio específico con cálculos de conversión e ingresos',
  })
  async estadisticasServicio(
    @Args('servicioId', {
      type: () => String,
      description: 'ID del servicio',
    })
    servicioId: string,
  ): Promise<EstadisticasServicio> {
    const servicio = await this.serviciosService.findOneServicioById(servicioId);

    const todasCitas = await this.citasService.findAllCitas();
    const citasServicio = todasCitas.filter(
      (c: any) => c.servicio_id === servicioId,
    );

    const totalCitas = citasServicio.length;
    const citasCompletadas = citasServicio.filter(
      (c: any) => c.estado === 'atendida',
    ).length;
    const citasPendientes = citasServicio.filter(
      (c: any) => c.estado === 'pendiente',
    ).length;

    const tasaConversion =
      totalCitas > 0 ? (citasCompletadas / totalCitas) * 100 : 0;

    const ingresosGenerados = citasCompletadas * (servicio.precio_centavos || 0);

    const duracionPromedio = servicio.duracion_minutos || 0;

    return {
      servicioId,
      nombreServicio: servicio.nombre,
      totalCitas,
      citasCompletadas,
      citasPendientes,
      tasaConversion: Math.round(tasaConversion * 100) / 100,
      ingresosGenerados,
      duracionPromedio,
    };
  }

 
}
