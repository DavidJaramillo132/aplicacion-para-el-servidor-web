import type dispositivo = require("./dispositivo");

export interface ICliente {
    id: number;
    name: string;
    apellido: string;
    dispositivos: dispositivo.IDispositivo[];
    
}
