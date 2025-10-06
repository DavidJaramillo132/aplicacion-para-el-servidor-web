import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario, Negocio, Estacion, Servicio, Cita, Fila, HorarioAtencion, AdminSistema} from "./entities/index";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: process.env.SUPABASE_PORT ? parseInt(process.env.SUPABASE_PORT) : 5432,
  username: process.env.SUPABASE_USER,
  password: "your_password",
  database: "your_database",
  synchronize: true,
  logging: true,
  entities: [Usuario, Negocio, Estacion, Servicio, Cita, Fila, HorarioAtencion, AdminSistema],
  subscribers: [],
  migrations: [],
});