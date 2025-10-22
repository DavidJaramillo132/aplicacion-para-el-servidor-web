import { Injectable, Logger } from '@nestjs/common';
//import { CreateNegocioInput } from './dto/create-negocio.input';
//import { UpdateNegocioInput } from './dto/update-negocio.input';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Negocio } from './entities/negocio.entity';

@Injectable()
export class NegociosService {
  private readonly logger = new Logger(NegociosService.name);
  constructor(private httpService: HttpService) {}

  async findAllNegocios() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Negocio[]>('http://localhost:3000/api/negocios/')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async findOneNegocio(id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Negocio>(`http://localhost:3000/api/negocios/${id}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  //async update(id: string, updateNegocioInput: UpdateNegocioInput) {
  //  return `This action updates a #${id} negocio`;
  //}
}
