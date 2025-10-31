# Práctica 5 - NestJS - Framework Backend Empresarial

## Integrantes
- Kelly Canchingre
- David Jaramillo
- Kevin Calderón

## Objetivo de la Práctica

Implementar aplicaciones backend utilizando NestJS, un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables. Esta práctica tiene como objetivo aprender la arquitectura modular de NestJS, la inyección de dependencias, el sistema de decoradores, y la creación de APIs RESTful profesionales.

## Estructura de la Práctica

Esta carpeta contiene dos proyectos NestJS:

1. **practica/** - Proyecto NestJS básico
2. **practica#4/** - Proyecto NestJS con integración de base de datos SQLite y CRUD completo

## Instrucciones para Ejecutar los Proyectos

### Proyecto 1: practica/

#### Pasos de Instalación

1. Abrir la terminal o línea de comandos.

2. Navegar hasta el directorio del proyecto:
   ```powershell
   cd "c:\Users\djdav\OneDrive - ULEAM\IngenieriaSoftware\Quinto Semestre\aplicacion-para-el-servidor-web\PrimerParcial\practica5-NestJS\practica"
   ```

3. Instalar las dependencias del proyecto:
   ```powershell
   npm install
   ```

#### Pasos de Ejecución

```powershell
npm run start:dev
```
Este comando inicia el servidor en modo desarrollo con recarga automática.

#### Puerto y Rutas

- **Puerto**: http://localhost:3000
- **GET /** - Ruta principal que retorna "Hello World!"

---

### Proyecto 2: practica#4/ (Proyecto Principal)

#### Descripción
Este proyecto implementa un CRUD completo de usuarios con base de datos SQLite integrada.

#### Pasos de Instalación

1. Abrir la terminal o línea de comandos.

2. Navegar hasta el directorio del proyecto:
   ```powershell
   cd "c:\Users\djdav\OneDrive - ULEAM\IngenieriaSoftware\Quinto Semestre\aplicacion-para-el-servidor-web\PrimerParcial\practica5-NestJS\practica#4"
   ```

3. Instalar las dependencias del proyecto:
   ```powershell
   npm install
   ```

#### Pasos de Ejecución

##### Modo Desarrollo (recomendado)
```powershell
npm run start:dev
```

##### Modo Producción
```powershell
npm run build
npm run start:prod
```

## Puerto y Rutas de Prueba Principales

### Puerto de Ejecución
- **http://localhost:3000**

### Rutas Principales de Prueba (practica#4)

#### Usuarios (Users)

- **GET /users** - Obtener todos los usuarios
  ```http
  GET http://localhost:3000/users
  ```

- **GET /users/:id** - Obtener un usuario por ID
  ```http
  GET http://localhost:3000/users/1
  ```

- **POST /users** - Crear un nuevo usuario
  ```http
  POST http://localhost:3000/users
  Content-Type: application/json

  {
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
  ```

- **PATCH /users/:id** - Actualizar un usuario
  ```http
  PATCH http://localhost:3000/users/1
  Content-Type: application/json

  {
    "nombre": "Juan Actualizado"
  }
  ```

- **DELETE /users/:id** - Eliminar un usuario
  ```http
  DELETE http://localhost:3000/users/1
  ```

### Archivo de Pruebas
El proyecto **practica#4** incluye un archivo `test-api.http` con ejemplos de todas las peticiones HTTP para probar la API fácilmente usando extensiones como REST Client de VS Code.

## Estructura del Proyecto (practica#4)

```
practica#4/
├── src/
│   ├── main.ts              # Punto de entrada de la aplicación
│   ├── app.module.ts        # Módulo raíz
│   ├── users/               # Módulo de usuarios
│   │   ├── users.module.ts
│   │   ├── users.controller.ts  # Controlador REST
│   │   ├── users.service.ts     # Lógica de negocio
│   │   ├── entities/
│   │   │   └── user.entity.ts   # Entidad TypeORM
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
├── test/                    # Pruebas E2E
├── database.sqlite         # Base de datos SQLite
├── test-api.http          # Pruebas de API
├── package.json           # Configuración del proyecto
└── tsconfig.json         # Configuración TypeScript
```

## Tecnologías y Dependencias Principales

### Dependencias Core de NestJS
- **@nestjs/common**: Decoradores y utilidades comunes
- **@nestjs/core**: Núcleo del framework
- **@nestjs/platform-express**: Adaptador para Express
- **@nestjs/typeorm**: Integración con TypeORM
- **typeorm**: ORM para base de datos
- **sqlite3**: Driver SQLite

### Dependencias de Desarrollo
- **@nestjs/cli**: CLI de NestJS
- **@nestjs/testing**: Utilidades de testing
- **typescript**: Compilador TypeScript
- **jest**: Framework de testing

## Conceptos de NestJS Aplicados

### Arquitectura
- **Módulos**: Organización en módulos con `@Module()`
- **Controladores**: Manejo de rutas HTTP con `@Controller()`
- **Servicios**: Lógica de negocio con `@Injectable()`
- **Providers**: Inyección de dependencias

### Decoradores HTTP
- `@Get()`, `@Post()`, `@Patch()`, `@Delete()`
- `@Param()`, `@Body()`, `@Query()`

### TypeORM Integration
- Integración perfecta con TypeORM
- Repositorios inyectables
- Entidades como clases TypeScript

### DTOs (Data Transfer Objects)
- Validación de datos de entrada
- Transformación de datos
- Documentación automática

## Scripts Disponibles

- `npm run start` - Inicia la aplicación
- `npm run start:dev` - Modo desarrollo con watch
- `npm run start:debug` - Modo debug
- `npm run start:prod` - Modo producción
- `npm run build` - Compila el proyecto
- `npm run test` - Ejecuta tests unitarios
- `npm run test:e2e` - Ejecuta tests end-to-end
- `npm run lint` - Ejecuta el linter

## Herramientas Recomendadas

- **REST Client** (VS Code Extension) - Para probar las APIs usando `test-api.http`
- **Postman** - Cliente HTTP alternativo
- **DB Browser for SQLite** - Para visualizar la base de datos

## Base de Datos (practica#4)

- **Motor**: SQLite
- **Archivo**: `database.sqlite`
- **Sincronización**: Automática en desarrollo
- **Tablas**: Usuarios (users)
