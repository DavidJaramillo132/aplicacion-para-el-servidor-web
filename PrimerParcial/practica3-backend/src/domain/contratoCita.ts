import { ICita } from './cita';

export interface IContratoCita {
  create(cita: ICita): Promise<ICita>;
  findById(id: string): Promise<ICita | null>;
  list(): Promise<ICita[]>;
  update(cita: ICita): Promise<ICita>;
  delete(id: string): Promise<void>;
}
