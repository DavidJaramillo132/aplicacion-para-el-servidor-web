import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNegocioInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
