# Sistema de Gestión de Citas Backend - TypeScript

## Título del Proyecto
**Sistema de Gestión de Citas con Arquitectura por Capas**
Aplicación backend desarrollada en TypeScript que implementa un sistema completo de gestión de citas con arquitectura por capas y patrones de diseño.

## Integrantes
Kelly Canchingre
David Jaramillo
Kevin Calderon

### Equipo de Desarrollo
- **David Jaramillo** - Desarrollador Principal
  - Implementación de operaciones CRUD
  - Desarrollo de la capa de servicios
  - Lógica de negocio y validaciones

- **Kelly Canchingre** - Arquitecta de Software
  - Diseño e implementación de interfaces
  - Definición de contratos del dominio
  - Estructura de entidades de negocio

- **Kevin Calderón** - Especialista en Datos
  - Creación de datos de prueba
  - Configuración de datos iniciales
  - Simulación de base de datos en memoria

### Contribuciones Individuales
- **David**: Capa de servicio completa con CitaService, validaciones de negocio, manejo de errores
- **Kelly**: Interfaces IContratoCita, ICita, ICliente, arquitectura de dominio
- **Kevin**: Datos iniciales, relaciones entre entidades, configuración de memoria

## Arquitectura del Sistema

### Arquitectura Implementada: **Layered Architecture con DDD**

```
Capa de entrada -> Capa de servicio -> Capa de dominio -> Capa de Infraestructura
```

### Capas del Sistema

1. **Capa de Dominio (`domain/`)**
   - Entidades de negocio: `Cliente`, `Cita`, `Admin`
   - Contratos/Interfaces: `IContratoCita`

2. **Capa de Servicio (`service/`)**
   - Lógica de aplicación
   - Orquestación de operaciones
   - Validaciones de negocio

3. **Capa de Infraestructura (`infracture/`)**
   - Patrón Repository
   - Persistencia en memoria
   - Acceso a datos

## Instrucciones de Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm (versión 8 o superior)
- TypeScript (versión 5.9.2)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/DavidJaramillo132/aplicacion-para-el-servidor-web
   cd PrimerParcial/practica3-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Verificar configuración de TypeScript**
   ```bash
   npx tsc --version
   ```

```json
{
  "devDependencies": {
    "@types/node": "^24.5.2",
    "rimraf": "^6.0.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.9.2"
  },
  "dependencies": {
    "uuid": "^9.0.0",
    "@types/uuid": "^9.0.0"
  }
}
```

## Instrucciones de Ejecución

### Modo Desarrollo
```bash
npm run dev
```
- Ejecuta el proyecto con recarga automática
- Utiliza `ts-node-dev` para compilación en tiempo real
- Monitorea cambios en archivos TypeScript

### Modo Producción
```bash
npm run build
npm start
```
- Compila TypeScript a JavaScript
- Ejecuta la versión compilada desde `/dist`

### Scripts Disponibles
- `npm run dev` - Desarrollo con hot-reload
- `npm run build` - Compilar proyecto
- `npm start` - Ejecutar versión compilada
- `npm test` - Ejecutar pruebas (pendiente implementación)


##     Implementados

### 1. **Programación Orientada a Objetos (POO)**
- **Encapsulación**: Clases con propiedades privadas
- **Abstracción**: Interfaces que definen contratos
- **Herencia**: Uso de interfaces para definir comportamientos
- **Polimorfismo**: Implementaciones múltiples de interfaces

### 2. **Programación Funcional**
- **Funciones Puras**: Métodos que no modifican estado externo
- **Inmutabilidad**: Uso de spread operator para actualizaciones
- **Composición**: Combinación de funciones para operaciones complejas
- **Manejo de Promesas**: Async/await y then/catch

### 3. **Programación Asíncrona**
- **Promises**: Manejo de operaciones asíncronas
- **Async/Await**: Sintaxis moderna para código asíncrono
- **Error Handling**: Try-catch y promise chains
- **Simulación de Latencia**: setTimeout para simular operaciones reales

### 4. **Inyección de Dependencias**
- **Constructor Injection**: Dependencias inyectadas por constructor
- **Interface Segregation**: Contratos específicos para cada responsabilidad
- **Inversión de Control**: El servicio no crea sus dependencias


## Evidencias de Funcionamiento

### Salida de Consola Esperada

```
Iniciando aplicación...

Datos cargados:
   - Clientes: 5
   - Citas: 8
   - Administradores: 2
Servicios inicializados correctamente

Demostrando funcionalidades CRUD

1. Todas las citas:
cita-001: Juan Pérez - Consulta General (pendiente)
cita-002: María González - Odontología (completada)
cita-003: Carlos Rodríguez - Cardiología (pendiente)

2. Agendar nueva cita:
✓ Cita creada: cita-009 para cliente cliente-001

3. Cancelar cita:
✓ Cita cancelada: cita-003

4. Eliminar cita:
✓ Cita cita-004 eliminada exitosamente
```

### Estructura de Archivos Generados

```
practica3-backend/
├── src/
│   ├── app.ts             #  Punto de entrada
│   ├── domain/            #  Entidades de negocio
│   ├── service/           #  Lógica de aplicación
│   └── infracture/        #  Acceso a datos
│       └── memory/        #  Datos iniciales
├── package.json           #  Configuración del proyecto
└── tsconfig.json          #  Configuración TypeScript
```


## Conclusiones Individuales

### David Jaramillo - Desarrollador Principal

**Logros Técnicos Alcanzados:**
Implementó el CRUD completo en CitaService con validaciones sólidas, manejo de errores y operaciones asíncronas. Aprendió la importancia de validar en la capa de servicio, manejar correctamente promesas y usar TypeScript para prevenir fallos. Su trabajo asegura la base funcional del sistema de citas.

### Kelly Canchingre - Arquitecta de Software

**Logros Técnicos Alcanzados:**
Diseñó interfaces claras y aplicó principios SOLID para separar contratos de implementaciones. Aprendió el valor del buen diseño y de Domain-Driven Design en TypeScript. Su aporte garantiza escalabilidad, mantenibilidad y facilidad de pruebas en el sistema.

### Kevin Calderón - Especialista en Datos

**Logros Técnicos Alcanzados:**
Creó datos de prueba realistas y relaciones consistentes en memoria. Aprendió la importancia de contar con datos de calidad y simular persistencia sin base real. Su trabajo permite validar y demostrar todas las funcionalidades del sistema.

