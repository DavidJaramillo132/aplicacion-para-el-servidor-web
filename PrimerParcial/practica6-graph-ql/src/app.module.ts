import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';


import { UsuariosModule } from './usuarios/usuarios.module';
import { CitasModule } from './citas/citas.module';
import { ServiciosModule } from './servicios/servicios.module';
import { AdminSistemaModule } from './admin-sistema/admin-sistema.module';
import { NegociosModule } from './negocios/negocios.module';
import { EstacionesModule } from './estaciones/estaciones.module';
import { FilaModule } from './fila/fila.module';
import { HorariosAtencionModule } from './horarios-atencion/horarios-atencion.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Apollo Playground
    }),
    HttpModule.register({
      baseURL: 'http://localhost:3000', // URL del servicio REST
      timeout: 5000,
      maxRedirects: 5,
    }),
    UsuariosModule,
    CitasModule,
    ServiciosModule,
    AdminSistemaModule,
    NegociosModule,
    EstacionesModule,
    FilaModule,
    HorariosAtencionModule,

    // Aquí se importarán los módulos de resolvers
  ],
})
export class AppModule {}
