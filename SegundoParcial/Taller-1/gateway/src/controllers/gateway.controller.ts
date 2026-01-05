import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProxyService } from '../services/proxy.service';

@Controller()
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('health')
  health() {
    return { status: 'OK' };
  }

  @Get('cuentas')
  getAllCuentas() {
    return this.proxyService.proxyToMaster('GET', '/cuentas');
  }

  @Get('cuentas/:id')
  getCuentaById(@Param('id') id: string) {
    return this.proxyService.proxyToMaster('GET', `/cuentas/${id}`);
  }

  @Post('cuentas')
  createCuenta(@Body() createCuentaDto: any) {
    return this.proxyService.proxyToMaster('POST', '/cuentas', createCuentaDto);
  }

  @Get('transferencias')
  getAllTransferencias() {
    return this.proxyService.proxyToWorker('GET', '/transferencias');
  }

  @Get('transferencias/:id')
  getTransferenciaById(@Param('id') id: string) {
    return this.proxyService.proxyToWorker('GET', `/transferencias/${id}`);
  }

  @Post('transferencias')
  createTransferencia(@Body() createTransferenciaDto: any) {
    return this.proxyService.proxyToWorker('POST', '/transferencias', createTransferenciaDto);
  }
}
