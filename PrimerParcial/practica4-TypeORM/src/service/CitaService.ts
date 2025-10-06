import { AppDataSource } from "../data-source";
import { Cita } from "../entities/index";


export class CitaService {
  private citaRepository = AppDataSource.getRepository(Cita);

  // Crear
  async crearCita(citaData: Partial<Cita>): Promise<Cita> {
    const cita = this.citaRepository.create(citaData);
    return await this.citaRepository.save(cita);
  }

  // Leer todas
  async obtenerCitas(): Promise<Cita[]> {
    return await this.citaRepository.find();
  }

  // Leer por ID
  async obtenerCita(id: string): Promise<Cita | null> {
    return await this.citaRepository.findOneBy({ id });
  }

  // Actualizar
  async actualizarCita(id: string, datos: Partial<Cita>): Promise<Cita | null> {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) return null;

    this.citaRepository.merge(cita, datos);
    return await this.citaRepository.save(cita);
  }

  // Eliminar
  async eliminarCita(id: number): Promise<boolean> {
    const result = await this.citaRepository.delete(id);
    return result.affected !== 0;
  }
}
