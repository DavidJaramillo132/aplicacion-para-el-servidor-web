import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fila } from './entities/fila.entity';
import { CreateFilaDto } from './dto/create-fila.dto';
import { UpdateFilaDto } from './dto/update-fila.dto';

@Injectable()
export class FilaService {
  constructor(
    @InjectRepository(Fila)
    private readonly repo: Repository<Fila>,
  ) {}

  create(dto: CreateFilaDto) {
    const entity = this.repo.create({ ...dto, fecha: new Date(dto.fecha) });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['estacion'] });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id }, relations: ['estacion'] });
    if (!entity) throw new NotFoundException('Fila no encontrada');
    return entity;
  }

  async update(id: string, dto: UpdateFilaDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto.fecha ? { ...dto, fecha: new Date(dto.fecha) } : dto);
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return { id };
  }
}


