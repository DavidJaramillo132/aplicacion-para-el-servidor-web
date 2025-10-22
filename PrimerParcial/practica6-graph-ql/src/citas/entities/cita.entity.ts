import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Estado } from '../enums/estados.enums';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';

@ObjectType()
export class Cita {
  @Field(() => ID, { description: 'Id cita' })
  id: string;

  @Field(() => String, { description: 'Id del usuario asociado a la cita' })
  usuario_id: string;

  @Field(() => String, { description: 'Id del servicio asociado a la cita' })
  servicio_id: string;

  @Field(() => Date, { description: 'Fecha de la cita' })
  fecha: Date;

  @Field(() => String, { description: 'Hora de inicio de la cita' })
  hora_inicio: string;

  @Field(() => String, { description: 'Hora de fin de la cita' })
  hora_fin: string;

  @Field(() => Estado, { description: 'Estado de la cita' })
  estado: Estado;

  @Field(() => Date, { description: 'Fecha de creación de la cita' })
  creadoEn: Date;

  // Relaciones
  @Field(() => Usuario, { description: 'Usuario asociado a la cita' })
  usuario: Usuario;

  @Field(() => Servicio, { description: 'Servicio asociado a la cita' })
  servicio: Servicio;
}
