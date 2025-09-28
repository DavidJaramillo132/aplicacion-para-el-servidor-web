import { ICliente } from "./cliente";

export interface ICita{
    id: string;
    clienteID: string;
    fecha: Date;
    servicio: string;
    tiempoEstimado: string;    
    estado: 'pendiente' | 'cancelada' | 'completada';
}