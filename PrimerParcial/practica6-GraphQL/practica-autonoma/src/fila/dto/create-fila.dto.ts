import { IsDateString, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFilaDto {
  @IsOptional()
  @IsUUID()
  estacion_id?: string;

  @IsDateString()
  fecha!: string;

  @IsString()
  hora_inicio!: string;

  @IsString()
  hora_fin!: string;

  @IsOptional()
  @IsIn(['abierta', 'cerrada'])
  estado?: 'abierta' | 'cerrada';
}


