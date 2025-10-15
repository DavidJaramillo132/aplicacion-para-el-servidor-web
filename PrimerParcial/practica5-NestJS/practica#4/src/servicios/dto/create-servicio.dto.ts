import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateServicioDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  duracion_minutos!: number;

  @IsOptional()
  @IsInt()
  capacidad?: number;

  @IsOptional()
  @IsBoolean()
  requiere_cita?: boolean;

  @IsOptional()
  @IsInt()
  precio_centavos?: number;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
