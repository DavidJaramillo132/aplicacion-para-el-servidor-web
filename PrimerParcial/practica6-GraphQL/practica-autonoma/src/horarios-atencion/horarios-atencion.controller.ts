import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorariosAtencionService } from './horarios-atencion.service';
import { CreateHorarioAtencionDto } from './dto/create-horario-atencion.dto';
import { UpdateHorarioAtencionDto } from './dto/update-horario-atencion.dto';

@Controller('horarios-atencion')
export class HorariosAtencionController {
  constructor(private readonly service: HorariosAtencionService) {}

  @Post()
  create(@Body() dto: CreateHorarioAtencionDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateHorarioAtencionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
