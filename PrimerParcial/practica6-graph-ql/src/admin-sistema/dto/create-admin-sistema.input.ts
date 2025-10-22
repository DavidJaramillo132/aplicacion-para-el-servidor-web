import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminSistemaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
