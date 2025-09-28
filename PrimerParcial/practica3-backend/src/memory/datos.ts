// import { ICliente } from '../../domain/cliente';
// import { ICita } from '../../domain/cita';
// import { IAdmin } from '../../domain/admin';
// import { IFila } from '../../domain/fila';
// import { IContenido } from '../../domain/contenido';
// import { IImagen } from '../../domain/imagen';

// // clientes
// export const clientesIniciales: ICliente[] = [
//   {
//     id: "cliente-001",
//     nombre: "María",
//     apellidos: "López",
//     email: "maria.garcia@email.com",
//     telefono: "+593-98-765-4321",
//     citas: []
//   },
//   {
//     id: "cliente-002",
//     nombre: "Carlos",
//     apellidos: "Pérez",
//     email: "carlos.perez@email.com",
//     telefono: "+593-99-123-4567",
//     citas: []
//   },

// ];

// // citas
// export const citasIniciales: ICita[] = [
//   {
//     id: "cita-001",
//     clienteID: "cliente-001",
//     fecha: new Date(),
//     servicio: "Consulta General",
//     tiempoEstimado: "30 minutos",
//     estado: "pendiente"
//   },
//   {
//     id: "cita-002",
//     clienteID: "cliente-002",
//     fecha: new Date(),
//     servicio: "Revisión Técnica",
//     tiempoEstimado: "45 minutos",
//     estado: "pendiente"
//   }
// ];

// // admin
// export const adminsIniciales: IAdmin[] = [
//   {
//     id: "admin-001",
//     nombre: "Administrador Principal",
//     email: "admin@sistema.com",
//     password: "admin123" 
//   }
  
// ];

// // fila
// export const filasIniciales: IFila[] = [
//   {
//     id: "fila-001",
//     posicion: 1,
//     cita: [] // Se llenarán dinámicamente
//   }
// ];

// // contenido
// export const contenidoInicial: IContenido[] = [
//   {
//     id: "contenido-001",
//     section: "hero",
//     title: "Bienvenido a Nuestro Sistema de Citas",
//     text: "Agenda tu cita de manera fácil y rápida con nuestro sistema en línea.",
//     imageUrl: "/images/hero-banner.jpg"
//   },
//   {
//     id: "contenido-002",
//     section: "servicios",
//     title: "Nuestros Servicios",
//     text: "Ofrecemos una amplia gama de servicios técnicos y de consultoría.",
//     imageUrl: "/images/servicios.jpg"
//   },
//   {
//     id: "contenido-003",
//     section: "about",
//     title: "Acerca de Nosotros",
//     text: "Somos una empresa con más de 10 años de experiencia en el sector.",
//     imageUrl: "/images/about.jpg"
//   },
//   {
//     id: "contenido-004",
//     section: "contact",
//     title: "Contáctanos",
//     text: "Estamos aquí para ayudarte. Ponte en contacto con nosotros.",
//     imageUrl: "/images/contact.jpg"
//   },
//   {
//     id: "contenido-005",
//     section: "footer",
//     title: "Sistema de Gestión de Citas",
//     text: "© 2025 Todos los derechos reservados.",
//   }
// ];

// // Imagenes
// export const imagenesIniciales: IImagen[] = [
//   {
//     id: 1,
//     url: "/images/hero-banner.jpg",
//     descripcion: "Banner principal del sistema"
//   },
//   {
//     id: 2,
//     url: "/images/servicios.jpg",
//     descripcion: "Imagen de servicios ofrecidos"
//   },
//   {
//     id: 3,
//     url: "/images/about.jpg",
//     descripcion: "Imagen sobre la empresa"
//   }
// ];

// // ===== FUNCIÓN PARA INICIALIZAR RELACIONES =====
// export function inicializarRelaciones() {
//   // Asignar citas a clientes
//   clientesIniciales.forEach(cliente => {
//     cliente.citas = citasIniciales.filter(cita => cita.clienteID === cliente.id);
//   });

//   // Asignar citas pendientes a filas (simulación de cola)
//   const citasPendientes = citasIniciales.filter(cita => cita.estado === 'pendiente');
//   citasPendientes.forEach((cita, index) => {
//     const filaIndex = index % filasIniciales.length;
//     const fila = filasIniciales[filaIndex];
//     if (fila) {
//       fila.cita.push(cita);
//     }
//   });
// }

// // Servicios
// export const tiposDeServicio = [
//   "Consulta General",
//   "Revisión Técnica",
//   "Mantenimiento Preventivo",
//   "Reparación",
//   "Instalación",
//   "Seguimiento",
//   "Diagnóstico",
//   "Configuración",
//   "Capacitación",
//   "Soporte Técnico"
// ];

// // Horarios
// export const horariosDisponibles = [
//   "08:00", "08:30", "09:00", "09:30", "10:00", "10:30"
// ];

// // ===== FUNCIÓN PARA OBTENER TODOS LOS DATOS =====
// export function obtenerDatosIniciales() {
//   inicializarRelaciones();
  
//   return {
//     clientes: clientesIniciales,
//     citas: citasIniciales,
//     admins: adminsIniciales,
//     filas: filasIniciales,
//     contenido: contenidoInicial,
//     imagenes: imagenesIniciales,
//     tiposDeServicio,
//     horariosDisponibles
//   };
// }


