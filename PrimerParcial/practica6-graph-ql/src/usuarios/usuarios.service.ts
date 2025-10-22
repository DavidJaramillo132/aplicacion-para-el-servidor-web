import { Injectable } from '@nestjs/common';
//import { CreateUsuarioInput } from './dto/create-usuario.input';
//import { UpdateUsuarioInput } from './dto/update-usuario.input';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { Logger } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);
  constructor(private httpService: HttpService) {}

  async findAllUsers() {
    const { data } = await firstValueFrom(
      this.httpService.get<Usuario[]>('http://localhost:3000/api/users/').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  async findOneById(id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Usuario>(`http://localhost:3000/api/users/${id}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  //async update(id: string, updateUsuarioInput: UpdateUsuarioInput) {
  //return `This action updates a #${id} usuario`;
  //}
}
