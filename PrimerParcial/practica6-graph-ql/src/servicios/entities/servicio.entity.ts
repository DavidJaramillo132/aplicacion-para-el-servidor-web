import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Cita } from '../../citas/entities/cita.entity';

@ObjectType()
export class Servicio {
  @Field(() => ID, { description: 'Id del servicio' })
  id: string;

  @Field(() => String, { description: 'Nombre del servicio' })
  nombre: string;

  @Field(() => String, { nullable: true, description: 'Código del servicio' })
  codigo?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Descripción del servicio',
  })
  descripcion?: string;

  @Field(() => Int, { description: 'Duración en minutos del servicio' })
  duracion_minutos: number;

  @Field(() => Int, { description: 'Capacidad del servicio' })
  capacidad: number;

  @Field(() => Boolean, { description: 'Indica si el servicio requiere cita' })
  requiere_cita: boolean;

  @Field(() => Int, { description: 'Precio en centavos del servicio' })
  precio_centavos: number;

  @Field(() => Boolean, { description: 'Indica si el servicio es visible' })
  visible: boolean;

  @Field(() => Date, { description: 'Fecha de creación del servicio' })
  creado_en: Date;

  // Relaciones
  @Field(() => [Cita], { description: 'Citas asociadas al servicio' })
  citas: Cita[];
}
