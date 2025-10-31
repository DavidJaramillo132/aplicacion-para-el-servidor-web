import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fila } from './entities/fila.entity';
import { FilaService } from './fila.service';
import { FilaController } from './fila.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fila])],
  controllers: [FilaController],
  providers: [FilaService],
})
export class FilaModule {}
