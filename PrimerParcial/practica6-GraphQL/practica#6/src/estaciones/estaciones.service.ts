import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estacion } from './entities/estacion.entity';
import { CreateEstacionDto } from './dto/create-estacion.dto';
import { UpdateEstacionDto } from './dto/update-estacion.dto';

@Injectable()
export class EstacionesService {
  constructor(
    @InjectRepository(Estacion)
    private readonly repo: Repository<Estacion>,
  ) {}

  create(dto: CreateEstacionDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['negocio'] });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id }, relations: ['negocio'] });
    if (!entity) throw new NotFoundException('Estacion no encontrada');
    return entity;
  }

  async update(id: string, dto: UpdateEstacionDto) {
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


