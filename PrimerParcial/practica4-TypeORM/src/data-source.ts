import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario, Negocio, Estacion, Servicio, Cita, Fila, HorarioAtencion, AdminSistema } from "./entities/index";

//dotenv.config();


/*
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.SUPABASE_HOST!,
  port: Number(process.env.SUPABASE_PORT) || 5432,
  username: process.env.SUPABASE_USER!,
  password: "G6KaXSrjfAYpIVjm"!,
  database: process.env.SUPABASE_DB!,
  synchronize: true,
  logging: true,
  entities: [ Usuario, Negocio, Estacion, Servicio, Cita, Fila, HorarioAtencion, AdminSistema],
  subscribers: [],
  migrations: [],
});
*/
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite", 
  synchronize: true, 
  logging: true,
  entities: [Usuario, Negocio, Estacion, Servicio, Cita, Fila, HorarioAtencion, AdminSistema],
});
