import type { ICita } from "./cita.js"; 
export interface IFila {
    id: string;
    posicion: number;
    cita: ICita[]; // IDs de las citas en la fila

}