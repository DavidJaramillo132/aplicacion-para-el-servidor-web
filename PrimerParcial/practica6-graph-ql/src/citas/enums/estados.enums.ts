import { registerEnumType } from '@nestjs/graphql';

export enum Estado {
  PENDIENTE = 'pendiente',
  ATENDIDA = 'atendida',
  CANCELADA = 'cancelada',
}

registerEnumType(Estado, {
  name: 'Estado',
  description: 'Estados disponibles para las citas',
});
