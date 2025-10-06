import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario, Negocio, Estacion, Servicio, Cita, Fila, HorarioAtencion, AdminSistema } from "./entities/index";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,  
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  synchronize: true,
  logging: true,
  entities: [ Usuario, Negocio, Estacion, Servicio, Cita, Fila, HorarioAtencion, AdminSistema],
  subscribers: [],
  migrations: [],
});
