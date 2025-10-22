import { CreateAdminSistemaInput } from './create-admin-sistema.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAdminSistemaInput extends PartialType(
  CreateAdminSistemaInput,
) {
  @Field(() => Int)
  id: number;
}
