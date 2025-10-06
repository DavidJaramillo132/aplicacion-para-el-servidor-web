### Estructura de Datos

#### ICita Interface
```typescript
interface ICita {
  id: string;                    // UUID único
  clienteID: string;             // Referencia al cliente
  fecha: Date;                   // Fecha y hora de la cita
  servicio: string;              // Tipo de servicio
  tiempoEstimado: string;        // Duración estimada
  estado: 'pendiente' | 'cancelada' | 'completada';
}
```

#### ICliente Interface
```typescript
interface ICliente {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  citas?: ICita[];
}