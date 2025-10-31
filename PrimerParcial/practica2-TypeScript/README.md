# Práctica 2 - TypeScript - Programación Orientada a Objetos

## Integrantes
- Kelly Canchingre
- David Jaramillo
- Kevin Calderón

## Objetivo de la Práctica

Implementar los conceptos fundamentales de TypeScript y Programación Orientada a Objetos (POO) mediante la creación de un sistema de gestión de dispositivos para clientes. Esta práctica tiene como objetivo aprender a trabajar con tipos estáticos, interfaces, clases y operaciones CRUD básicas en TypeScript.

## Instrucciones para Ejecutar el Proyecto

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm (versión 8 o superior)
- TypeScript (versión 5.9.2)

### Pasos de Instalación

1. Abrir la terminal o línea de comandos.

2. Navegar hasta el directorio raíz del proyecto:
   ```powershell
   cd "c:\Users\djdav\OneDrive - ULEAM\IngenieriaSoftware\Quinto Semestre\aplicacion-para-el-servidor-web\PrimerParcial\practica2-TypeScript"
   ```

3. Instalar las dependencias del proyecto:
   ```powershell
   npm install
   ```

### Pasos de Ejecución

#### Modo Desarrollo (recomendado)
```powershell
npm run dev
```
Este comando ejecuta el proyecto con recarga automática usando `ts-node-dev`.

#### Modo Producción
```powershell
npm run build
npm start
```
Estos comandos compilan TypeScript a JavaScript y ejecutan la versión compilada desde la carpeta `/dist`.

## Puerto y Rutas de Prueba Principales

### Tipo de Aplicación
Esta es una **aplicación de consola** (no servidor web), por lo que no tiene puerto de ejecución ni rutas HTTP.

### Funcionalidades Principales

El proyecto demuestra las siguientes operaciones CRUD sobre dispositivos:

1. **Crear Dispositivo**
   - Función: `crearDispositivo(cliente, tipoDispositivo)`
   - Ejemplo: Crear un teléfono para un cliente

2. **Modificar Dispositivo**
   - Función: `modificarDispositivo(idDispositivo)`
   - Ejemplo: Actualizar información de un dispositivo existente

3. **Eliminar Dispositivo**
   - Función: `eliminarDispositivo(idDispositivo)`
   - Ejemplo: Eliminar un dispositivo del sistema

4. **Consultar Dispositivo**
   - Función: `consultarDispositivo(idDispositivo)`
   - Ejemplo: Obtener información de un dispositivo específico

### Salida Esperada en Consola

Al ejecutar el proyecto, verá en consola:
```
Hola Mundo
[Información sobre operaciones CRUD realizadas]
```

## Estructura del Proyecto

```
practica2-TypeScript/
├── src/
│   ├── app.ts              # Punto de entrada de la aplicación
│   ├── domain/             # Entidades del dominio
│   │   └── cliente.ts      # Interface ICliente
│   └── service/            # Capa de servicios
│       └── dispositivo.ts  # Clase Dispositivo con CRUD
├── package.json            # Configuración del proyecto y dependencias
├── tsconfig.json          # Configuración de TypeScript
└── .gitignore             # Archivos ignorados por Git
```

## Conceptos de TypeScript Aplicados

- **Interfaces**: Definición de contratos con `ICliente`
- **Clases**: Implementación de lógica de negocio con `Dispositivo`
- **Tipos estáticos**: Uso de tipado fuerte en TypeScript
- **Módulos**: Organización del código con imports/exports
- **Compilación**: Transpilación de TypeScript a JavaScript

## Scripts Disponibles

- `npm run dev` - Ejecuta el proyecto en modo desarrollo con hot-reload
- `npm run build` - Compila el proyecto TypeScript a JavaScript
- `npm start` - Compila y ejecuta la versión de producción
- `npm test` - Ejecuta las pruebas (pendiente de implementación)
