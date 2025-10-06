import { AppDataSource } from "../data-source";
import { AdminSistema } from "../entities/IAdminSistema";

export class AdminSistemaService {
  private repo = AppDataSource.getRepository(AdminSistema);

  async create(data: Partial<AdminSistema>) {
    const nuevo = this.repo.create(data);
    return await this.repo.save(nuevo);
  }

  async findAll() {
    return await this.repo.find({
      relations: ["usuario"], // Incluye datos del usuario relacionado
    });
  }

  async findOne(id: string) {
    return await this.repo.findOne({
      where: { id },
      relations: ["usuario"],
    });
  }

  async update(id: string, data: Partial<AdminSistema>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.repo.delete(id);
  }
}
