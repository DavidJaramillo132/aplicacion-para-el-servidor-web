import { Cliente } from "./service/cliente";
import { ICliente } from "./domain/cliente";


const ClienteEjemplo1: ICliente = {
    id: 1,
    nombre: "Juan",
    apellidos: "Pérez",
    email: "juan.perez@example.com",
    telefono: "123456789",
    citas: []
};

const cliente1 = new Cliente();
cliente1.crearCliente();
