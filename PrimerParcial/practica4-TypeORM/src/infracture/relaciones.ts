import { adminsIniciales } from './memory/adminDatos';
import { clientesIniciales } from './memory/datosCliente';
import { citasIniciales } from './memory/citaDatos';
import { filasIniciales } from './memory/filaDatos';
import { contenidoInicial } from './memory/contenidoDatos';
import { imagenesIniciales } from './memory/imageneDatos';
import { tiposDeServicio } from './memory/servicios';
import { horariosDisponibles } from './memory/horasDatos';

// obtener datos iniciales
export function obtenerDatosIniciales() {
  inicializarRelaciones();
  
  return {
    clientes: clientesIniciales,
    citas: citasIniciales,
    admins: adminsIniciales,
    filas: filasIniciales,
    contenido: contenidoInicial,
    imagenes: imagenesIniciales,
    tiposDeServicio,
    horariosDisponibles
  };
}

// Iniciar relaciones
export function inicializarRelaciones() {
  // Asignar citas a clientes
  clientesIniciales.forEach(cliente => {
    cliente.citas = citasIniciales.filter(cita => cita.clienteID === cliente.id);
  });

}
