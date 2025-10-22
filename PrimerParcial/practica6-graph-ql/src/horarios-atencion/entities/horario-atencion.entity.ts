import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Estacion } from '../../estaciones/entities/estacion.entity';

@ObjectType()
export class HorarioAtencion {
  @Field(() => ID, { description: 'Id del horario de atención' })
  id: string;

  @Field(() => String, { description: 'Id de la estación asociada' })
  estacion_id: string;

  @Field(() => Int, { nullable: true, description: 'Día de la semana (0-6)' })
  dia_semana?: number;

  @Field(() => String, { description: 'Hora de inicio' })
  hora_inicio: string;

  @Field(() => String, { description: 'Hora de fin' })
  hora_fin: string;

  @Field(() => Date, { description: 'Fecha de creación del horario' })
  creado_en: Date;

  // Relaciones
  @Field(() => Estacion, { description: 'Estación asociada' })
  estacion: Estacion;
}
