import { AppDataSource } from "../data-source";
import { Cita } from "../entities/index";
export class CitaService {
    private citaRepository = AppDataSource.getRepository(Cita);

    async crearCita(citaData: Partial<Cita>): Promise<Cita> {
        const cita = this.citaRepository.create(citaData);
        return await this.citaRepository.save(cita);
    }
}