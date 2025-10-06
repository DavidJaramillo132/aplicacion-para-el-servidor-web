import { AppDataSource } from "../data-source";
import { Estacion } from "../entities/IEstacion";

export class EstacionService {
    private repo = AppDataSource.getRepository(Estacion);

    // Crear nueva estación
    async create(data: Partial<Estacion>): Promise<Estacion> {
        const estacion = this.repo.create(data);
        return await this.repo.save(estacion);
    }

    // Obtener todas las estaciones
    async findAll(): Promise<Estacion[]> {
        return await this.repo.find({ relations: ["negocio", "filas", "horarios"] });
    }

    // Obtener estación por ID
    async findById(id: string): Promise<Estacion | null> {
        return await this.repo.findOne({
            where: { id },
            relations: ["negocio", "filas", "horarios"]
        });
    }

    // Actualizar estación
    async update(id: string, data: Partial<Estacion>): Promise<Estacion | null> {
        const estacion = await this.findById(id);
        if (!estacion) return null;
        this.repo.merge(estacion, data);
        return await this.repo.save(estacion);
    }

    // Eliminar estación
    async delete(id: string): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
