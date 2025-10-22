import { registerEnumType } from '@nestjs/graphql';

export enum EstadoEstacion {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

registerEnumType(EstadoEstacion, {
  name: 'EstadoEstacion',
  description: 'Estados disponibles para las estaciones',
});
