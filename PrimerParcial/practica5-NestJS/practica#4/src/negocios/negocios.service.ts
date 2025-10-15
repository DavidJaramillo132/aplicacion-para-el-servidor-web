import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Negocio } from './entities/negocio.entity';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';

@Injectable()
export class NegociosService {
  constructor(
    @InjectRepository(Negocio)
    private readonly repo: Repository<Negocio>,
  ) {}

  create(dto: CreateNegocioDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['estaciones'] });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id }, relations: ['estaciones'] });
    if (!entity) throw new NotFoundException('Negocio no encontrado');
    return entity;
  }

  async update(id: string, dto: UpdateNegocioDto) {
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


