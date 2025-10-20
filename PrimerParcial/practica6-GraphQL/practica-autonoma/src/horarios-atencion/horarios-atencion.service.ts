import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioAtencion } from './entities/horario-atencion.entity';
import { CreateHorarioAtencionDto } from './dto/create-horario-atencion.dto';
import { UpdateHorarioAtencionDto } from './dto/update-horario-atencion.dto';

@Injectable()
export class HorariosAtencionService {
  constructor(
    @InjectRepository(HorarioAtencion)
    private readonly repo: Repository<HorarioAtencion>,
  ) {}

  create(dto: CreateHorarioAtencionDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['estacion'] });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id }, relations: ['estacion'] });
    if (!entity) throw new NotFoundException('Horario no encontrado');
    return entity;
  }

  async update(id: string, dto: UpdateHorarioAtencionDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return { id };
  }
}


