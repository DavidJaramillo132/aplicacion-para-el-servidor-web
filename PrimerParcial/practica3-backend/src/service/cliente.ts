
import type { ICita } from "../domain/cita.ts";
import type { ICliente } from "../domain/cliente.ts";

export class Cliente implements ICliente {
  constructor(
    public id: string,
    public nombre: string,
    public apellidos: string,
    public email: string,
    public telefono: string,
    public citas: ICita[] 
  ) {}

  // Métodos con lógica de negocio
  agregarCita(cita: ICita) {
    this.citas.push(cita);
  }

  nombreCompleto(): string {
    return `${this.nombre} ${this.apellidos}`;
  }
}

