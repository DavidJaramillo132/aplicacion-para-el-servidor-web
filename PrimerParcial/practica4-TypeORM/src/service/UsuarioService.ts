import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities";

export class UsuarioService {
	private repo: Repository<Usuario>;

	constructor() {
		this.repo = AppDataSource.getRepository(Usuario);
	}

	async create(data: Partial<Usuario>): Promise<Usuario> {
		const entity = this.repo.create(data as any) as unknown as Usuario;
		const saved = await this.repo.save(entity);
		return saved as Usuario;
	}

	async findAll(): Promise<Usuario[]> {
		return this.repo.find({ relations: ["citas", "negociosAdministrados", "adminSistema"] });
	}

	async findOne(id: string): Promise<Usuario | null> {
		return this.repo.findOne({ where: { id }, relations: ["citas", "negociosAdministrados", "adminSistema"] });
	}

	async update(id: string, data: Partial<Usuario>): Promise<Usuario | null> {
		const existing = await this.repo.findOneBy({ id });
		if (!existing) return null;
		this.repo.merge(existing, data as any);
		return this.repo.save(existing);
	}

	async remove(id: string): Promise<boolean> {
		const res = await this.repo.delete(id);
		return !!(res.affected && res.affected > 0);
	}
}

export default new UsuarioService();