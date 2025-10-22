import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({
  description: 'Item individual del ranking de servicios',
})
export class ServicioRanking {
  @Field(() => String)
  id: string;

  @Field(() => String)
  nombre: string;

  @Field(() => Int)
  totalReservas: number;

  @Field(() => Float)
  ingresos: number;

  @Field(() => Int)
  posicion: number;
}

@ObjectType({
  description: 'Ranking de servicios más solicitados con métricas',
})
export class RankingServicios {
  @Field(() => [ServicioRanking], {
    description: 'Lista de servicios ordenados por popularidad',
  })
  servicios: ServicioRanking[];

  @Field(() => Int, { description: 'Total de servicios en el ranking' })
  totalServicios: number;

  @Field(() => String, { description: 'Criterio de ordenamiento usado' })
  criterioOrden: string;
}
