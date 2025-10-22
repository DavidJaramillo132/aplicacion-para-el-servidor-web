import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({
  description: 'Estadísticas y métricas de un servicio específico',
})
export class EstadisticasServicio {
  @Field(() => String, { description: 'ID del servicio' })
  servicioId: string;

  @Field(() => String, { description: 'Nombre del servicio' })
  nombreServicio: string;

  @Field(() => Int, { description: 'Total de citas para este servicio' })
  totalCitas: number;

  @Field(() => Int, { description: 'Citas completadas' })
  citasCompletadas: number;

  @Field(() => Int, { description: 'Citas pendientes' })
  citasPendientes: number;

  @Field(() => Float, {
    description: 'Tasa de conversión (completadas/total)',
  })
  tasaConversion: number;

  @Field(() => Float, { description: 'Ingresos generados en centavos' })
  ingresosGenerados: number;

  @Field(() => Float, { description: 'Duración promedio real en minutos' })
  duracionPromedio: number;
}
