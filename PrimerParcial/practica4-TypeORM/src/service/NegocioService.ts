import { AppDataSource } from "../data-source";
import { Negocio } from "../entities/INegocio";

const negocioRepo = AppDataSource.getRepository(Negocio);

export class NegocioService {
  static async crear(data: Partial<Negocio>): Promise<Negocio> {
    const nuevo = negocioRepo.create(data);
    return await negocioRepo.save(nuevo);
  }

  static async obtenerTodos(): Promise<Negocio[]> {
    return await negocioRepo.find();
  }

  static async obtenerPorId(id: string): Promise<Negocio | null> {
    return await negocioRepo.findOneBy({ id });
  }

  static async actualizar(id: string, data: Partial<Negocio>): Promise<Negocio | null> {
    const negocio = await negocioRepo.findOneBy({ id });
    if (!negocio) return null;

    negocioRepo.merge(negocio, data);
    return await negocioRepo.save(negocio);
  }

  static async eliminar(id: string): Promise<boolean> {
    const result = await negocioRepo.delete(id);
    return result.affected !== 0;
  }
}