import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilaService } from './fila.service';
import { Fila } from './entities/fila.entity';
//import { CreateFilaInput } from './dto/create-fila.input';
//import { UpdateFilaInput } from './dto/update-fila.input';

@Resolver(() => Fila)
export class FilaResolver {
  constructor(private readonly filaService: FilaService) {}

  @Query(() => [Fila], { name: 'filas' })
  findAll() {
    return this.filaService.findAllFila();
  }

  @Query(() => Fila, { name: 'fila' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.filaService.findOneFila(id);
  }

  //@Mutation(() => Fila)
  //updateFila(@Args('updateFilaInput') updateFilaInput: UpdateFilaInput) {
  //  return this.filaService.update(updateFilaInput.id, updateFilaInput);
  //}
}
