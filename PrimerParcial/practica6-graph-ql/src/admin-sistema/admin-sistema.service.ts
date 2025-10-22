import { Injectable, Logger } from '@nestjs/common';
//import { CreateAdminSistemaInput } from './dto/create-admin-sistema.input';
//import { UpdateAdminSistemaInput } from './dto/update-admin-sistema.input';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AdminSistema } from './entities/admin-sistema.entity';

@Injectable()
export class AdminSistemaService {
  private readonly logger = new Logger(AdminSistemaService.name);
  constructor(private httpService: HttpService) {}

  async findAllAdminSistema() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<AdminSistema[]>('http://localhost:3000/api/admin-sistema/')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async findOneAdminSistema(id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<AdminSistema>(`http://localhost:3000/api/admin-sistema/${id}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  //async update(id: string, updateAdminSistemaInput: UpdateAdminSistemaInput) {
  //  return `This action updates a #${id} admin sistema`;
  //}
}
