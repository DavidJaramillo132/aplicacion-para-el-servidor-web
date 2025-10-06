service



# Servicios - API TypeORM

Esta carpeta contiene los servicios que manejan la lógica de negocio para las entidades principales de la aplicación: *Negocio, **Usuario* y *Servicio. Cada servicio encapsula las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) utilizando **TypeORM* y el repositorio correspondiente de cada entidad.

---

## Estructura de la carpeta

services/
├─ NegocioService.ts
├─ UsuarioService.ts
├─ ServicioService.ts


- *NegocioService.ts*: Maneja operaciones relacionadas con los negocios.
- *UsuarioService.ts*: Maneja operaciones relacionadas con los usuarios y sus relaciones (citas, negocios administrados, administración del sistema).
- *ServicioService.ts*: Maneja operaciones relacionadas con los servicios y sus citas asociadas.

---

## Detalle de los servicios

### NegocioService

Proporciona métodos estáticos para interactuar con la entidad Negocio.

*Métodos principales:*

| Método | Descripción |
|--------|-------------|
| crear(data: Partial<Negocio>) | Crea y guarda un nuevo negocio en la base de datos. |
| obtenerTodos() | Devuelve todos los negocios registrados. |
| obtenerPorId(id: string) | Obtiene un negocio específico por su ID. |
| actualizar(id: string, data: Partial<Negocio>) | Actualiza un negocio existente con los datos proporcionados. |
| eliminar(id: string) | Elimina un negocio por su ID. Retorna true si se eliminó correctamente. |

---

### UsuarioService

Proporciona métodos para interactuar con la entidad Usuario. Este servicio también carga relaciones con *citas, **negocios administrados* y *roles de administrador del sistema*.

*Métodos principales:*

| Método | Descripción |
|--------|-------------|
| create(data: Partial<Usuario>) | Crea un nuevo usuario y lo guarda en la base de datos. |
| findAll() | Obtiene todos los usuarios con sus relaciones. |
| findOne(id: string) | Obtiene un usuario por su ID, incluyendo relaciones. |
| update(id: string, data: Partial<Usuario>) | Actualiza un usuario existente con los datos proporcionados. |
| remove(id: string) | Elimina un usuario por su ID. Retorna true si se eliminó correctamente. |

*Nota:* Este servicio se exporta como una instancia por defecto para poder ser usado directamente en controladores o rutas.

---

### ServicioService

Proporciona métodos para interactuar con la entidad Servicio, incluyendo la relación con citas.

*Métodos principales:*

| Método | Descripción |
|--------|-------------|
| create(data: Partial<Servicio>) | Crea y guarda un nuevo servicio en la base de datos. |
| findOne(id: string) | Obtiene un servicio por su ID, incluyendo las citas asociadas. |
| update(id: string, data: Partial<Servicio>) | Actualiza un servicio existente y retorna la entidad actualizada. |
| remove(id: string) | Elimina un servicio por su ID. |

---

## Uso básico

```ts
import NegocioService from './NegocioService';
import UsuarioService from './UsuarioService';
import ServicioService from './ServicioService';

// Crear un negocio
const nuevoNegocio = await NegocioService.crear({ nombre: 'Tienda ABC', ubicacion: 'Quito' });

// Obtener todos los usuarios
const usuarios = await UsuarioService.findAll();

// Actualizar un servicio
const servicioActualizado = await ServicioService.update('id-servicio', { nombre: 'Servicio Premium' });