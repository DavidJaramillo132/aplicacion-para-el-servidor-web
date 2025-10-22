import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateHorarioAtencionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
