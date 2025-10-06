import { ICita } from '../../domain/cita';


// citas
export const citasIniciales: ICita[] = [
  {
    id: "cita-001",
    clienteID: "cliente-001",
    fecha: new Date(),
    servicio: "Consulta General",
    tiempoEstimado: "30 minutos",
    estado: "pendiente"
  },
  {
    id: "cita-002",
    clienteID: "cliente-002",
    fecha: new Date(),
    servicio: "Revisión Técnica",
    tiempoEstimado: "45 minutos",
    estado: "pendiente"
  }
];