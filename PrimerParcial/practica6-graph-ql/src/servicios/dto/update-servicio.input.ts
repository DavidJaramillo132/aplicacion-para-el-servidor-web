import { CreateServicioInput } from './create-servicio.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateServicioInput extends PartialType(CreateServicioInput) {
  @Field(() => Int)
  id: number;
}
