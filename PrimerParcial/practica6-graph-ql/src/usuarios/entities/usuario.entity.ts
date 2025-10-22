import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Rol } from '../enums/rol.enum';
import { Cita } from '../../citas/entities/cita.entity';
import { Negocio } from '../../negocios/entities/negocio.entity';
import { AdminSistema } from '../../admin-sistema/entities/admin-sistema.entity';

@ObjectType()
export class Usuario {
  @Field(() => ID, { description: 'Id del usuario' })
  id: string;

  @Field(() => String, { description: 'Correo electrónico del usuario' })
  email: string;

  @Field(() => String, { description: 'Contraseña del usuario' })
  password: string;

  @Field(() => Rol, { description: 'Rol del usuario' })
  rol: Rol;

  @Field(() => String, { nullable: true, description: 'Teléfono del usuario' })
  telefono?: string;

  @Field(() => Date, { description: 'Fecha de creación del usuario' })
  creado_en: Date;

  @Field(() => String, { description: 'Nombre completo del usuario' })
  nombreCompleto: string;

  // Relaciones
  @Field(() => [Cita], { description: 'Citas del usuario' })
  citas: Cita[];

  @Field(() => [Negocio], {
    description: 'Negocios administrados por el usuario',
  })
  negocios: Negocio[];

  @Field(() => AdminSistema, {
    nullable: true,
    description: 'Información de admin sistema',
  })
  adminSistema?: AdminSistema;
}
