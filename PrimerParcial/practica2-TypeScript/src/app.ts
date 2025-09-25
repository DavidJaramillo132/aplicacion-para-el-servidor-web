import type cliente = require("./domain/cliente");
import { Dispositivo } from "./service/dispositivo";

console.log("Hola Mundo");

const ClienteEjemplo1: cliente.ICliente = {
    id: 1,
    name: "David",
    apellido: "Jaramillo",
    dispositivos: []
}
const ClienteEjemplo2: cliente.ICliente = {
    id: 2,
    name: "Juan",
    apellido: "Perez",
    dispositivos: []
}




const NuevoDispositivo = new Dispositivo();
    
NuevoDispositivo.crearDispositivo(ClienteEjemplo1, "Telefono");
NuevoDispositivo.crearDispositivo(ClienteEjemplo2, "Tablet");

NuevoDispositivo.modificarDispositivo(2);

NuevoDispositivo.eliminarDispositivo(2);

NuevoDispositivo.consultarDispositivo(1);
