import { registerEnumType } from '@nestjs/graphql';

export enum Rol {
  CLIENTE = 'cliente',
  ADMINNEGOCIO = 'adminNegocio',
  ADMINSISTEMA = 'adminSistema',
}

registerEnumType(Rol, {
  name: 'Rol',
  description: 'Roles disponibles para los usuarios',
});
