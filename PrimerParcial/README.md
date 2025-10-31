# Primer Parcial - Aplicaciones para el Servidor Web

## Información del Curso

- **Carrera:** Ingeniería de Software
- **Nivel:** Quinto Semestre
- **Asignatura:** Aplicación para el Servidor Web
- **Docente:** Ing. John Cevallos
- **Período Lectivo:** 2025–2026 (1)

## Integrantes del Equipo

- **Kelly Canchingre**
- **David Jaramillo**
- **Kevin Calderón**

## Descripción General

Este repositorio contiene el conjunto completo de prácticas desarrolladas durante el primer parcial de la asignatura "Aplicación para el Servidor Web". Cada práctica representa un avance progresivo en el aprendizaje de tecnologías modernas para el desarrollo de aplicaciones web del lado del servidor, comenzando desde los fundamentos de frontend hasta la implementación de comunicación en tiempo real con WebSockets.

## Contenido del Repositorio

### Práctica 1 - Frontend con Flask
**Carpeta:** `practica1-frontend/`

Desarrollo de una aplicación web frontend utilizando Flask (Python) para crear un sistema de gestión con múltiples vistas y rutas.

- **Tecnologías:** Flask, Python, HTML5, CSS3
- **Puerto:** http://localhost:5000
- **Objetivo:** Familiarización con Flask y sistema de plantillas

[Ver README detallado →](./practica1-frontend/README.md)

---

### Práctica 2 - TypeScript - Programación Orientada a Objetos
**Carpeta:** `practica2-TypeScript/`

Implementación de conceptos fundamentales de TypeScript y POO mediante un sistema de gestión de dispositivos para clientes con operaciones CRUD.

- **Tecnologías:** TypeScript, Node.js
- **Tipo:** Aplicación de consola
- **Objetivo:** Dominar TypeScript, interfaces, clases y tipos estáticos

[Ver README detallado →](./practica2-TypeScript/README.md)

---

### Práctica 3 - Backend con Arquitectura por Capas
**Carpeta:** `practica3-backend/`

Sistema de gestión de citas backend con arquitectura por capas, implementando patrones de diseño y Domain-Driven Design.

- **Tecnologías:** TypeScript, Node.js, Arquitectura en Capas
- **Puerto:** Aplicación de consola
- **Objetivo:** Implementar arquitectura profesional y separación de responsabilidades

[Ver README detallado →](./practica3-backend/README.md)

---

### Práctica 4 - TypeORM - Gestión de Base de Datos
**Carpeta:** `practica4-TypeORM/`

Sistema de gestión de usuarios utilizando TypeORM como ORM para interactuar con base de datos SQLite.

- **Tecnologías:** TypeScript, TypeORM, SQLite, Node.js
- **Base de Datos:** SQLite (database.sqlite)
- **Objetivo:** Aprender ORM, definir entidades, relaciones y operaciones de BD

[Ver README detallado →](./practica4-TypeORM/README.md)

---

### Práctica 5 - NestJS - Framework Backend Empresarial
**Carpeta:** `practica5-NestJS/`

Implementación de aplicaciones backend utilizando NestJS con arquitectura modular, inyección de dependencias y APIs RESTful.

**Contiene dos proyectos:**
- `practica/` - Proyecto NestJS básico
- `practica#4/` - CRUD completo con SQLite

- **Tecnologías:** NestJS, TypeScript, TypeORM, SQLite
- **Puerto:** http://localhost:3000
- **Objetivo:** Dominar NestJS, decoradores y arquitectura empresarial

[Ver README detallado →](./practica5-NestJS/README.md)

---

### Práctica 6 - GraphQL con NestJS
**Carpeta:** `practica6-graph-ql/`

API GraphQL utilizando NestJS y Apollo Server para sistema de gestión de citas completo.

**Incluye proyecto comparativo:**
- `practica6-GraphQL-clase/` - REST vs GraphQL

- **Tecnologías:** NestJS, GraphQL, Apollo Server, TypeScript
- **Puerto:** http://localhost:3001
- **GraphQL Playground:** http://localhost:3001/graphql
- **Objetivo:** Implementar GraphQL, queries, mutations y ventajas sobre REST

[Ver README detallado →](./practica6-graph-ql/README.md)

---

### Práctica 7 - WebSockets - Comunicación en Tiempo Real
**Carpeta:** `practica7-web-socket/`

Implementación de comunicación en tiempo real utilizando WebSockets con NestJS para aplicaciones interactivas.

**Incluye proyecto comparativo:**
- `practica7-web-socket-clase/` - REST vs WebSocket

