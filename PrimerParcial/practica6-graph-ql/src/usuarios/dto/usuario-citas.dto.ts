import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CitaPendienteDTO {
  @Field()
  fecha: string;

  @Field({ nullable: true })
  servicio?: string;
}

@ObjectType()
export class UsuarioCitasDTO {
  @Field()
  usuario: string;

  @Field(() => [CitaPendienteDTO])
  citas: CitaPendienteDTO[];
}
