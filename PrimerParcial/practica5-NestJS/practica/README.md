# Practica (NestJS) — README general

Resumen
-------
Proyecto de ejemplo con NestJS que expone un CRUD para la entidad Dispositivo usando TypeORM + SQLite. Incluye validaciones con class-validator y DTOs para creación/actualización.

Estructura relevante
--------------------
- Código fuente: [src/main.ts](src/main.ts) — punto de arranque (bootstrap).
- Módulo principal: [src/app.module.ts](src/app.module.ts).
- Módulo de dispositivos: [src/dispositivos/dispositivos.module.ts](src/dispositivos/dispositivos.module.ts) (`DispositivosModule`).
- Controlador: [src/dispositivos/dispositivos.controller.ts](src/dispositivos/dispositivos.controller.ts) (`DispositivosController`).
- Servicio: [src/dispositivos/dispositivos.service.ts](src/dispositivos/dispositivos.service.ts) (`DispositivosService`).
- Entidad TypeORM: [src/dispositivos/entities/dispositivo.entity.ts](src/dispositivos/entities/dispositivo.entity.ts) (`Dispositivo`).
- DTOs y validaciones:
  - [src/dispositivos/dto/create-dispositivo.dto.ts](src/dispositivos/dto/create-dispositivo.dto.ts)
  - [src/dispositivos/dto/update-dispositivo.dto.ts](src/dispositivos/dto/update-dispositivo.dto.ts)

Requisitos
---------
- Node.js >= 18
- npm
- Dependencias declaradas en [package.json](package.json)

Instalación
----------
1. Instalar dependencias:
   ```sh
   npm install