import { Injectable, Logger } from '@nestjs/common';
//import { CreateCitaInput } from './dto/create-cita.input';
//import { UpdateCitaInput } from './dto/update-cita.input';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Cita } from './entities/cita.entity';

@Injectable()
export class CitasService {
  private readonly logger = new Logger(CitasService.name);
  constructor(private httpService: HttpService) {}

  async findAllCitas() {
    const { data } = await firstValueFrom(
      this.httpService.get<Cita[]>('http://localhost:3000/api/citas/').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  async findOneCita(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<Cita>(`http://localhost:3000/api/citas/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  async obtenerCitasPorUsuario(usuarioId: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Cita[]>(`http://localhost:3000/api/citas?usuarioId=${usuarioId}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  //async update(id: string, updateCitaInput: UpdateCitaInput) {
  //  return `This action updates a #${id} cita`;
  //}
}
