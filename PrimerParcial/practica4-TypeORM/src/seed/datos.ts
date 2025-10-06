import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/index";
import UsuarioService from "../service/UsuarioService";
import { NegocioService } from "../service/NegocioService";
import { CitaService } from "../service/CitaService";
import { ServicioService } from "../service/Servicio";
import { EstacionService } from "../service/EstacionServices";

export async function seed() {
    try {
        await AppDataSource.initialize();
        console.log("Conexión establecida con éxito");

        const usuarioRepo = AppDataSource.getRepository(Usuario);

        // --- Crear usuarios solo si no existen ---
        let usuario1 = await usuarioRepo.findOneBy({ email: "david@example.com" });
        if (!usuario1) {
            usuario1 = await UsuarioService.create({
                nombre: "David",
                apellido: "Jaramillo",
                email: "david@example.com",
                password: "123456",
                rol: "cliente",
                telefono: "0991234567",
            });
        }

        let usuario2 = await usuarioRepo.findOneBy({ email: "ana@example.com" });
        if (!usuario2) {
            usuario2 = await UsuarioService.create({
                nombre: "Ana",
                apellido: "Pérez",
                email: "ana@example.com",
                password: "abcdef",
                rol: "adminNegocio",
                telefono: "0987654321",
            });
        }

        console.log("Usuarios listos:", [usuario1.email, usuario2.email]);

        // --- Crear negocios solo si no existen ---
        const negocioRepo = AppDataSource.getRepository("negocios");
        let negocio1 = await negocioRepo.findOneBy({ nombre: "Café Aroma" });
        if (!negocio1) {
            negocio1 = await NegocioService.crear({
                nombre: "Café Aroma",
                categoria: "Cafetería",
                descripcion: "Cafetería con gran variedad de bebidas y postres",
                telefono: "099111222",
                correo: "contacto@cafearoma.com",
                adminNegocio: usuario2,
            });
        }

        console.log("Negocio listo:", negocio1.nombre);

        // --- Crear servicios solo si no existen ---
        const servicioService = new ServicioService();
        let servicio1 = await AppDataSource.getRepository("servicios").findOneBy({ codigo: "CE001" });
        if (!servicio1) {
            servicio1 = await servicioService.create({
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
        }

        console.log("Servicio listo:", servicio1.nombre);

        // --- Crear citas solo si no existen ---
        const citaRepo = AppDataSource.getRepository("citas");
        let cita1 = await citaRepo.findOneBy({
            usuario: { id: usuario1.id },
            fecha: new Date("2025-10-10"),
            hora_inicio: "10:00",
        });

        if (!cita1) {
            cita1 = await new CitaService().crearCita({
                usuario: usuario1,
                fecha: new Date("2025-10-10"),
                hora_inicio: "10:00",
                hora_fin: "11:00",
                estado: "pendiente",
            });
        }

        console.log("Cita lista:", cita1.id);

        // --- Crear estaciones solo si no existen ---
        const estacionService = new EstacionService();
        let estacion1 = await AppDataSource.getRepository("estaciones").findOneBy({ nombre: "Estación Central" });
        if (!estacion1) {
            estacion1 = await estacionService.create({
                nombre: "Estación Central",
                estado: "activo",
                negocio_id: negocio1.id,
            });
        }


        console.log("Seed finalizado correctamente");
    } catch (error) {
        console.error("Error en seed:", error);
    } finally {
        await AppDataSource.destroy();
    }
}
