import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminSistemaDto } from './create-admin-sistema.dto';

export class UpdateAdminSistemaDto extends PartialType(CreateAdminSistemaDto) {}


