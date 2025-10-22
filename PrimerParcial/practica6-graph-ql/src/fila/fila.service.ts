import { Injectable, Logger } from '@nestjs/common';
//import { CreateFilaInput } from './dto/create-fila.input';
//import { UpdateFilaInput } from './dto/update-fila.input';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Fila } from './entities/fila.entity';

@Injectable()
export class FilaService {
  private readonly logger = new Logger(FilaService.name);
  constructor(private httpService: HttpService) {}

  async findAllFila() {
    const { data } = await firstValueFrom(
      this.httpService.get<Fila[]>('http://localhost:3000/api/fila/').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  async findOneFila(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<Fila>(`http://localhost:3000/api/fila/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  //async update(id: string, updateFilaInput: UpdateFilaInput) {
  //  return `This action updates a #${id} fila`;
  //}
}
