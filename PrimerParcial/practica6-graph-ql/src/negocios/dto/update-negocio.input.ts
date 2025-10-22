import { CreateNegocioInput } from './create-negocio.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNegocioInput extends PartialType(CreateNegocioInput) {
  @Field(() => Int)
  id: number;
}
