import { ICliente } from "../domain/cliente";
import { IDispositivo } from "../domain/dispositivo";

let dispositivos: IDispositivo[] = [];
const clientes: ICliente[] = [];

export class Dispositivo {

    constructor() {
        console.log("Dispositivo creado");
    }

    crearDispositivo(cliente: ICliente, nombre: string) {
        console.log("Creando dispositivo...", nombre);

        const crearDispositivo: IDispositivo = {
            id: dispositivos.length + 1,
            name: nombre,
            precio: 100,
            marca: "Marca " + (dispositivos.length + 1),
            cliente: [...clientes, cliente]

        };
        dispositivos.push(crearDispositivo);
        console.log(crearDispositivo);
    }

    eliminarDispositivo(numeroID: number) {
        console.log("Eliminando dispositivo...");
        const encontrado = dispositivos.find((dispositivo) => dispositivo.id === numeroID);
        
        if (encontrado) {
            dispositivos = dispositivos.filter((dispositivo) => dispositivo.id !== numeroID);
            console.log("Dispositivo eliminado:", encontrado);
            return encontrado;
        } else {
            console.log("Error: No se encontró dispositivo con ID:", numeroID);
            return null;
        }        
    }

    modificarDispositivo(numeroID: number) {
        console.log("Modificando dispositivo...");
        const encontrado = dispositivos.find((dispositivo) => dispositivo.id === numeroID);
        
        if (encontrado) {
            encontrado.name = "Dispositivo Modificado";
            console.log("Dispositivo modificado:", encontrado);
            return encontrado;
        } else {
            console.log("Error: No se encontró dispositivo con ID:", numeroID);
            return null;
        }
    }

    consultarDispositivo(numeroID: number) {
        const encontrado = dispositivos.find((dispositivo) => dispositivo.id === numeroID);
        if (encontrado) {
            console.log("Dispositivo encontrado:", encontrado);
            return encontrado;
        } else {
            console.log("No se encontro dispositivo con ID:", numeroID);
            return null;
        }
    }
}

