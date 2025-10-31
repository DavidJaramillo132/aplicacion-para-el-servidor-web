# Práctica 7 - WebSockets con NestJS

## Integrantes
- Kelly Canchingre
- David Jaramillo
- Kevin Calderón

## Objetivo de la Práctica

Implementar comunicación en tiempo real utilizando WebSockets con NestJS para crear aplicaciones interactivas con conexión bidireccional entre cliente y servidor. Esta práctica tiene como objetivo aprender a trabajar con WebSockets, eventos en tiempo real, broadcasting de mensajes, y comprender las diferencias entre comunicación HTTP tradicional y WebSockets.

## Estructura de la Práctica

Esta carpeta contiene dos proyectos:

1. **practica7-web-socket/** - Implementación principal de WebSockets
2. **practica7-web-socket-clase/** - Proyectos de comparación
   - **rest/** - API REST tradicional
   - **web-socket/** - Implementación con WebSockets

## Instrucciones para Ejecutar el Proyecto

### Pasos de Instalación

1. Abrir la terminal o línea de comandos.

2. Navegar hasta el directorio raíz del proyecto:
   ```powershell
   cd "c:\Users\djdav\OneDrive - ULEAM\IngenieriaSoftware\Quinto Semestre\aplicacion-para-el-servidor-web\PrimerParcial\practica7-web-socket"
   ```

3. Instalar las dependencias del proyecto:
   ```powershell
   npm install
   ```

### Pasos de Ejecución

#### Modo Desarrollo (recomendado)
```powershell
npm run start:dev
```

#### Modo Producción
```powershell
npm run build
npm run start:prod
```

## Puerto y Rutas de Prueba Principales

### Puerto de Ejecución
- **http://localhost:3000**
- **WebSocket**: ws://localhost:3000

### Endpoints HTTP (REST)

- **GET /** - Ruta principal de bienvenida

### Eventos WebSocket

Los WebSockets funcionan mediante eventos en lugar de rutas HTTP tradicionales.

#### Eventos del Cliente al Servidor

1. **connect** - Evento automático cuando un cliente se conecta
2. **message** - Enviar un mensaje al servidor
3. **join-room** - Unirse a una sala específica
4. **leave-room** - Salir de una sala

#### Eventos del Servidor al Cliente

1. **welcome** - Mensaje de bienvenida al conectarse
2. **message** - Recibir mensajes broadcast
3. **user-joined** - Notificación cuando alguien se une a una sala
4. **disconnect** - Evento cuando se desconecta un cliente

## Conceptos de WebSockets Aplicados

### Gateway (Puerta de Enlace)
- Define un gateway WebSocket con `@WebSocketGateway()`
- Inyecta instancia del servidor con `@WebSocketServer()`

### Decoradores WebSocket
- `@WebSocketGateway()`: Define un gateway WebSocket
- `@WebSocketServer()`: Inyecta instancia del servidor
- `@SubscribeMessage()`: Escucha eventos específicos
- `@ConnectedSocket()`: Acceso al socket del cliente
- `@MessageBody()`: Extrae el cuerpo del mensaje

## Comparación HTTP vs WebSocket

### HTTP (REST)
- **Comunicación**: Unidireccional (cliente → servidor)
- **Protocolo**: Stateless, nueva conexión por petición
- **Uso**: CRUD tradicional, APIs REST
- **Latencia**: Mayor (overhead de headers)

### WebSocket
- **Comunicación**: Bidireccional (cliente ↔ servidor)
- **Protocolo**: Stateful, conexión persistente
- **Uso**: Chat en tiempo real, notificaciones, juegos
- **Latencia**: Menor (conexión mantenida)

## Tecnologías Utilizadas

- **NestJS**: Framework backend progresivo
- **WebSockets/Socket.IO**: Comunicación en tiempo real
- **TypeScript**: Lenguaje de programación tipado
- **Node.js**: Entorno de ejecución

## Project setup

```bash
$ npm install
```

## Scripts disponibles

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
