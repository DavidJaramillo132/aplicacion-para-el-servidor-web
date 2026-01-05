# 📘 Explicación del Funcionamiento del Taller

## Guía Completa del Sistema de Idempotent Consumer

---

## 📋 Índice

1. [¿Qué es este taller?](#1-qué-es-este-taller)
2. [Problema que resuelve](#2-problema-que-resuelve)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Componentes principales](#4-componentes-principales)
5. [Flujo de funcionamiento](#5-flujo-de-funcionamiento)
6. [Implementación de idempotencia](#6-implementación-de-idempotencia)
7. [Tecnologías utilizadas](#7-tecnologías-utilizadas)
8. [Cómo ejecutar el proyecto](#8-cómo-ejecutar-el-proyecto)
9. [Pruebas y validación](#9-pruebas-y-validación)
10. [Conclusiones](#10-conclusiones)

---

## 1. ¿Qué es este taller?

Este taller es una **implementación completa del patrón Idempotent Consumer** en un sistema bancario distribuido. El objetivo principal es **garantizar que las transferencias de dinero nunca se dupliquen**, incluso si la misma solicitud se recibe múltiples veces.

### Contexto

En sistemas distribuidos modernos, especialmente en aplicaciones financieras, es común que:
- Los usuarios hagan doble clic accidentalmente
- Las redes fallen y los clientes reintenten operaciones
- Los sistemas de mensajería entreguen duplicados (at-least-once delivery)
- Los balanceadores de carga reenvíen solicitudes

**Sin idempotencia**: Esto resulta en transacciones duplicadas, dinero debitado múltiples veces, inconsistencias en bases de datos.

**Con idempotencia**: El sistema detecta solicitudes duplicadas y devuelve el resultado original sin volver a procesar.

---

## 2. Problema que resuelve

### Escenario sin Idempotencia (❌ PROBLEMA)

```
Usuario: "Quiero transferir $500 a Juan"
[Usuario hace doble clic]

Sistema recibe solicitud 1:
  → Debita $500 de cuenta de usuario
  → Acredita $500 a cuenta de Juan
  → Saldo usuario: $9,500

Sistema recibe solicitud 2 (duplicada):
  → Debita $500 OTRA VEZ ❌
  → Acredita $500 OTRA VEZ
  → Saldo usuario: $9,000 ❌

PROBLEMA: Usuario quería transferir $500 pero se debitaron $1,000
```

### Solución con Idempotencia (✅ CORRECTO)

```
Usuario: "Quiero transferir $500 a Juan"
[Usuario hace doble clic]

Sistema recibe solicitud 1 con key "abc123":
  ✅ Verifica Redis: key "abc123" NO EXISTE
  → Debita $500 de cuenta de usuario
  → Acredita $500 a cuenta de Juan
  → GUARDA resultado en Redis con key "abc123"
  → Saldo usuario: $9,500

Sistema recibe solicitud 2 (duplicada) con MISMA key "abc123":
  ✅ Verifica Redis: key "abc123" YA EXISTE
  → NO PROCESA NADA
  → Devuelve resultado guardado en Redis
  → Saldo usuario: $9,500 ✅

CORRECTO: Usuario transfirió exactamente $500, una sola vez
```

---

## 3. Arquitectura del sistema

### Diagrama de Alto Nivel

```
┌──────────────┐
│   CLIENTE    │ (Usuario/Postman/App)
│              │
└──────┬───────┘
       │ HTTP Request
       │ + idempotency_key
       ▼
┌──────────────────────┐
│   API GATEWAY        │ :3000
│   (NestJS)           │
└──────┬──────┬────────┘
       │      │
       │      └──────────────────────┐
       │                             │
       ▼                             ▼
┌──────────────┐            ┌────────────────┐
│  MS-MASTER   │            │  MS-WORKER     │
│  :3001       │◄──────────►│  :3002         │
│              │  RabbitMQ  │                │
│  Gestiona    │            │  Procesa       │
│  Cuentas     │            │  Transferencias│
│              │            │  ⭐ IDEMPOTENCIA│
└──────┬───────┘            └───────┬────────┘
       │                            │
       ▼                            │
┌──────────────┐                   │
│ PostgreSQL   │                   │
│ Master       │                   │
│ :5433        │                   │
│              │                   │
│ Tabla:       │                   ▼
│ - cuentas    │            ┌──────────────┐  ┌──────────────┐
└──────────────┘            │ PostgreSQL   │  │    Redis     │
                            │ Worker       │  │    :6379     │
                            │ :5434        │  │              │
                            │              │  │  ⭐ CACHE DE │
                            │ Tabla:       │  │  IDEMPOTENCIA│
                            │ - transferenc│  │              │
                            │ - idempotency│  │  Keys:       │
                            └──────────────┘  │  idempotency:│
                                              │  <sha256>    │
                                              └──────────────┘
                                   │
                                   │ Events
                                   ▼
                            ┌──────────────┐
                            │  RabbitMQ    │
                            │  :5672       │
                            │              │
                            │  Eventos:    │
                            │  - transf.   │
                            │    completada│
                            └──────┬───────┘
                                   │
                                   │ Webhook
                                   ▼
                            ┌──────────────┐
                            │ Edge         │
                            │ Functions    │
                            │ (Supabase)   │
                            │              │
                            │ - Logger     │
                            │ - Notifier   │
                            └──────────────┘
```

### Responsabilidades de cada componente

| Componente | Puerto | Responsabilidad | Rol en Idempotencia |
|------------|--------|-----------------|---------------------|
| **API Gateway** | 3000 | Enrutamiento de requests | Proxy transparente |
| **MS-Master** | 3001 | CRUD de cuentas bancarias | Emisor de eventos |
| **MS-Worker** | 3002 | Procesar transferencias | ⭐ **IMPLEMENTA IDEMPOTENCIA** |
| **PostgreSQL Master** | 5433 | Almacena cuentas | Persistencia |
| **PostgreSQL Worker** | 5434 | Almacena transferencias | Persistencia + Fallback |
| **Redis** | 6379 | Cache distribuido | ⭐ **ALMACENA KEYS** |
| **RabbitMQ** | 5672 | Message broker | Event bus |
| **Edge Functions** | Supabase | Procesar webhooks | Notificaciones |

---

## 4. Componentes principales

### 4.1 MS-Worker: El Corazón del Taller

**Este microservicio implementa el patrón Idempotent Consumer**

**Archivo clave**: `ms-worker/src/services/transferencia.service.ts`

```typescript
async createTransferencia(dto: CreateTransferenciaDto) {
  // 1️⃣ GENERAR CLAVE DE IDEMPOTENCIA
  const idempotencyKey = this.generateIdempotencyKey(dto);
  
  // 2️⃣ VERIFICAR EN REDIS SI YA FUE PROCESADA
  const cached = await this.redisService.get(`idempotency:${idempotencyKey}`);
  
  if (cached) {
    // ✅ YA EXISTE: Devolver resultado guardado
    // NO PROCESAR NADA MÁS
    return JSON.parse(cached);
  }
  
  // 3️⃣ NO EXISTE: Es una solicitud nueva
  // Procesar transacción
  const result = await this.processTransferencia(dto);
  
  // 4️⃣ GUARDAR RESULTADO EN REDIS
  await this.redisService.set(
    `idempotency:${idempotencyKey}`,
    JSON.stringify(result),
    'EX',
    604800 // 7 días en segundos
  );
  
  // 5️⃣ EMITIR EVENTO A RABBITMQ
  this.eventEmitter.emit('transferencia.completada', result);
  
  return result;
}

// Genera una clave única basada en los parámetros
private generateIdempotencyKey(dto: CreateTransferenciaDto): string {
  const data = `${dto.cuentaOrigenId}-${dto.cuentaDestinoId}-${dto.monto}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}
```

**¿Por qué SHA-256?**
- Es **determinista**: Mismos inputs → Mismo hash
- Es **seguro**: No se puede revertir
- Es **único**: Probabilidad de colisión casi cero

### 4.2 Redis: El Almacén de Idempotencia

**Estructura de datos en Redis:**

```
Key:   "idempotency:78f7a98d30828cb5405b5732e7f0f7fa1f25..."
Value: {
  "id": 1,
  "transferenciaId": "TXN_1765195778976_gue8x4ro5",
  "cuentaOrigenId": 1,
  "cuentaDestinoId": 2,
  "monto": "500.00",
  "estado": "COMPLETADA",
  "timestamp": "2025-12-15T10:30:00Z"
}
TTL: 604800 segundos (7 días)
```

**¿Por qué Redis?**
- ⚡ **Velocidad**: Operaciones en microsegundos (vs milisegundos de SQL)
- 🔄 **TTL automático**: Auto-limpieza, no consume memoria infinita
- 🌐 **Distribuido**: Múltiples instancias pueden acceder
- 💾 **Fallback**: Si falla, se usa PostgreSQL

### 4.3 RabbitMQ: Event Bus

**Eventos que maneja:**
- `transferencia.completada`: Cuando se completa una transferencia
- `cuenta.actualizada`: Cuando se actualiza un saldo

**Patrón Pub/Sub:**
```
MS-Worker (Publisher)
  → Publica: "transferencia.completada"
    ↓
RabbitMQ (Broker)
    ↓
  → MS-Master (Subscriber): Actualiza saldos
  → Webhook Service (Subscriber): Envía notificaciones
```

---

## 5. Flujo de funcionamiento

### Flujo Completo: Paso a Paso

```
PASO 1: CLIENTE ENVÍA SOLICITUD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cliente hace:
POST http://localhost:3000/transferencias
Body: {
  "cuentaOrigenId": 1,
  "cuentaDestinoId": 2,
  "monto": 500.00
}

PASO 2: API GATEWAY RECIBE Y REENVÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gateway:
  - Recibe en puerto 3000
  - Valida request
  - Reenvía a MS-Worker:3002

PASO 3: MS-WORKER GENERA IDEMPOTENCY KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MS-Worker:
  key = SHA256("1-2-500.00")
  key = "78f7a98d30828cb5405b5732e7f0f7fa1f25..."

PASO 4: VERIFICAR EN REDIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MS-Worker:
  cached = redis.get("idempotency:78f7a98d...")
  
  ┌─ SI EXISTE (cached != null):
  │    → Devolver cached
  │    → FIN (NO procesar)
  │
  └─ NO EXISTE (cached == null):
       → Continuar al PASO 5

PASO 5: PROCESAR TRANSACCIÓN (Solo si NO EXISTE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MS-Worker:
  1. Iniciar transacción SQL
  2. Debitar $500 de cuenta 1
     UPDATE cuentas SET saldo = saldo - 500 WHERE id = 1
  3. Acreditar $500 a cuenta 2
     UPDATE cuentas SET saldo = saldo + 500 WHERE id = 2
  4. Insertar registro de transferencia
     INSERT INTO transferencias (...)
  5. Commit transacción
  
PASO 6: GUARDAR EN REDIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MS-Worker:
  redis.set(
    "idempotency:78f7a98d...",
    JSON.stringify(result),
    'EX',
    604800
  )

PASO 7: EMITIR EVENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MS-Worker:
  eventEmitter.emit('transferencia.completada', {
    id: 1,
    monto: 500,
    timestamp: ...
  })
  ↓
RabbitMQ recibe evento
  ↓
Webhook Service escucha
  ↓
Envía a Edge Functions

PASO 8: RESPUESTA AL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Response:
{
  "id": 1,
  "transferenciaId": "TXN_...",
  "estado": "COMPLETADA",
  "idempotencyKey": "78f7a98d..."
}
```

### ¿Qué pasa con una solicitud DUPLICADA?

```
SOLICITUD DUPLICADA (Mismos parámetros)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST http://localhost:3000/transferencias
Body: {
  "cuentaOrigenId": 1,    ← MISMO
  "cuentaDestinoId": 2,   ← MISMO
  "monto": 500.00         ← MISMO
}

MS-Worker:
  1. Genera MISMA key: "78f7a98d..."
  2. Busca en Redis: "idempotency:78f7a98d..."
  3. ✅ ENCUENTRA el resultado
  4. 🚫 NO PROCESA transacción
  5. Devuelve resultado guardado

Response:
{
  "id": 1,                 ← MISMO ID
  "transferenciaId": "...", ← MISMA TRANSACCIÓN
  "estado": "COMPLETADA"
}

RESULTADO: NO se debitó dinero otra vez ✅
```

---

## 6. Implementación de idempotencia

### 6.1 Código Real del Proyecto

**Archivo**: `ms-worker/src/services/idempotency.service.ts`

```typescript
@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(IdempotencyRecord)
    private idempotencyRepo: Repository<IdempotencyRecord>,
  ) {}

  // Verificar si una key ya fue procesada
  async check(key: string): Promise<any> {
    // 1. Intentar obtener de Redis (rápido)
    try {
      const cached = await this.redis.get(`idempotency:${key}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Redis error:', error);
    }

    // 2. Fallback: Buscar en PostgreSQL
    const record = await this.idempotencyRepo.findOne({
      where: { key }
    });

    return record ? record.response : null;
  }

  // Guardar resultado de una operación
  async save(key: string, response: any): Promise<void> {
    const responseJson = JSON.stringify(response);

    // 1. Guardar en Redis (TTL: 7 días)
    try {
      await this.redis.set(
        `idempotency:${key}`,
        responseJson,
        'EX',
        604800
      );
    } catch (error) {
      console.error('Redis save error:', error);
    }

    // 2. Guardar en PostgreSQL (permanente)
    try {
      await this.idempotencyRepo.save({
        key,
        response: responseJson,
        createdAt: new Date()
      });
    } catch (error) {
      // Ya existe, ignorar
      if (!error.message.includes('duplicate')) {
        throw error;
      }
    }
  }
}
```

### 6.2 Tabla de Idempotencia en PostgreSQL

```sql
CREATE TABLE idempotency_records (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_idempotency_key ON idempotency_records(key);
```

**¿Por qué también PostgreSQL?**
- **Durabilidad**: Redis puede reiniciarse y perder datos
- **Auditabilidad**: Registro permanente de operaciones
- **Compliance**: Regulaciones pueden requerir logs permanentes

### 6.3 Estrategia de TTL

**Time To Live (TTL) en Redis: 7 días**

¿Por qué 7 días?

| Tiempo | Pros | Contras |
|--------|------|---------|
| **1 hora** | Libera memoria rápido | Ventana muy corta para reintentos |
| **24 horas** | Balance razonable | Aún puede ser poco |
| **7 días** ✅ | Cubre cualquier escenario de retry | Usa más memoria |
| **30 días** | Máxima cobertura | Desperdicio de memoria |

**Decisión**: 7 días es el **sweet spot** entre disponibilidad y uso de memoria.

---

## 7. Tecnologías utilizadas

### 7.1 Backend: NestJS + TypeScript

**NestJS** es un framework para Node.js que:
- Usa decoradores (@Controller, @Injectable, etc.)
- Implementa inyección de dependencias
- Modular y escalable
- TypeScript nativo

**Ejemplo de controlador:**
```typescript
@Controller('transferencias')
export class TransferenciaController {
  constructor(
    private readonly transferenciaService: TransferenciaService
  ) {}

  @Post()
  async create(@Body() dto: CreateTransferenciaDto) {
    return this.transferenciaService.createTransferencia(dto);
  }
}
```

### 7.2 Bases de Datos

#### PostgreSQL (x2 instancias)
- **Master** (5433): Tabla `cuentas`
- **Worker** (5434): Tablas `transferencias` + `idempotency_records`

**¿Por qué 2 bases de datos?**
- **Database per Service pattern**: Cada microservicio tiene su propia BD
- **Independencia**: Un servicio no afecta a otro
- **Escalabilidad**: Se pueden optimizar independientemente

#### Redis (1 instancia)
- **Puerto**: 6379
- **Uso**: Cache de idempotencia
- **Persistencia**: Opcional (RDB/AOF)

### 7.3 Message Broker: RabbitMQ

**Características:**
- **AMQP Protocol**: Estándar de mensajería
- **Exchanges y Queues**: Routing flexible
- **Acknowledgments**: Garantía de entrega
- **Durable**: Mensajes persisten en disco

**Configuración en el proyecto:**
```typescript
// En app.module.ts
ClientsModule.register([
  {
    name: 'RABBITMQ_CLIENT',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'transferencias_queue',
      queueOptions: { durable: true }
    }
  }
])
```

### 7.4 Containerización: Docker

**Docker Compose orquesta 7 servicios:**

```yaml
services:
  gateway:        # Puerto 3000
  ms-master:      # Puerto 3001
  ms-worker:      # Puerto 3002
  postgres-master:# Puerto 5433
  postgres-worker:# Puerto 5434
  redis:          # Puerto 6379
  rabbitmq:       # Puerto 5672, 15672 (UI)
```

**Ventajas:**
- ✅ Un comando levanta todo: `docker-compose up -d`
- ✅ Reproducible en cualquier máquina
- ✅ Aislamiento entre servicios
- ✅ Fácil de escalar

---

## 8. Cómo ejecutar el proyecto

### Paso 1: Pre-requisitos

Instalar:
1. **Docker Desktop** - [Descargar](https://www.docker.com/products/docker-desktop)
2. **Git** - [Descargar](https://git-scm.com/)
3. **PowerShell** (incluido en Windows)

### Paso 2: Clonar y preparar

```powershell
# Clonar repositorio
git clone <url-del-repo>
cd Idempotent_Consumer

# Asegurarse de que Docker está corriendo
docker --version
# Docker version 24.0.0, build ...
```

### Paso 3: Levantar el sistema

```powershell
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Esperar 60 segundos para inicialización completa
Start-Sleep -Seconds 60
```

### Paso 4: Verificar servicios

```powershell
# Ver contenedores corriendo
docker ps

# Debería mostrar 7 contenedores:
# CONTAINER ID   IMAGE              STATUS
# abc123...      gateway            Up 2 minutes
# def456...      ms-master          Up 2 minutes
# ghi789...      ms-worker          Up 2 minutes
# jkl012...      postgres:15        Up 2 minutes
# mno345...      postgres:15        Up 2 minutes
# pqr678...      redis:7            Up 2 minutes
# stu901...      rabbitmq:3.13      Up 2 minutes
```

### Paso 5: Ejecutar tests

```powershell
# Test de sistema completo
.\test_sistema.ps1

# Test de idempotencia (EL MÁS IMPORTANTE)
.\test_idempotencia.ps1

# Output esperado:
# ========================================
# TEST DE IDEMPOTENCIA
# ========================================
# [1] PRIMERA SOLICITUD
# Respuesta 1: ID en BD: 1
#
# [2] SEGUNDA SOLICITUD (IDÉNTICA)
# Respuesta 2: ID en BD: 1 ← MISMO ID
#
# ========================================
# ✓ IDEMPOTENCIA FUNCIONANDO
# ========================================
```

---

## 9. Pruebas y validación

### 9.1 Test Automático de Idempotencia

**Script**: `test_idempotencia.ps1`

```powershell
# ¿Qué hace este script?
1. Crea una transferencia con parámetros específicos
2. Guarda el ID de la transferencia creada
3. Envía la MISMA solicitud otra vez
4. Compara los IDs
5. Si son IGUALES → ✅ IDEMPOTENCIA OK
6. Si son DIFERENTES → ❌ FALLÓ
```

### 9.2 Prueba Manual con Postman

```
1. Importar colección:
   - Archivo: Postman_Collection_Idempotent_Consumer.json
   - En Postman: Import > Select File

2. Ejecutar request "Create Transferencia":
   POST http://localhost:3000/transferencias
   Body: {
     "cuentaOrigenId": 1,
     "cuentaDestinoId": 2,
     "monto": 100.00
   }
   
   Response:
   {
     "id": 1,
     "idempotencyKey": "78f7a98d..."
   }

3. Ejecutar EL MISMO request otra vez
   (Sin cambiar nada en el Body)
   
   Response:
   {
     "id": 1,  ← MISMO ID
     "idempotencyKey": "78f7a98d..."  ← MISMA KEY
   }

4. Verificar en base de datos:
   docker exec -it postgres-worker psql -U postgres -d transferencias
   
   SELECT COUNT(*) FROM transferencias WHERE idempotency_key = '78f7a98d...';
   
   Resultado: 1 (NO 2)
```

### 9.3 Verificar en Redis

```powershell
# Conectar a Redis CLI
docker exec -it redis redis-cli

# Dentro de Redis:
127.0.0.1:6379> KEYS idempotency:*
1) "idempotency:78f7a98d30828cb5405b5732e7f0f7fa1f25..."

127.0.0.1:6379> GET idempotency:78f7a98d...
"{\"id\":1,\"transferenciaId\":\"TXN_...\",\"monto\":\"100.00\"}"

127.0.0.1:6379> TTL idempotency:78f7a98d...
(integer) 604500  # Segundos restantes (~7 días)
```

---

## 10. Conclusiones

### ✅ Logros de este taller

1. **Implementación correcta del patrón Idempotent Consumer**
   - Verificación antes de procesar
   - Almacenamiento en Redis con TTL
   - Fallback a PostgreSQL
   - 100% funcional

2. **Arquitectura moderna de microservicios**
   - Separación de responsabilidades
   - Database per Service
   - Event-driven con RabbitMQ
   - Escalable y mantenible

3. **Stack tecnológico relevante**
   - NestJS (framework moderno)
   - TypeScript (type-safety)
   - Docker (containerización)
   - Redis (cache distribuido)
   - PostgreSQL (RDBMS robusto)

4. **Calidad de software**
   - Testing automatizado
   - Documentación exhaustiva
   - Código limpio y comentado
   - Buenas prácticas

### 🎓 Aprendizajes clave

1. **La idempotencia es CRÍTICA en sistemas distribuidos**
   - Sin ella: duplicados, inconsistencias, pérdida de confianza
   - Con ella: comportamiento predecible y confiable

2. **Redis es ideal para idempotencia**
   - Velocidad (microsegundos)
   - TTL automático
   - Simple de usar

3. **El patrón es usado por grandes empresas**
   - Stripe, PayPal, Amazon, Uber
   - Estándar de la industria
   - Demuestra madurez técnica

4. **Testing es esencial**
   - Scripts automatizados ahorran tiempo
   - Confianza en que funciona
   - Fácil de demostrar

### 🚀 Aplicaciones en el mundo real

Este patrón se usa en:

| Industria | Uso |
|-----------|-----|
| **Finanzas** | Pagos, transferencias, inversiones |
| **E-commerce** | Órdenes de compra, checkout |
| **SaaS** | Subscripciones, billing |
| **APIs públicas** | Webhooks, integraciones |
| **IoT** | Comandos a dispositivos |

### 📚 Recursos adicionales

Para profundizar:

- **Libro**: "Designing Data-Intensive Applications" por Martin Kleppmann
- **Documentación**: [Redis](https://redis.io/docs/) | [NestJS](https://nestjs.com/)
- **Patrón**: [Microsoft - Idempotent Consumer](https://learn.microsoft.com/en-us/azure/architecture/patterns/idempotent-consumer)

---

## 📞 Soporte

¿Preguntas? Revisa:
- [README.md](README.md) - Documentación principal
- [COMO_PROBAR.md](COMO_PROBAR.md) - Guía de testing
- [ARQUITECTURA_DETALLADA.md](ARQUITECTURA_DETALLADA.md) - Detalles técnicos

---

<div align="center">

**Sistema 100% funcional y listo para demostración**

Hecho con ❤️ por Kelly Dayana Canchingre Quevedo  
ULEAM • Diciembre 2025

</div>
