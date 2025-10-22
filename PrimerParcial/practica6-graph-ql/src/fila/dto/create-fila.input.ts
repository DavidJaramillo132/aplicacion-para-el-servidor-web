import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFilaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
