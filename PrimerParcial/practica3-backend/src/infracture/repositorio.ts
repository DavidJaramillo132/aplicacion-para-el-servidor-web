// simulacion de base de datos 
import { ICita } from '../domain/cita';
import { IContratoCita } from '../domain/contratoCita';

export class RepositorioCitas implements IContratoCita {
  private citas: ICita[] = [];
  
  constructor(citasIniciales: ICita[]) {
    this.citas = [...citasIniciales];
  }

  async create(cita: ICita): Promise<ICita> {
    this.citas.push(cita);
    console.log(` Cita creada: ${cita.id} para cliente ${cita.clienteID}`);
    return cita;
  }

  async findById(id: string): Promise<ICita | null> {
    const cita = this.citas.find(c => c.id === id);
    return cita || null;
  }

  async list(): Promise<ICita[]> {
    return [...this.citas];
  }

  async update(cita: ICita): Promise<ICita> {
    const index = this.citas.findIndex(c => c.id === cita.id);
    if (index === -1) {
      throw new Error(`Cita con ID ${cita.id} no encontrada`);
    }
    this.citas[index] = cita;
    console.log(` Cita actualizada: ${cita.id}`);
    return cita;
  }

  async delete(id: string): Promise<void> {
    const index = this.citas.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Cita con ID ${id} no encontrada`);
    }
    this.citas.splice(index, 1);
    console.log(`Cita eliminada: ${id}`);
  }
}
