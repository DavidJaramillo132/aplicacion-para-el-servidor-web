# FilaVirtual - Sistema de Gestión de Citas

## 📋 Descripción del Proyecto

FilaVirtual es un sistema web completo para la gestión de citas y filas virtuales que permite a diferentes tipos de negocios administrar sus servicios y a los clientes reservar turnos de manera eficiente.

## 🚀 Características Principales

### **Para Clientes:**
- Búsqueda y filtrado de negocios
- Visualización de servicios disponibles
- Reserva de citas en tiempo real
- Seguimiento de posición en fila virtual
- Gestión de citas programadas
- Notificaciones y recordatorios

### **Para Admin Local (Dueños de Negocio):**
- Dashboard completo del negocio
- Gestión de fila virtual en tiempo real
- Administración de servicios y precios
- Control de citas del día
- Reportes de rendimiento
- Configuración de horarios y capacidad

### **Para Admin General (Administrador del Sistema):**
- Dashboard general del sistema
- Gestión de todos los negocios
- Administración de usuarios
- Reportes y estadísticas generales
- Sistema de advertencias
- Monitoreo del sistema

## 📁 Estructura de Archivos

```
practica4-/
├── index.html              # Página principal
├── admin-general.html      # Dashboard Admin General
├── admin-local.html        # Dashboard Admin Local  
├── client.html            # Interfaz del Cliente
├── css/
│   └── styles.css         # Estilos globales
└── js/
    └── script.js          # JavaScript global
```

## 🎨 Tipos de Negocios Soportados

1. **Restaurantes** 🍽️
   - Reservas de mesas
   - Pedidos para llevar
   - Delivery
   - Eventos especiales

2. **Hospitales** 🏥
   - Consultas médicas
   - Especialidades
   - Laboratorio
   - Emergencias

3. **Veterinarias** 🐾
   - Consultas veterinarias
   - Vacunación
   - Cirugías
   - Servicios de grooming

4. **Salones de Belleza** ✂️
   - Cortes de cabello
   - Manicure y pedicure
   - Tratamientos faciales
   - Maquillaje

5. **Bancos** 🏛️
   - Atención al cliente
   - Préstamos
   - Apertura de cuentas
   - Asesoría financiera

6. **Oficinas Gubernamentales** 🏛️
   - Trámites de documentos
   - Registro civil
   - Licencias
   - Permisos

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Framework CSS:** Bootstrap-like custom styles
- **Iconos:** Font Awesome 6.0
- **Responsive Design:** Grid Layout y Flexbox
- **Base de datos sugerida:** PostgreSQL
- **Backend sugerido:** TypeScript/Node.js

## 📱 Características Responsive

- Diseño adaptable para móviles, tablets y desktop
- Sidebar colapsable en dispositivos móviles
- Grids flexibles que se adaptan al tamaño de pantalla
- Navegación optimizada para touch

## 🎯 Funcionalidades por Rol

### **Cliente (client.html)**
- ✅ Búsqueda de negocios por tipo y ubicación
- ✅ Filtros dinámicos por categoría
- ✅ Visualización de tiempo de espera en tiempo real
- ✅ Sistema de reservas con formulario
- ✅ Gestión de citas activas y programadas
- ✅ Perfil de usuario personalizable

### **Admin Local (admin-local.html)**
- ✅ Dashboard con métricas del negocio
- ✅ Fila virtual interactiva en tiempo real
- ✅ Gestión de citas del día
- ✅ Control de estado del negocio (abierto/cerrado)
- ✅ Administración de servicios
- ✅ Reportes de rendimiento
- ✅ Sistema de notificaciones a clientes

### **Admin General (admin-general.html)**
- ✅ Dashboard global del sistema
- ✅ Gestión de todos los negocios
- ✅ Administración de usuarios
- ✅ Sistema de alertas del sistema
- ✅ Herramientas de moderación
- ✅ Reportes y estadísticas generales
- ✅ Sistema de advertencias a negocios

## 🎨 Diseño y UX

