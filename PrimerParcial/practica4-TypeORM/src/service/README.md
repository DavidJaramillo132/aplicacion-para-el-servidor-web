## Documentación de APIs

### CitaService - Métodos Principales

#### Agendar Cita
```typescript
async agendar(
  cliente: ICliente, 
  servicio: string, 
  fecha: Date, 
  tiempoEstimado: number, 
  estado: 'pendiente'
): Promise<ICita>
```
- **Funcionalidad**: Crea una nueva cita
- **Validaciones**: Verifica disponibilidad de horario
- **Respuesta**: Objeto ICita creado
- **Errores**: "Horario ocupado" si el horario está tomado

#### Listar Citas
```typescript
async listar(): Promise<ICita[]>
```
- **Funcionalidad**: Obtiene todas las citas registradas
- **Respuesta**: Array de objetos ICita
- **Log**: Muestra cantidad de citas encontradas

#### Cancelar Cita
```typescript
async cancelar(id: string): Promise<ICita>
```
- **Funcionalidad**: Cambia el estado de una cita a "cancelada"
- **Parámetros**: ID de la cita
- **Respuesta**: Objeto ICita actualizado
- **Errores**: "Cita no encontrada" si el ID no existe

#### Eliminar Cita
```typescript
async eliminar(id: string): Promise<boolean>
```
- **Funcionalidad**: Elimina permanentemente una cita
- **Parámetros**: ID de la cita
- **Respuesta**: boolean (true si se eliminó, false si no)
- **Manejo de errores**: Retorna false en caso de error

#### Crear Cita
```typescript
async agendar(cliente: ICliente, ...): Promise<ICita> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simula latencia de 2 segundos
}
```