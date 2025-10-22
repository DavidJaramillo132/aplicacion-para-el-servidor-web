import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSistema } from './entities/admin-sistema.entity';
import { AdminSistemaService } from './admin-sistema.service';
import { AdminSistemaController } from './admin-sistema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminSistema])],
  controllers: [AdminSistemaController],
  providers: [AdminSistemaService],
})
export class AdminSistemaModule {}
