import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombreCompleto!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  @IsIn(['cliente', 'adminNegocio', 'adminSistema'])
  rol!: 'cliente' | 'adminNegocio' | 'adminSistema';

  @IsOptional()
  @IsString()
  telefono?: string;
}
