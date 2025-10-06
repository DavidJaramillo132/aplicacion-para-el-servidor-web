entities


# Sistema de Gestión de Negocios y Citas

Este proyecto es un sistema backend desarrollado con *TypeScript* y *TypeORM* para gestionar negocios, estaciones, servicios, usuarios y citas. Está diseñado para manejar roles de usuario como administradores del sistema, administradores de negocios y clientes, con control de reservas y horarios de atención.

---

## Tecnologías Utilizadas

- *TypeScript*  
- *Node.js*  
- *TypeORM* (ORM para bases de datos SQL)  
- *Base de datos SQL* (PostgreSQL, MySQL, SQLite, etc.)  
- *Decoradores y relaciones de TypeORM* para modelar entidades y relaciones entre tablas.

---

## Entidades Principales

### Usuario (Usuario)
Representa a los usuarios del sistema, incluyendo clientes y administradores de negocios.

- id: UUID único
- nombre, apellido, email, password
- rol: Enum (cliente | adminNegocio)
- Relaciones:
  - Un usuario puede tener muchas `Cita`s
  - Un usuario puede ser administrador de muchos `Negocio`s
  - Un usuario puede ser administrador del sistema (AdminSistema)

---

### Administrador del Sistema (AdminSistema)
Entidad para los administradores que gestionan el sistema globalmente.

- id: UUID
- usuario_id: UUID opcional
- nombre, apellidos, email, telefono
- Relación con Usuario

---

### Negocio (Negocio)
Representa un negocio o establecimiento.

- id, nombre, categoria, descripcion, telefono, correo, imagen_url, estado, hora_atencion
- Relación con Usuario como adminNegocio
- Un negocio puede tener muchas `Estacion`s

---

### Estación (Estacion)
Representa un punto o módulo dentro de un negocio.

- id, nombre, estado
- Relación con Negocio
- Una estación puede tener muchas `Fila`s y `HorarioAtencion`s

---

### Fila (Fila)
Maneja el flujo de atención en una estación en un día específico.

- id, fecha, hora_inicio, hora_fin, estado
- Relación con Estacion

---

### Horario de Atención (HorarioAtencion)
Define los horarios en que una estación está disponible para atención.

- id, dia_semana, hora_inicio, hora_fin
- Relación con Estacion

---

### Servicio (Servicio)
Define los servicios que un negocio puede ofrecer.

- id, nombre, codigo, descripcion, duracion_minutos, capacidad, requiere_cita, precio_centavos, visible
- Relación con Cita

---

### Cita (Cita)
Representa una reserva de servicio hecha por un usuario.

- id, usuario_id, servicio_id, fecha, hora_inicio, hora_fin, estado (pendiente | atendida | cancelada)
- Relaciones con Usuario y Servicio

---