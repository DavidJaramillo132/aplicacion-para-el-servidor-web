import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({
  description: 'Dashboard unificado con información agregada del negocio',
})
export class DashboardNegocio {
  @Field(() => String, { description: 'ID del negocio' })
  negocioId: string;

  @Field(() => String, { description: 'Nombre del negocio' })
  nombreNegocio: string;

  @Field(() => Int, { description: 'Total de estaciones activas' })
  totalEstaciones: number;

  @Field(() => Int, { description: 'Total de servicios visibles' })
  totalServicios: number;

  @Field(() => Int, { description: 'Total de citas del día' })
  citasHoy: number;

  @Field(() => Int, { description: 'Total de usuarios registrados' })
  totalUsuarios: number;

  @Field(() => Float, { description: 'Tiempo promedio de atención en minutos' })
  tiempoPromedioAtencion: number;

  @Field(() => Int, { description: 'Personas en fila de espera' })
  personasEnFila: number;
}
