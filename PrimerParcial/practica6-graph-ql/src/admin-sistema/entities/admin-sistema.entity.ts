import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
export class AdminSistema {
  @Field(() => ID, { description: 'Id del administrador del sistema' })
  id: string;

  @Field(() => String, { description: 'Id del usuario asociado' })
  usuario_id: string;

  @Field(() => String, { description: 'Nombre del administrador' })
  nombre: string;

  @Field(() => String, { description: 'Apellidos del administrador' })
  apellidos: string;

  @Field(() => String, { description: 'Email del administrador' })
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'Teléfono del administrador',
  })
  telefono?: string;

  // Relaciones
  @Field(() => Usuario, { description: 'Usuario asociado' })
  usuario: Usuario;
}
