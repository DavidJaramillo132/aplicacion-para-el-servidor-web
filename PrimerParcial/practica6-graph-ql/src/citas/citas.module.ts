import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasResolver } from './citas.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CitasResolver, CitasService],
})
export class CitasModule {}
