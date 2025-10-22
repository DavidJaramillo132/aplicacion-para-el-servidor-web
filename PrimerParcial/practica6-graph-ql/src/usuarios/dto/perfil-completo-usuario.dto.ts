import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cita } from 'src/citas/entities/cita.entity';

@ObjectType({
  description: 'Perfil completo del usuario con información agregada',
})
export class PerfilCompletoUsuario {
  @Field(() => String, { description: 'ID del usuario' })
  id: string;

  @Field(() => String, { description: 'Nombre completo del usuario' })
  nombre: string;

  @Field(() => String, { description: 'Email del usuario' })
  email: string;

  @Field(() => String, { description: 'Teléfono del usuario' })
  telefono: string;

  @Field(() => Int, { description: 'Total de citas realizadas' })
  totalCitas: number;

  @Field(() => Int, { description: 'Citas completadas' })
  citasCompletadas: number;

  @Field(() => Int, { description: 'Citas pendientes' })
  citasPendientes: number;

  @Field(() => Int, { description: 'Citas canceladas' })
  citasCanceladas: number;

}
