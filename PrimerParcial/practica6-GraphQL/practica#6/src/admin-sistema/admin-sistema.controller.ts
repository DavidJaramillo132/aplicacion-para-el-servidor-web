import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminSistemaService } from './admin-sistema.service';
import { CreateAdminSistemaDto } from './dto/create-admin-sistema.dto';
import { UpdateAdminSistemaDto } from './dto/update-admin-sistema.dto';

@Controller('admin-sistema')
export class AdminSistemaController {
  constructor(private readonly service: AdminSistemaService) {}

  @Post()
  create(@Body() dto: CreateAdminSistemaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminSistemaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


