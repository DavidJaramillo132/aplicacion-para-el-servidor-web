import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminSistema } from './entities/admin-sistema.entity';
import { CreateAdminSistemaDto } from './dto/create-admin-sistema.dto';
import { UpdateAdminSistemaDto } from './dto/update-admin-sistema.dto';

@Injectable()
export class AdminSistemaService {
  constructor(
    @InjectRepository(AdminSistema)
    private readonly repo: Repository<AdminSistema>,
  ) {}

  create(dto: CreateAdminSistemaDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('AdminSistema no encontrado');
    return entity;
  }

  async update(id: string, dto: UpdateAdminSistemaDto) {
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
