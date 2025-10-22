import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEstacionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
