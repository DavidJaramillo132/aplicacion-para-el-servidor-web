### Repositorio - Operaciones CRUD

#### Operaciones Disponibles
- `create(cita: ICita)` - Crear nueva cita
- `findById(id: string)` - Buscar cita por ID
- `list()` - Listar todas las citas
- `update(cita: ICita)` - Actualizar cita existente
- `delete(id: string)` - Eliminar cita

```typescript
export class CitaService {
    constructor(private contrato: IContratoCita) { }
    // Encapsulación: propiedad privada 'contrato'
}
```