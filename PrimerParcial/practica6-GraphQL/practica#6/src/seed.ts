import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ServiciosService } from './servicios/servicios.service';
import { AdminSistemaService } from './admin-sistema/admin-sistema.service';
import { NegociosService } from './negocios/negocios.service';
import { EstacionesService } from './estaciones/estaciones.service';
import { HorariosAtencionService } from './horarios-atencion/horarios-atencion.service';
import { FilaService } from './fila/fila.service';
import { CitasService } from './citas/citas.service';

async function seed() {
  console.log('🌱 Iniciando seed de datos principales...');
  const app = await NestFactory.createApplicationContext(AppModule);

  // Servicios principales
  const users = app.get(UsersService);
  const servicios = app.get(ServiciosService);
  const admins = app.get(AdminSistemaService);
  const negocios = app.get(NegociosService);
  const estaciones = app.get(EstacionesService);
  const horarios = app.get(HorariosAtencionService);
  const filas = app.get(FilaService);
  const citas = app.get(CitasService);

  try {
    // Usuarios
    console.log('👤 Creando usuarios...');
    const adminSistemaUser = await users.create({
      nombreCompleto: 'Admin Sistema',
      email: 'admin.sistema@example.com',
      password: 'admin123',
      rol: 'adminSistema',
      telefono: '555-0001',
    });

    const adminNegocioUser = await users.create({
      nombreCompleto: 'Admin Negocio',
      email: 'admin.negocio@example.com',
      password: 'admin123',
      rol: 'adminNegocio',
      telefono: '555-0002',
    });

    const clienteUser = await users.create({
      nombreCompleto: 'Cliente Demo',
      email: 'cliente@example.com',
      password: 'cliente123',
      rol: 'cliente',
      telefono: '555-0003',
    });
    console.log('✅ Usuarios creados');

    // Admin del sistema
    console.log('🛡️ Creando admin del sistema...');
    const adminSistema = await admins.create({
      usuario_id: adminSistemaUser.id,
      nombre: 'Admin',
      apellidos: 'Sistema',
      email: 'admin.sistema@example.com',
      telefono: '555-0001',
    });
    console.log('✅ AdminSistema creado');

    // Servicios
    console.log('🛎️ Creando servicios...');
    const corte = await servicios.create({
      nombre: 'Corte de cabello',
      codigo: 'SRV-CORTE',
      descripcion: 'Corte de cabello profesional',
      duracion_minutos: 30,
      capacidad: 1,
      requiere_cita: true,
      precio_centavos: 1500,
      visible: true,
    });
    const manicure = await servicios.create({
      nombre: 'Manicure',
      codigo: 'SRV-MANI',
      descripcion: 'Servicio de manicure',
      duracion_minutos: 45,
      capacidad: 1,
      requiere_cita: true,
      precio_centavos: 2000,
      visible: true,
    });
    console.log('✅ Servicios creados');

    // Negocio
    console.log('🏪 Creando negocio...');
    const negocio = await negocios.create({
      admin_negocio_id: adminNegocioUser.id,
      nombre: 'Salon Demo',
      categoria: 'Belleza',
      descripcion: 'Salón de belleza de demostración',
      telefono: '555-1000',
      correo: 'contacto@salondemo.com',
      imagen_url: 'https://example.com/logo.png',
      estado: true,
      hora_atencion: 'Lun-Sab 09:00-19:00',
    });
    console.log('✅ Negocio creado');

    // Estaciones
    console.log('🪑 Creando estaciones...');
    const estacion1 = await estaciones.create({
      negocio_id: negocio.id,
      nombre: 'Estación 1',
      estado: 'activo',
    });
    const estacion2 = await estaciones.create({
      negocio_id: negocio.id,
      nombre: 'Estación 2',
      estado: 'activo',
    });
    console.log('✅ Estaciones creadas');

    // Horarios de atención
    console.log('🕑 Creando horarios de atención...');
    await horarios.create({
      estacion_id: estacion1.id,
      dia_semana: 1,
      hora_inicio: '09:00:00',
      hora_fin: '18:00:00',
    });
    await horarios.create({
      estacion_id: estacion1.id,
      dia_semana: 2,
      hora_inicio: '09:00:00',
      hora_fin: '18:00:00',
    });
    await horarios.create({
      estacion_id: estacion2.id,
      dia_semana: 3,
      hora_inicio: '10:00:00',
      hora_fin: '17:00:00',
    });
    console.log('✅ Horarios creados');

    // Fila (apertura de turno)
    console.log('📋 Creando filas...');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    const fila1 = await filas.create({
      estacion_id: estacion1.id,
      fecha: fechaHoy,
      hora_inicio: '09:00:00',
      hora_fin: '12:00:00',
      estado: 'abierta',
    });
    console.log('✅ Filas creadas');

    // Citas
    console.log('📆 Creando citas...');
    await citas.create({
      usuario_id: clienteUser.id,
      servicio_id: corte.id,
      fecha: fechaHoy,
      hora_inicio: '09:30:00',
      hora_fin: '10:00:00',
      estado: 'pendiente',
    });
    await citas.create({
      usuario_id: clienteUser.id,
      servicio_id: manicure.id,
      fecha: fechaHoy,
      hora_inicio: '10:30:00',
      hora_fin: '11:15:00',
      estado: 'pendiente',
    });
    console.log('✅ Citas creadas');

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log(
      'Entidades creadas: Users, AdminSistema, Servicios, Negocio, Estaciones, Horarios, Fila, Citas',
    );
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await app.close();
  }
}

seed();
