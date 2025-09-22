import type cliente = require("./cliente");

export interface IDispositivo {
    id: number;
    name: string;
    precio: number;
    marca: string;
    cliente: cliente.ICliente[];
}
