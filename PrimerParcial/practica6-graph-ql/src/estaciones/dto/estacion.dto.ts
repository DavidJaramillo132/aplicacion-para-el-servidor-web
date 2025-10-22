// DTO para estadísticas de estaciones
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({
  description: 'Estadísticas individuales de una estación',
})
export class EstacionStats {
  @Field(() => String)
  estacionId: string;

  @Field(() => String)
  nombreEstacion: string;

  @Field(() => String)
  estado: string;

  @Field(() => Int)
  totalCitas: number;

  @Field(() => Int)
  citasCompletadas: number;

  @Field(() => Int)
  personasEnEspera: number;

  @Field(() => Float)
  tasaUso: number;
}