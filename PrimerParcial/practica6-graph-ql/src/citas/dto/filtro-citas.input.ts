import { InputType, Field, Int } from '@nestjs/graphql';
import { Estado } from '../enums/estados.enums';

@InputType({
  description: 'Input para filtrar citas con múltiples criterios',
})
export class FiltroCitasInput {
  @Field(() => String, { nullable: true, description: 'ID del usuario' })
  usuarioId?: string;

  @Field(() => String, { nullable: true, description: 'ID del servicio' })
  servicioId?: string;

  @Field(() => Estado, { nullable: true, description: 'Estado de la cita' })
  estado?: Estado;

  @Field(() => String, { nullable: true, description: 'Fecha de inicio (YYYY-MM-DD)' })
  fechaInicio?: string;

  @Field(() => String, { nullable: true, description: 'Fecha de fin (YYYY-MM-DD)' })
  fechaFin?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10, description: 'Límite de resultados' })
  limite?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0, description: 'Offset para paginación' })
  offset?: number;
}
