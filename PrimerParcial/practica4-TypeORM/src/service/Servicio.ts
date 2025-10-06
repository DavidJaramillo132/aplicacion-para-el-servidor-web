import { AppDataSource } from "../data-source";
import { Servicio } from "../entities/IServicio";

export class ServicioService {
  private repo = AppDataSource.getRepository(Servicio);

  async create(data: Partial<Servicio>) {
    const nuevo = this.repo.create(data);
    return await this.repo.save(nuevo);
  }

  async findOne(id: string) {
    return await this.repo.findOne({
      where: { id },
      relations: ["citas"],
    });
  }

  async update(id: string, data: Partial<Servicio>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.repo.delete(id);
  }
}
