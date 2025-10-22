import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEstacionDto {
  @IsOptional()
  @IsUUID()
  negocio_id?: string;

  @IsString()
  nombre!: string;

  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estado?: 'activo' | 'inactivo';
}
