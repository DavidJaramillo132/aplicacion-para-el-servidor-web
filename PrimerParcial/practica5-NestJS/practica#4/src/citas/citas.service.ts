import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Cita } from './entities/cita.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita) private readonly repo: Repository<Cita>,
  ) {}

  create(dto: CreateCitaDto) {
    const entity = this.repo.create({
      ...dto,
      fecha: new Date(dto.fecha),
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['usuario', 'servicio'] });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id }, relations: ['usuario', 'servicio'] });
    if (!entity) throw new NotFoundException('Cita no encontrada');
    return entity;
  }

  async update(id: string, dto: UpdateCitaDto) {
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
