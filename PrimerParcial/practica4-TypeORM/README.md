# Taller de Práctica 3 – Modelado de Dominio y Persistencia con TypeORM (Puro)

##  Información General

| Campo | Detalle |
|--------|----------|
| **Carrera:** | Ingeniería de Software |
| **Nivel:** | Quinto |
| **Asignatura:** | Aplicación para el Servidor Web |
| **Docente:** | Ing. John Cevallos |
| **Período Lectivo:** | 2025–2026 (1) |
| **Número de Taller:** | 3 |
| **Tecnología:** | Node.js + TypeScript con TypeORM (puro, sin frameworks) |

---

## Tema y Objetivo

### **Tema:**  
Persistencia del dominio y lógica de acceso a datos utilizando **TypeORM sin frameworks** (Node.js/TypeScript).

### **Objetivo:**  
Modelar el dominio completo del proyecto definiendo entidades, relaciones y servicios CRUD robustos.  
Implementar la conexión y la lógica de acceso a datos mediante **TypeORM puro**, probando todo con un script de *seeding* y validando las operaciones CRUD.

---

## Integrantes del Equipo

| **David Jaramillo** | Desarrollador Principal | Implementación de CRUDs, lógica de negocio, manejo de relaciones |
| **Kelly Canchingre** | Arquitecta de Software | Diseño de entidades y relaciones, definición de contratos |
| **Kevin Calderón** | Especialista en Datos | Configuración de seeding y datos iniciales, validación de persistencia |

---

## Arquitectura Implementada

### **Arquitectura por Capas (Layered Architecture)**

Entidad (Dominio)
↓
Servicio / Repositorio (Lógica de Negocio)
↓
DataSource (Persistencia / Infraestructura)


### Capas del Proyecto
1. **Capa de Entidad (`src/entities/`)**
   - Contiene las clases del dominio anotadas con decoradores de TypeORM (`@Entity`, `@Column`, `@OneToMany`, etc.).
   - Define las relaciones entre usuarios, negocios, servicios, citas y estaciones.

2. **Capa de Servicio (`src/service/`)**
   - Encapsula la lógica CRUD.
   - Interactúa directamente con el repositorio TypeORM mediante `AppDataSource.getRepository()`.

3. **Capa de Infraestructura (`src/data-source.ts`)**
   - Configura el origen de datos (`DataSource`) utilizando SQLite.
   - Registra las entidades y permite la inicialización centralizada de la base.

4. **Capa de Ejecución y Seeding (`src/seed/` y `src/main.ts`)**
   - Inserta datos iniciales de prueba.
   - Demuestra la funcionalidad de las operaciones CRUD y relaciones entre entidades.

---

## Entidades Implementadas

| Entidad | Descripción | Relaciones |
|----------|--------------|-------------|
| **Usuario** | Representa a clientes y administradores del sistema | 1:N con `Cita`, 1:N con `Negocio` |
| **Negocio** | Empresa o local administrado por un usuario | N:1 con `Usuario`, 1:N con `Servicio` y `Estacion` |
| **Servicio** | Servicios ofrecidos por el negocio | N:1 con `Negocio` |
| **Cita** | Reserva agendada por un usuario para un servicio | N:1 con `Usuario` |
| **Estacion** | Área o módulo de atención asociado a un negocio | N:1 con `Negocio`, 1:N con `Fila` y `HorarioAtencion` |

---

## Requisitos de Instalación

###  Prerrequisitos
- Node.js ≥ 18  
- npm ≥ 9  
- TypeScript ≥ 5.9  
- SQLite3 (instalado automáticamente con dependencias)

---

### 🔹 Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/DavidJaramillo132/aplicacion-para-el-servidor-web
   cd PrimerParcial/practica4-TypeORM


### Terminal

Conexión establecida con éxito
Usuarios listos: david@example.com, ana@example.com
Negocio listo: Café Aroma
Servicio listo: Café Expreso
Cita lista: <uuid>
Estación lista: Estación Central
✅ Seed finalizado correctamente
