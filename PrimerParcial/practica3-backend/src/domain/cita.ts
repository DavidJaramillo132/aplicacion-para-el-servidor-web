export interface ICita{
    id: number;
    clienteID: number;
    fecha: Date;
    hora: string;
    servicio: string;
    comentarios?: string;
    tiempoEstimado: string;    
    estado: 'pendiente' | 'cancelada' | 'completada';
}