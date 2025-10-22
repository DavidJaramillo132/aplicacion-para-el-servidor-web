import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({
  description: 'Métricas temporales de citas con comparaciones',
})
export class MetricasTemporales {
  @Field(() => String, { description: 'Período analizado (día, semana, mes)' })
  periodo: string;

  @Field(() => Int, { description: 'Total de citas en el período' })
  totalCitas: number;

  @Field(() => Int, { description: 'Citas completadas' })
  citasCompletadas: number;

  @Field(() => Int, { description: 'Citas canceladas' })
  citasCanceladas: number;

  @Field(() => Float, {
    description: 'Tasa de cumplimiento (completadas/total)',
  })
  tasaCumplimiento: number;

  @Field(() => Float, {
    description: 'Comparación con período anterior (porcentaje)',
  })
  comparacionPeriodoAnterior: number;

  @Field(() => Int, { description: 'Usuarios únicos atendidos' })
  usuariosUnicos: number;
}
