import type { ICita } from "./cita.ts";

export interface ICliente {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    citas: ICita[]; // IDs de las citas del cliente
}