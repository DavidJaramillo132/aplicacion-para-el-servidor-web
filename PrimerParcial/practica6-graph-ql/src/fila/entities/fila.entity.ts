import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EstadoFila } from '../enums/estado-fila.enum';
import { Estacion } from '../../estaciones/entities/estacion.entity';

@ObjectType()
export class Fila {
  @Field(() => ID, { description: 'Id de la fila' })
  id: string;

  @Field(() => String, { description: 'Id de la estación asociada' })
  estacion_id: string;

  @Field(() => Date, { description: 'Fecha de la fila' })
  fecha: Date;

  @Field(() => String, { description: 'Hora de inicio de la fila' })
  hora_inicio: string;

  @Field(() => String, { description: 'Hora de fin de la fila' })
  hora_fin: string;

  @Field(() => EstadoFila, { description: 'Estado de la fila' })
  estado: EstadoFila;

  @Field(() => Date, { description: 'Fecha de creación de la fila' })
  creado_en: Date;

  // Relaciones
  @Field(() => Estacion, { description: 'Estación asociada' })
  estacion: Estacion;
}
