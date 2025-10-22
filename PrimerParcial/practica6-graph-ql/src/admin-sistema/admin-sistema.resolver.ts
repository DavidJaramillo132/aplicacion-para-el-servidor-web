import { Resolver, Query, Args } from '@nestjs/graphql';
import { AdminSistemaService } from './admin-sistema.service';
import { AdminSistema } from './entities/admin-sistema.entity';
//import { CreateAdminSistemaInput } from './dto/create-admin-sistema.input';
//import { UpdateAdminSistemaInput } from './dto/update-admin-sistema.input';

@Resolver(() => AdminSistema)
export class AdminSistemaResolver {
  constructor(private readonly adminSistemaService: AdminSistemaService) {}

  @Query(() => [AdminSistema], { name: 'adminsSistema' })
  findAll() {
    return this.adminSistemaService.findAllAdminSistema();
  }

  @Query(() => AdminSistema, { name: 'adminSistema' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.adminSistemaService.findOneAdminSistema(id);
  }

  //@Mutation(() => AdminSistema)
  //updateAdminSistema(@Args('updateAdminSistemaInput') updateAdminSistemaInput: UpdateAdminSistemaInput) {
  //  return this.adminSistemaService.update(updateAdminSistemaInput.id, updateAdminSistemaInput);
  //}
}