- **Tecnologías:** NestJS, WebSockets, Socket.IO, TypeScript
- **Puerto:** http://localhost:3000
- **WebSocket:** ws://localhost:3000
- **Objetivo:** Implementar comunicación bidireccional y broadcasting en tiempo real

[Ver README detallado →](./practica7-web-socket/README.md)

---

## Progresión Tecnológica

```
1. Flask (Python) - Frontend básico
        ↓
2. TypeScript - POO y tipos estáticos
        ↓
3. Backend TypeScript - Arquitectura por capas
        ↓
4. TypeORM - Persistencia de datos
        ↓
5. NestJS - Framework empresarial + REST APIs
        ↓
6. GraphQL - APIs flexibles y eficientes
        ↓
7. WebSockets - Comunicación en tiempo real
```

## Tecnologías Utilizadas en el Parcial

### Lenguajes de Programación
- **Python** (Flask)
- **TypeScript** (todas las demás prácticas)
- **JavaScript** (compilación de TypeScript)

### Frameworks y Bibliotecas
- **Flask** - Framework web de Python
- **NestJS** - Framework progresivo de Node.js
- **TypeORM** - ORM para TypeScript y JavaScript
- **Apollo Server** - Servidor GraphQL
- **Socket.IO** - Biblioteca WebSocket

### Bases de Datos
- **SQLite** - Base de datos embebida para desarrollo

### Herramientas de Desarrollo
- **Node.js** - Entorno de ejecución JavaScript
- **npm** - Gestor de paquetes
- **TypeScript Compiler** - Transpilador TypeScript
- **ts-node-dev** - Desarrollo con hot-reload

## Conceptos Aprendidos

### Arquitectura y Diseño
- Arquitectura por Capas (Layered Architecture)
- Domain-Driven Design (DDD)
- Patrón Repository
- Inyección de Dependencias
- Separación de Responsabilidades

### Paradigmas de Programación
- Programación Orientada a Objetos (POO)
- Programación Funcional
- Programación Asíncrona
- Programación Reactiva (RxJS)

### APIs y Protocolos
- REST APIs
- GraphQL APIs
- WebSockets
- HTTP/HTTPS

### Persistencia de Datos
- ORM (Object-Relational Mapping)
- Entidades y Relaciones
- Migraciones
- Seeding de datos

## Instalación Global de Dependencias

Para ejecutar cualquiera de las prácticas, asegúrese de tener instalado:

```powershell
# Node.js y npm (verificar versiones)
node --version  # v16 o superior
npm --version   # v8 o superior

# Python (para práctica 1)
python --version  # 3.8 o superior

# TypeScript (global, opcional)
npm install -g typescript

# NestJS CLI (global, opcional)
npm install -g @nestjs/cli
```

## Estructura General del Repositorio

```
PrimerParcial/
├── practica1-frontend/          # Flask + HTML/CSS
├── practica2-TypeScript/        # TypeScript POO
├── practica3-backend/           # Backend con capas
├── practica4-TypeORM/           # ORM y base de datos
├── practica5-NestJS/            # NestJS Framework
│   ├── practica/
│   └── practica#4/
├── practica6-graph-ql/          # GraphQL API
├── practica6-GraphQL-clase/     # Comparación REST vs GraphQL
│   ├── graph-ql/
│   └── rest/
├── practica7-web-socket/        # WebSockets
├── practica7-web-socket-clase/  # Comparación REST vs WS
│   ├── rest/
│   └── web-socket/
└── README.md                    # Este archivo
```

## Comandos Comunes

### Para proyectos Python (práctica 1)
```powershell
pip install flask
python app.py
```

### Para proyectos TypeScript (prácticas 2-4)
```powershell
npm install
npm run dev
```

### Para proyectos NestJS (prácticas 5-7)
```powershell
npm install
npm run start:dev
```

## Recursos de Aprendizaje

### Documentación Oficial
- [Flask Documentation](https://flask.palletsprojects.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Socket.IO Documentation](https://socket.io/docs/)

### Herramientas Recomendadas
- **Visual Studio Code** - Editor de código
- **Postman** - Cliente HTTP/REST
- **GraphQL Playground** - Cliente GraphQL
- **DB Browser for SQLite** - Visualizador de BD

## Evaluación

Cada práctica fue evaluada en base a:
- Correcta implementación de los conceptos
- Calidad del código
- Documentación (README.md)
- Funcionamiento correcto
- Aplicación de buenas prácticas

## Contacto

Para consultas sobre las prácticas, contactar a cualquiera de los integrantes del equipo:
- Kelly Canchingre
- David Jaramillo
- Kevin Calderón

---

**Universidad:** ULEAM  
**Facultad:** Ingeniería de Software  
**Año:** 2025
