import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CuentaService } from '../services/cuenta.service';
import { Cuenta } from '../entities/cuenta.entity';

@Controller('cuentas')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  @Get()
  async findAll(): Promise<Cuenta[]> {
    return this.cuentaService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Cuenta> {
    const cuenta = await this.cuentaService.findById(id);
    if (!cuenta) {
      throw new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
    }
    return cuenta;
  }

  @Post()
  async create(@Body() createCuentaDto: Partial<Cuenta>): Promise<Cuenta> {
    return this.cuentaService.create(createCuentaDto);
  }
}
