import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAdminSistemaDto {
  @IsOptional()
  @IsUUID()
  usuario_id?: string;

  @IsString()
  nombre!: string;

  @IsString()
  apellidos!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
