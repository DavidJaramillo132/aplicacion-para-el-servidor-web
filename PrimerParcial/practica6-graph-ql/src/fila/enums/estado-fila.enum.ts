import { registerEnumType } from '@nestjs/graphql';

export enum EstadoFila {
  ABIERTA = 'abierta',
  CERRADA = 'cerrada',
}

registerEnumType(EstadoFila, {
  name: 'EstadoFila',
  description: 'Estados disponibles para las filas',
});
