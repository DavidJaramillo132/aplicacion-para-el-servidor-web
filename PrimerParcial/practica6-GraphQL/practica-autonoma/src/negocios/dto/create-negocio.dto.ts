import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNegocioDto {
  @IsOptional()
  @IsUUID()
  admin_negocio_id?: string;

  @IsString()
  nombre!: string;

  @IsString()
  categoria!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsString()
  hora_atencion?: string;
}
