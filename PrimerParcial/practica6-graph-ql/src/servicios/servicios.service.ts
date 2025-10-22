import { Injectable, Logger } from '@nestjs/common';
//import { CreateServicioInput } from './dto/create-servicio.input';
//import { UpdateServicioInput } from './dto/update-servicio.input';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Servicio } from './entities/servicio.entity';

@Injectable()
export class ServiciosService {
  private readonly logger = new Logger(ServiciosService.name);
  constructor(private httpService: HttpService) {}

  async findAllServicios() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Servicio[]>('http://localhost:3000/api/servicios/')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async findOneServicioById(id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Servicio>(`http://localhost:3000/api/servicios/${id}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  //async update(id: string, updateServicioInput: UpdateServicioInput) {
  //  return `This action updates a #${id} servicio`;
  //}
}
