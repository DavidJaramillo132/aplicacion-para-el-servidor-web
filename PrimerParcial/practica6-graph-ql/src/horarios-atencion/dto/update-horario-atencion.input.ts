import { CreateHorarioAtencionInput } from './create-horario-atencion.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHorarioAtencionInput extends PartialType(
  CreateHorarioAtencionInput,
) {
  @Field(() => Int)
  id: number;
}
