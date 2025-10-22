import { CreateFilaInput } from './create-fila.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFilaInput extends PartialType(CreateFilaInput) {
  @Field(() => Int)
  id: number;
}
