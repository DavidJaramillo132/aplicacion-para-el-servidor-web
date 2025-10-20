import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioAtencionDto } from './create-horario-atencion.dto';

export class UpdateHorarioAtencionDto extends PartialType(CreateHorarioAtencionDto) {}


