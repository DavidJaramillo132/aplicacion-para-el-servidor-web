import { Injectable, Logger } from '@nestjs/common';
//import { CreateEstacionInput } from './dto/create-estacion.input';
//import { UpdateEstacionInput } from './dto/update-estacion.input';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Estacion } from './entities/estacion.entity';

@Injectable()
export class EstacionesService {
  private readonly logger = new Logger(EstacionesService.name);
  constructor(private httpService: HttpService) {}

  async findAllEstaciones() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Estacion[]>('http://localhost:3000/api/estaciones/')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async findOneEstacionById(id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Estacion>(`http://localhost:3000/api/estaciones/${id}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  //async update(id: string, updateEstacionInput: UpdateEstacionInput) {
  //  return `This action updates a #${id} estacion`;
  //}
}
