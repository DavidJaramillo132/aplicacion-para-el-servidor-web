import { Resolver, Query, Args } from '@nestjs/graphql';
import { HorariosAtencionService } from './horarios-atencion.service';
import { HorarioAtencion } from './entities/horario-atencion.entity';
//import { CreateHorarioAtencionInput } from './dto/create-horario-atencion.input';
//import { UpdateHorarioAtencionInput } from './dto/update-horario-atencion.input';

@Resolver(() => HorarioAtencion)
export class HorariosAtencionResolver {
  constructor(
    private readonly horariosAtencionService: HorariosAtencionService,
  ) {}

  @Query(() => [HorarioAtencion], { name: 'horariosAtencion' })
  findAll() {
    return this.horariosAtencionService.findAllHorariosAtencion();
  }

  @Query(() => HorarioAtencion, { name: 'horarioAtencion' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.horariosAtencionService.findOneHorarioAtencion(id);
  }

  //@Mutation(() => HorarioAtencion)
  //updateHorarioAtencion(@Args('updateHorarioAtencionInput') updateHorarioAtencionInput: UpdateHorarioAtencionInput) {
  //  return this.horariosAtencionService.update(updateHorarioAtencionInput.id, updateHorarioAtencionInput);
  //}
}
