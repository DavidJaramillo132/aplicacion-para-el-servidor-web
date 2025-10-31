import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispositivo } from './entities/dispositivo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DispositivosService {
  constructor(
    @InjectRepository(Dispositivo)
    private dispositoRepositorio: Repository<Dispositivo>
  ){}

  async create(createDispositivoDto: CreateDispositivoDto) {
    const dispositivo = await this.dispositoRepositorio.create(createDispositivoDto);
    return await this.dispositoRepositorio.save(dispositivo);
  }

  async findAll() {
    return await this.dispositoRepositorio.find()
  }

  async findOne(id: string) {
    const dispositivoEncontrado = await this.dispositoRepositorio.findOneBy({ id:id });
    if (!dispositivoEncontrado){
      throw new NotFoundException("No se encontro")
    }
    return dispositivoEncontrado;
  }

  async update(id: string, updateDispositivoDto: UpdateDispositivoDto) {
    const dispositivoEncontrado = await this.dispositoRepositorio.findOneBy({ id:id });
    if (!dispositivoEncontrado){
      throw new NotFoundException("No se encontro ERROR 404")
    }
    await this.dispositoRepositorio.update(id, updateDispositivoDto);
    return this.dispositoRepositorio.findOneBy({ id:id });
  }

  async remove(id: string) {
    const dispositivoEncontradfo = await this.findOne(id);
    const dispositivoEncontrado = await this.dispositoRepositorio.delete({ id:id });
  }
}
