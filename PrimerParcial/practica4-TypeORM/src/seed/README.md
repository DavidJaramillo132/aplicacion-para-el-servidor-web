infracture

# Infrastructure - Sistema de Gestión de Negocios y Citas

La carpeta infrastructure se encarga de simular la base de datos y manejar los *datos iniciales* del sistema. Proporciona repositorios en memoria y funciones de inicialización que permiten probar la lógica del sistema sin necesidad de una base de datos real.

---

## Funciones Principales

### 1. Obtener Datos Iniciales

La función obtenerDatosIniciales() devuelve todos los datos simulados del sistema:

- Clientes
- Citas
- Administradores del sistema
- Filas
- Contenidos
- Imágenes
- Tipos de servicio
- Horarios disponibles

```ts
import { obtenerDatosIniciales } from './infrastructure';

const datos = obtenerDatosIniciales();
console.log(datos.clientes); // Muestra clientes con sus citas asignadas    