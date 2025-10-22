import { Injectable, Logger } from '@nestjs/common';
//import { CreateHorarioAtencionInput } from './dto/create-horario-atencion.input';
//import { UpdateHorarioAtencionInput } from './dto/update-horario-atencion.input';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { HorarioAtencion } from './entities/horario-atencion.entity';

@Injectable()
export class HorariosAtencionService {
  private readonly logger = new Logger(HorariosAtencionService.name);
  constructor(private httpService: HttpService) {}

  async findAllHorariosAtencion() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<HorarioAtencion[]>('http://localhost:3000/api/horarios-atencion/')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async findOneHorarioAtencion(id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<HorarioAtencion>(
          `http://localhost:3000/api/horarios-atencion/${id}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  //async update(id: string, updateHorarioAtencionInput: UpdateHorarioAtencionInput) {
  //  return `This action updates a #${id} horario atencion`;
  //}
}
