import { Module } from '@nestjs/common';
import { AdminSistemaService } from './admin-sistema.service';
import { AdminSistemaResolver } from './admin-sistema.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AdminSistemaResolver, AdminSistemaService],
})
export class AdminSistemaModule {}
