import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHorarioAtencionDto {
  @IsOptional()
  @IsUUID()
  estacion_id?: string;

  @IsOptional()
  @IsInt()
  dia_semana?: number;

  @IsString()
  hora_inicio!: string;

  @IsString()
  hora_fin!: string;
}
