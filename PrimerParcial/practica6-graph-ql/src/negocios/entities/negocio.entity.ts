import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Estacion } from '../../estaciones/entities/estacion.entity';

@ObjectType()
export class Negocio {
  @Field(() => ID, { description: 'Id del negocio' })
  id: string;

  @Field(() => String, { description: 'Id del administrador del negocio' })
  admin_negocio_id: string;

  @Field(() => String, { description: 'Nombre del negocio' })
  nombre: string;

  @Field(() => String, { description: 'Categoría del negocio' })
  categoria: string;

  @Field(() => String, {
    nullable: true,
    description: 'Descripción del negocio',
  })
  descripcion?: string;

  @Field(() => String, { nullable: true, description: 'Teléfono del negocio' })
  telefono?: string;

  @Field(() => String, { nullable: true, description: 'Correo del negocio' })
  correo?: string;

  @Field(() => String, {
    nullable: true,
    description: 'URL de la imagen del negocio',
  })
  imagen_url?: string;

  @Field(() => Boolean, { description: 'Estado del negocio' })
  estado: boolean;

  @Field(() => String, { nullable: true, description: 'Horario de atención' })
  hora_atencion?: string;

  @Field(() => Date, { description: 'Fecha de creación del negocio' })
  creado_en: Date;

  // Relaciones
  @Field(() => Usuario, { description: 'Administrador del negocio' })
  adminNegocio: Usuario;

  @Field(() => [Estacion], { description: 'Estaciones del negocio' })
  estaciones: Estacion[];
}
