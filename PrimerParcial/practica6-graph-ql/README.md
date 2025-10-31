# Práctica 6 - GraphQL con NestJS

## Integrantes
- Kelly Canchingre
- David Jaramillo
- Kevin Calderón

## Objetivo de la Práctica

Implementar una API GraphQL utilizando NestJS y Apollo Server para crear un sistema de gestión de citas completo. Esta práctica tiene como objetivo aprender a trabajar con GraphQL como alternativa a REST, definir esquemas, resolvers, queries y mutations, además de comprender las ventajas de GraphQL en la obtención flexible de datos.

## Estructura de la Práctica

Esta carpeta contiene dos proyectos comparativos:

1. **practica6-graph-ql/** - API GraphQL del sistema de gestión de citas
2. **practica6-GraphQL-clase/** - Proyectos de ejemplo (REST vs GraphQL)
   - **rest/** - Implementación con REST API tradicional
   - **graph-ql/** - Implementación equivalente con GraphQL

## Instrucciones para Ejecutar el Proyecto

### Proyecto Principal: practica6-graph-ql/

#### Pasos de Instalación

1. Abrir la terminal o línea de comandos.

2. Navegar hasta el directorio raíz del proyecto:
   ```powershell
   cd "c:\Users\djdav\OneDrive - ULEAM\IngenieriaSoftware\Quinto Semestre\aplicacion-para-el-servidor-web\PrimerParcial\practica6-graph-ql"
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
Este comando inicia el servidor en modo desarrollo con recarga automática.

##### Modo Producción
```powershell
npm run build
npm run start:prod
```

## Puerto y Rutas de Prueba Principales

### Puerto de Ejecución
- **http://localhost:3001**

### GraphQL Playground
- **http://localhost:3001/graphql**
  - Interfaz interactiva para explorar y probar la API GraphQL
  - Incluye documentación automática del esquema
  - Auto-completado de queries y mutations

## Consultas y Mutaciones Principales (GraphQL)

### Queries (Consultas)

#### 1. Obtener todos los usuarios
```graphql
query {
  usuarios {
    id
    nombre
    email
    telefono
  }
}
```

#### 2. Obtener un usuario por ID
```graphql
query {
  usuario(id: 1) {
    id
    nombre
    email
    citas {
      id
      fecha
      estado
    }
  }
}
```

#### 3. Obtener todos los negocios
```graphql
query {
  negocios {
    id
    nombre
    descripcion
    servicios {
      nombre
      precio
    }
  }
}
```

#### 4. Obtener todas las citas
```graphql
query {
  citas {
    id
    fecha
    estado
    usuario {
      nombre
    }
    servicio {
      nombre
    }
  }
}
```

#### 5. Obtener servicios de un negocio
```graphql
query {
  servicios(negocioId: 1) {
    id
    nombre
    descripcion
    precio
    duracion
  }
}
```

### Mutations (Modificaciones)

#### 1. Crear un nuevo usuario
```graphql
mutation {
  crearUsuario(input: {
    nombre: "Juan Pérez"
    email: "juan@example.com"
    telefono: "0987654321"
  }) {
    id
    nombre
    email
  }
}
```

#### 2. Crear una cita
```graphql
mutation {
  crearCita(input: {
    usuarioId: 1
    servicioId: 2
    fecha: "2025-11-15T10:00:00Z"
    estado: "pendiente"
  }) {
    id
    fecha
    estado
  }
}
```

#### 3. Actualizar estado de cita
```graphql
mutation {
  actualizarCita(id: 1, input: {
    estado: "completada"
  }) {
    id
    estado
  }
}
```

#### 4. Eliminar una cita
```graphql
mutation {
  eliminarCita(id: 1) {
    success
    message
  }
}
```

## Estructura del Proyecto

```
practica6-graph-ql/
├── src/
│   ├── main.ts                    # Punto de entrada (Puerto 3001)
│   ├── app.module.ts              # Módulo raíz con GraphQL
│   ├── app.controller.ts          # Controlador principal
│   ├── app.service.ts             # Servicio principal
│   ├── schema.gql                 # Esquema GraphQL generado
│   ├── usuarios/                  # Módulo de usuarios
│   │   ├── usuarios.module.ts
│   │   ├── usuarios.resolver.ts   # Resolver GraphQL
│   │   ├── usuarios.service.ts
│   │   └── dto/
│   ├── negocios/                  # Módulo de negocios
│   │   ├── negocios.module.ts
│   │   ├── negocios.resolver.ts
│   │   └── negocios.service.ts
│   ├── servicios/                 # Módulo de servicios
│   │   ├── servicios.module.ts
│   │   ├── servicios.resolver.ts
│   │   └── servicios.service.ts
│   ├── citas/                     # Módulo de citas
│   │   ├── citas.module.ts
│   │   ├── citas.resolver.ts
│   │   └── citas.service.ts
│   ├── estaciones/                # Módulo de estaciones
│   ├── fila/                      # Módulo de fila virtual
│   ├── horarios-atencion/         # Módulo de horarios
│   └── admin-sistema/             # Módulo de administración
├── package.json
└── tsconfig.json
```

## Tecnologías y Dependencias Principales

### Dependencias GraphQL
- **@nestjs/graphql** (^13.2.0): Módulo GraphQL para NestJS
- **@nestjs/apollo** (^13.2.1): Integración con Apollo Server
- **@apollo/server** (^5.0.0): Servidor GraphQL
- **graphql** (^16.11.0): Implementación JavaScript de GraphQL
- **@as-integrations/express5** (^1.1.2): Integración Express

### Dependencias Core
- **@nestjs/common**: Decoradores y utilidades
- **@nestjs/core**: Núcleo del framework
- **@nestjs/axios**: Cliente HTTP
- **axios**: Peticiones HTTP
- **reflect-metadata**: Metadata reflection

## Conceptos de GraphQL Aplicados

### Schema Definition Language (SDL)
- Definición de tipos con `type`
- Inputs con `input`
- Queries y Mutations

### Resolvers
- `@Query()`: Para consultas de datos
- `@Mutation()`: Para modificaciones
- `@Args()`: Para parámetros de entrada
- `@ResolveField()`: Para campos relacionados

### Ventajas de GraphQL
- **Consultas flexibles**: El cliente solicita exactamente lo que necesita
- **Un solo endpoint**: `/graphql` para todas las operaciones
- **Tipado fuerte**: Esquema autodocumentado
- **Introspección**: Exploración automática de la API
- **Evita over-fetching/under-fetching**: Optimización de datos

### Code First vs Schema First
Este proyecto usa **Code First**:
- Los resolvers y tipos se definen en TypeScript
- El esquema GraphQL (`schema.gql`) se genera automáticamente

## Scripts Disponibles

- `npm run start` - Inicia la aplicación
- `npm run start:dev` - Modo desarrollo con watch
- `npm run start:debug` - Modo debug
- `npm run start:prod` - Modo producción
- `npm run build` - Compila el proyecto
- `npm run test` - Ejecuta tests unitarios
- `npm run test:e2e` - Ejecuta tests end-to-end
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código

## Comparación REST vs GraphQL

### REST (practica6-GraphQL-clase/rest/)
- Múltiples endpoints: `/users`, `/posts`, `/comments`
- El servidor decide la estructura de respuesta
- Posible over-fetching o under-fetching

### GraphQL (practica6-GraphQL-clase/graph-ql/)
- Un solo endpoint: `/graphql`
- El cliente define qué datos necesita
- Respuesta optimizada

## Herramientas de Desarrollo

- **GraphQL Playground**: Incluido automáticamente en http://localhost:3001/graphql
- **Apollo Studio**: Cliente GraphQL avanzado
- **Altair GraphQL Client**: Alternativa a Playground

## Pruebas Recomendadas

1. **Explorar el esquema** en GraphQL Playground
2. **Probar queries** básicas de cada entidad
3. **Crear datos** con mutations
4. **Consultar relaciones** entre entidades
5. **Comparar** con la implementación REST equivalente
