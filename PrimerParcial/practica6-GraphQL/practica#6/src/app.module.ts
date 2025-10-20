import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Servicio } from './servicios/entities/servicio.entity';
import { Cita } from './citas/entities/cita.entity';
import { UsersModule } from './users/users.module';
import { ServiciosModule } from './servicios/servicios.module';
import { CitasModule } from './citas/citas.module';
import { AdminSistema } from './admin-sistema/entities/admin-sistema.entity';
import { Estacion } from './estaciones/entities/estacion.entity';
import { Fila } from './fila/entities/fila.entity';
import { HorarioAtencion } from './horarios-atencion/entities/horario-atencion.entity';
import { Negocio } from './negocios/entities/negocio.entity';
import { AdminSistemaModule } from './admin-sistema/admin-sistema.module';
import { EstacionesModule } from './estaciones/estaciones.module';
import { FilaModule } from './fila/fila.module';
import { HorariosAtencionModule } from './horarios-atencion/horarios-atencion.module';
import { NegociosModule } from './negocios/negocios.module';

/**
 * Módulo principal de la aplicación
 * Configura TypeORM con SQLite e importa todos los módulos de la aplicación
 */
@Module({
  imports: [
    // Configuración de TypeORM con SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // Archivo de base de datos SQLite
      entities: [
        // Entidades principales
        User,
        Servicio,
        Cita,
        // Nuevas entidades segun esquema
        AdminSistema,
        Negocio,
        Estacion,
        Fila,
        HorarioAtencion,
      ],
      synchronize: true, // Sincronizar automáticamente el esquema (solo para desarrollo)
      logging: true, // Habilitar logs de SQL para depuración
    }),
    // Módulos principales
    UsersModule,
    ServiciosModule,
    CitasModule,
    // Nuevos modulos
    AdminSistemaModule,
    NegociosModule,
    EstacionesModule,
    FilaModule,
    HorariosAtencionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
