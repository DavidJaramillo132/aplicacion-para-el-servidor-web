import { CitaService } from './service/citaServicio';
import { obtenerDatosIniciales } from './infracture/relaciones';
import { RepositorioCitas } from './infracture/repositorio';


async function inicializarAplicacion() {
  console.log("Iniciando aplicación...\n");
  
  // Obtener datos iniciales
  const datos = obtenerDatosIniciales();
  console.log("Datos cargados:");
  console.log(`   - Clientes: ${datos.clientes.length}`);
  console.log(`   - Citas: ${datos.citas.length}`);
  console.log(`   - Administradores: ${datos.admins.length}`);

  // Crear repositorio en memoria
  const citaRepository = new RepositorioCitas(datos.citas);
  
  // Crear servicio de citas
  const citaService = new CitaService(citaRepository);
  
  console.log("Servicios inicializados correctamente\n");
  
  return {
    citaService,
    citaRepository,
    datos
  };
}

// demostracion de funcionalidades
async function demostrarFuncionalidades() {
  const { citaService, datos } = await inicializarAplicacion();
  
  console.log("\nDesmostrando funcionalidades CRUD\n");
  
  try {
    // 1. READ
    console.log("\n1. Todas las citas:");
    const todasLasCitas = await citaService.listar();
    todasLasCitas.forEach(cita => {
      const cliente = datos.clientes.find(c => c.id === cita.clienteID);
      console.log(`${cita.id}: ${cliente?.nombre} ${cliente?.apellidos} - ${cita.servicio} (${cita.estado})`);
    });

    // 2. CREATE
    console.log("\n2. Agendar nueva cita:");
    const clienteEjemplo = datos.clientes[0];
    if (clienteEjemplo) {
      const nuevaCita = await citaService.agendar(
        clienteEjemplo,
        "Consulta de Seguimiento",
        new Date("2025-10-02T10:00:00Z"),
        45,
        "pendiente"
      );
      console.log(`Nueva cita creada: ${nuevaCita.id}`);
    }

    // 3. DELETE
    console.log("\n3. Cancelar una cita:");
    const citasActuales = await citaService.listar();
    const citaPendiente = citasActuales.find(c => c.id === 'cita-002');
    if (citaPendiente) {
      const citaCancelada = await citaService.cancelar(citaPendiente.id);
      console.log(`Cita cancelada: ${citaCancelada.id}`);
    }

    // 4. Eliminar una cita
    console.log("\n4. Eliminar una cita:");
    const citasFinales = await citaService.listar();
    const citaParaEliminar = citasFinales.find(c => c.estado === 'cancelada');
    if (citaParaEliminar) {
      const eliminada = await citaService.eliminar(citaParaEliminar.id);
      console.log(`Resultado eliminación: ${eliminada}`);
    }

    // 5. Estado final
    console.log("\n5. Estado final:");
    const citasFinalesActualizadas = await citaService.listar();
    console.log(`Total de citas: ${citasFinalesActualizadas.length}`);
    console.log(`Pendientes: ${citasFinalesActualizadas.filter(c => c.estado === 'pendiente').length}`);
    console.log(`Completadas: ${citasFinalesActualizadas.filter(c => c.estado === 'completada').length}`);
    console.log(`Canceladas: ${citasFinalesActualizadas.filter(c => c.estado === 'cancelada').length}`);

  } catch (error) {
    console.error("Error durante la demostración:", error);
  }
}

// información del sistema
async function mostrarInformacionSistema() {
  console.log("INFORMACIÓN DEL SISTEMA");  
  const datos = obtenerDatosIniciales();
  
  console.log("\nClientes:");
  datos.clientes.forEach(cliente => {
    console.log(`${cliente.nombre} ${cliente.apellidos} (${cliente.email})`);
  });

  console.log("\nServicio Disponible:");
  datos.tiposDeServicio.forEach(servicio => {
    console.log(`${servicio}`);
  });
  
  console.log("\nHorarios Disponibles:");
  console.log(`${datos.horariosDisponibles.join(", ")}`);
  
  console.log("\nAdmin:");
  datos.admins.forEach(admin => {
    console.log(`${admin.nombre} (${admin.email})`);
  });
}



// Ejecucion principal
async function main() {
  console.log("Gestion de citas");
  
  //await mostrarInformacionSistema();
  await demostrarFuncionalidades();
  
}

main()

