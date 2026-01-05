import { Controller, Post, Get, Body, Param, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TransferenciaService } from '../services/transferencia.service';
import { CreateTransferenciaDto } from '../dto/create-transferencia.dto';
import { Transferencia } from '../entities/transferencia.entity';

@Controller('transferencias')
export class TransferenciaController {
  private readonly logger = new Logger(TransferenciaController.name);

  constructor(
    private readonly transferenciaService: TransferenciaService,
    @Inject('RABBITMQ_SERVICE')
    private readonly rabbitClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createTransferenciaDto: CreateTransferenciaDto): Promise<Transferencia> {
    this.logger.log(`[REST] POST /transferencias - Nueva transferencia solicitada`);
    return this.transferenciaService.create(createTransferenciaDto, this.rabbitClient);
  }

  @Get()
  async findAll(): Promise<Transferencia[]> {
    return this.transferenciaService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Transferencia> {
    const transferencia = await this.transferenciaService.findById(id);
    if (!transferencia) {
      throw new HttpException('Transferencia no encontrada', HttpStatus.NOT_FOUND);
    }
    return transferencia;
  }
}