### **Paleta de Colores:**
- Primario: `#667eea` (Azul gradient)
- Secundario: `#764ba2` (Púrpura gradient)
- Éxito: `#28a745` (Verde)
- Advertencia: `#ffc107` (Amarillo)
- Peligro: `#dc3545` (Rojo)
- Info: `#17a2b8` (Azul claro)

### **Componentes Reutilizables:**
- Cards con efectos hover
- Botones con estados
- Tablas responsivas
- Modales centrados
- Badges de estado
- Formularios estilizados

## 📊 Entidades TypeScript Sugeridas

```typescript
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'cliente' | 'admin_local' | 'admin_general';
  fechaRegistro: Date;
}

interface Negocio {
  id: string;
  nombre: string;
  tipo: TipoNegocio;
  direccion: string;
  telefono: string;
  email: string;
  adminId: string;
  servicios: Servicio[];
  horarios: Horario[];
  estado: 'activo' | 'inactivo' | 'suspendido';
  fechaRegistro: Date;
}

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number; // en minutos
  disponible: boolean;
  negocioId: string;
}

interface Cita {
  id: string;
  clienteId: string;
  negocioId: string;
  servicioId: string;
  fechaHora: Date;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
  posicionFila?: number;
  notasEspeciales?: string;
  fechaCreacion: Date;
}

interface FilaVirtual {
  id: string;
  negocioId: string;
  citas: Cita[];
  tiempoEsperaPromedio: number;
  fechaActualizacion: Date;
}

enum TipoNegocio {
  RESTAURANTE = 'restaurante',
  HOSPITAL = 'hospital',
  VETERINARIA = 'veterinaria',
  SALON = 'salon',
  BANCO = 'banco',
  GOBIERNO = 'gobierno'
}
```

## 🚀 Funciones JavaScript Implementadas

### **Globales (script.js):**
- `showModal()` / `closeModal()` - Gestión de modales
- `showNotification()` - Sistema de notificaciones
- `searchTable()` - Búsqueda en tablas
- `generateSample*()` - Generadores de datos de prueba

### **Cliente específicas:**
- `filterByType()` - Filtrado por tipo de negocio
- `searchBusinesses()` - Búsqueda de negocios
- `bookAppointment()` - Reserva de citas
- `showBusinessDetails()` - Mostrar detalles del negocio

### **Admin Local específicas:**
- `callNext()` - Llamar siguiente en fila
- `completeService()` - Completar servicio
- `toggleBusinessStatus()` - Cambiar estado del negocio
- `addCustomerToQueue()` - Agregar cliente a fila

### **Admin General específicas:**
- `sendWarning()` - Enviar advertencias
- `activateBusiness()` - Activar negocio
- `exportReport()` - Exportar reportes
- `markAllAsRead()` - Marcar alertas como leídas

## 🔄 Simulaciones en Tiempo Real

- **Actualización de tiempos de espera** cada 10 segundos
- **Métricas del dashboard** se actualizan cada 30 segundos
- **Posiciones en fila virtual** se recalculan automáticamente
- **Notificaciones en tiempo real** cuando cambia el estado

## 📱 Navegación

- **Página principal:** `index.html`
- **Dashboard Admin General:** `admin-general.html`
- **Dashboard Admin Local:** `admin-local.html`
- **Interfaz Cliente:** `client.html`

## 💡 Mejoras Futuras Sugeridas

1. **Integración con APIs reales:**
   - Google Maps para ubicaciones
   - Sistema de pagos (Stripe/PayPal)
   - Notificaciones push reales

2. **Funcionalidades adicionales:**
   - Chat en tiempo real
   - Sistema de calificaciones
   - Programa de lealtad
   - Reportes avanzados con gráficos

3. **Optimizaciones técnicas:**
   - Service Workers para offline
   - PWA (Progressive Web App)
   - Lazy loading de imágenes
   - Optimización de rendimiento

## 🎯 Cómo usar

1. Abrir `index.html` en un navegador web
2. Explorar los diferentes tipos de negocios
3. Hacer clic en "Acceder como..." para ver los diferentes dashboards
4. Cada dashboard tiene funcionalidades específicas según el rol

## 📞 Soporte

Para dudas o mejoras, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para mejorar la experiencia de gestión de citas virtuales**