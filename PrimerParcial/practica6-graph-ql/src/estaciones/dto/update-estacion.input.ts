import { CreateEstacionInput } from './create-estacion.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEstacionInput extends PartialType(CreateEstacionInput) {
  @Field(() => Int)
  id: number;
}
