import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ResumenNegocio {
  @Field(() => String)
  negocioId: string;

  @Field(() => Int)
  totalEstaciones: number;

  @Field(() => Int)
  totalServicios: number;

  @Field(() => Int)
  totalCitas: number;

  @Field(() => Int)
  citasPendientes: number;

  @Field(() => Int)
  citasCompletadas: number;
}
