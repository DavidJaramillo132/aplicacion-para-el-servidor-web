import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EstadoEstacion } from '../enums/estado-estacion.enum';
import { Negocio } from '../../negocios/entities/negocio.entity';
import { HorarioAtencion } from '../../horarios-atencion/entities/horario-atencion.entity';
import { Fila } from '../../fila/entities/fila.entity';

@ObjectType()
export class Estacion {
  @Field(() => ID, { description: 'Id de la estación' })
  id: string;

  @Field(() => String, { description: 'Id del negocio asociado' })
  negocio_id: string;

  @Field(() => String, { description: 'Nombre de la estación' })
  nombre: string;

  @Field(() => EstadoEstacion, { description: 'Estado de la estación' })
  estado: EstadoEstacion;

  @Field(() => Date, { description: 'Fecha de creación de la estación' })
  creado_en: Date;

  // Relaciones
  @Field(() => Negocio, { description: 'Negocio asociado' })
  negocio: Negocio;

  @Field(() => [HorarioAtencion], { description: 'Horarios de atención' })
  horariosAtencion: HorarioAtencion[];

  @Field(() => [Fila], { description: 'Filas asociadas' })
  filas: Fila[];
}
