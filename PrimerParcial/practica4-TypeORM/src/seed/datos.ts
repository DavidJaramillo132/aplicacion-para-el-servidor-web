import { AppDataSource } from "../data-source";
import UsuarioService from "../service/UsuarioService";
import { NegocioService } from "../service/NegocioService";
import { CitaService } from "../service/CitaService";
import { Servicio } from "../entities/IServicio"; 
import { ServicioService } from "../service/Servicio";

export async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión establecida con éxito");

    // --- Crear usuarios ---
    const usuario1 = await UsuarioService.create({
      nombre: "David",
      apellido: "Jaramillo",
      email: "david@example.com",
      password: "123456",
      rol: "cliente",
      telefono: "0991234567",
    });

    const usuario2 = await UsuarioService.create({
      nombre: "Ana",
      apellido: "Pérez",
      email: "ana@example.com",
      password: "abcdef",
      rol: "adminNegocio",
      telefono: "0987654321",
    });

    console.log("Usuarios creados:", [usuario1.email, usuario2.email]);

    // --- Crear negocios ---
    const negocio1 = await NegocioService.crear({
      nombre: "Café Aroma",
      categoria: "Cafetería",
      descripcion: "Cafetería con gran variedad de bebidas y postres",
      telefono: "099111222",
      correo: "contacto@cafearoma.com",
      adminNegocio: usuario2, // asignar usuario admin
    });

    console.log("Negocio creado:", negocio1.nombre);

    // --- Crear servicios ---
    const servicioService = new ServicioService();

    const servicio1 = await servicioService.create({
      nombre: "Café Expreso",
      codigo: "CE001",
      descripcion: "Un café expreso fuerte y aromático",
      capacidad: 1,
      duracion_minutos: 15,
      requiere_cita: false,
      precio_centavos: 250,
      creadoEn: new Date(),
      visible: true,
    });

    console.log("Servicio creado:", servicio1.nombre);

    // --- Crear citas ---
    const cita1 = await new CitaService().crearCita({
      usuario: usuario1,

      fecha: new Date("2025-10-10"),
      hora_inicio: "10:00",
      hora_fin: "11:00",
      estado: "pendiente",
    });

    console.log("Cita creada:", cita1.id);

    console.log("✅ Seed finalizado correctamente");
  } catch (error) {
    console.error("❌ Error en seed:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
