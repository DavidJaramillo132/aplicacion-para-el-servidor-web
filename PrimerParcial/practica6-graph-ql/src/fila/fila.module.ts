import { Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { FilaResolver } from './fila.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FilaResolver, FilaService],
})
export class FilaModule {}
