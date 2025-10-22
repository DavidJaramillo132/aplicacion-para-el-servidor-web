import { Resolver, Query, Args } from '@nestjs/graphql';
import { EstacionesService } from './estaciones.service';
import { Estacion } from './entities/estacion.entity';
//import { CreateEstacionInput } from './dto/create-estacion.input';
//import { UpdateEstacionInput } from './dto/update-estacion.input';

@Resolver(() => Estacion)
export class EstacionesResolver {
  constructor(private readonly estacionesService: EstacionesService) {}

  @Query(() => [Estacion], { name: 'estaciones' })
  findAll() {
    return this.estacionesService.findAllEstaciones();
  }

  @Query(() => Estacion, { name: 'estacion' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.estacionesService.findOneEstacionById(id);
  }

  //@Mutation(() => Estacion)
  //updateEstacion(@Args('updateEstacionInput') updateEstacionInput: UpdateEstacionInput) {
  //  return this.estacionesService.update(updateEstacionInput.id, updateEstacionInput);
  //}
}
