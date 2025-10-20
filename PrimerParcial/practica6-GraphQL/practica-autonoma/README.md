## Proyecto: Gestión de Citas (NestJS + TypeORM + SQLite)

### Descripción
API construida con NestJS 11, TypeORM y SQLite para gestionar usuarios, servicios, negocios, estaciones, horarios de atención, filas y citas.

### Requisitos
- Node.js 18+
- npm 9+

### Instalación
```bash
npm install
```

### Ejecutar en desarrollo
```bash
npm run start:dev
```

### Compilar y ejecutar
```bash
npm run build
npm start
```

### Base de datos
- Motor: SQLite (archivo `database.sqlite` en la raíz del proyecto)
- Sincronización automática de esquema activada en `app.module.ts` (solo para desarrollo)

### Semilla de datos
Genera datos de ejemplo para todas las entidades principales (`usuarios`, `admin_sistema`, `servicios`, `negocios`, `estaciones`, `horarios_atencion`, `fila`, `citas`).
```bash
npm run seed
```

### Entidades principales (tablas)
- `usuarios` (User)
- `servicios` (Servicio)
- `citas` (Cita)
- `admin_sistema` (AdminSistema)
- `negocios` (Negocio)
- `estaciones` (Estacion)
- `horarios_atencion` (HorarioAtencion)
- `fila` (Fila)

### Módulos y rutas HTTP
- Users: `/users`
- Servicios: `/servicios`
- Citas: `/citas`
- Admin del sistema: `/admin-sistema`
- Negocios: `/negocios`
- Estaciones: `/estaciones`
- Horarios de atención: `/horarios-atencion`
- Fila: `/fila`

Cada recurso expone endpoints CRUD estándar:
- POST `/` crear
- GET `/` listar
- GET `/:id` obtener por id
- PATCH `/:id` actualizar
- DELETE `/:id` eliminar

### Estructura simplificada del proyecto
```
src/
  admin-sistema/
  citas/
  estaciones/
  fila/
  horarios-atencion/
  negocios/
  servicios/
  users/
  app.module.ts
  main.ts
  seed.ts
```

### Validación y DTOs
- Se usa `class-validator` y `@nestjs/mapped-types` para DTOs de creación y actualización.
- Campos de identificadores son `uuid`.
- Fechas en DTOs se envían como strings ISO (por ejemplo, `YYYY-MM-DD` o `HH:mm:ss` según corresponda).

### Notas de desarrollo
- Las relaciones entre entidades están mapeadas con `TypeORM`.
- `synchronize: true` está habilitado para facilitar el desarrollo; desactívalo en producción y usa migraciones.

### Scripts disponibles
- `start`: inicia la app compilada
- `start:dev`: inicia en modo watch
- `build`: compila TypeScript
- `seed`: ejecuta `src/seed.ts`
- `lint`: corre ESLint
- `test`, `test:e2e`: pruebas unitarias y e2e (si están configuradas)

### Licencia
UNLICENSED (solo uso educativo/demostrativo)


