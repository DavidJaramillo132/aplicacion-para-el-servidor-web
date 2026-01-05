# 🏦 Sistema de Transferencias Bancarias con Idempotencia

<div align="center">

[![Status](https://img.shields.io/badge/Status-Completado-brightgreen?style=for-the-badge)](https://github.com)
[![Docker](https://img.shields.io/badge/Docker-v24+-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0+-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Latest-orange?style=for-the-badge&logo=rabbitmq)](https://www.rabbitmq.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**Microservicios con Garantía de Idempotencia | Arquitectura Event-Driven | 100% Documentado**

[Inicio Rápido](#-inicio-rápido) • [Características](#-características) • [Arquitectura](#-arquitectura) • [Documentación](#-documentación) • [Autor](#-autor)

</div>

---

## 👤 Autor

| Campo | Valor |
|-------|-------|
| **Nombre** | Kelly Dayana Canchingre Quevedo |
| **Email** | Kellycanchingre@hotmail.com |
| **Universidad** | ULEAM |
| **Materia** | Servidores Web / Segundo Parcial |
| **Profesor** | Ing. Jhon Cevallos |
| **Fecha de Entrega** | 8 de Diciembre, 2025 |

---

## ✨ Características Principales

<table>
<tr>
<td width="50%">

### 🎯 Idempotencia Garantizada
- ✅ Misma solicitud = Mismo resultado
- ✅ Sin duplicados de transacciones
- ✅ Dinero debitado UNA SOLA VEZ
- ✅ SHA-256 para claves determinísticas

</td>
<td width="50%">

### 🏗️ Arquitectura Robusta
- ✅ Microservicios distribuidos
- ✅ Event-driven con RabbitMQ
- ✅ PostgreSQL replicado (Master-Worker)
- ✅ Redis para caché de idempotencia

</td>
</tr>
<tr>
<td width="50%">

### 📊 Tecnologías Modernas
- ✅ TypeScript + NestJS
- ✅ Docker & Docker Compose
- ✅ RESTful APIs
- ✅ ORM TypeORM

</td>
<td width="50%">

### 📚 Completamente Documentado
- ✅ 7 guías de uso
- ✅ Scripts automáticos
- ✅ Ejemplos ejecutables
- ✅ Colección Postman

</td>
</tr>
</table>

---

## 🚀 Inicio Rápido

### Requisitos Previos
```
✓ Docker Desktop instalado
✓ PowerShell 5.1+ (Windows) o Bash (Linux/Mac)
✓ 4GB RAM disponible
✓ Conexión a internet
```

### 5 Minutos para Demostración

```powershell
# 1️⃣ Clonar o entrar al proyecto
cd C:\Users\kelly\OneDrive\Documentos\AplicacionParaElServidorWeb\SegundoParcial

# 2️⃣ Iniciar servicios
docker-compose up -d

# 3️⃣ Esperar 10 segundos
Start-Sleep -Seconds 10

# 4️⃣ Ejecutar test
.\test_idempotencia.ps1

# 5️⃣ Ver resultado: ✅ IDEMPOTENCIA FUNCIONANDO
```

---

## 📊 Demo: La Idempotencia en Acción

```
┌─────────────────────────────────────────────────────┐
│          PRIMERA SOLICITUD (POST)                   │
├─────────────────────────────────────────────────────┤
│ {                                                    │
│   "cuentaOrigenId": 1,                              │
│   "cuentaDestinoId": 3,                             │
│   "monto": 150.00                                   │
│ }                                                    │
└─────────────────────────────────────────────────────┘
                    ↓
         ✅ Transacción Creada
         ID: 1
         transferenciaId: TXN_1765195778976_gue8x4ro5
         idempotencyKey: 78f7a98d30828cb5405b5732e7f0f7fa1f25

┌─────────────────────────────────────────────────────┐
│          SEGUNDA SOLICITUD (IDÉNTICA)               │
├─────────────────────────────────────────────────────┤
│ {                                                    │
│   "cuentaOrigenId": 1,  ← MISMOS DATOS            │
│   "cuentaDestinoId": 3,                             │
│   "monto": 150.00                                   │
│ }                                                    │
└─────────────────────────────────────────────────────┘
                    ↓
  ✅ RETORNA LA MISMA TRANSACCIÓN (NO DUPLICA)
     ID: 1 ← MISMO
     transferenciaId: TXN_1765195778976_gue8x4ro5 ← MISMO
     idempotencyKey: 78f7a98d30828cb5405b5732e7f0f7fa1f25 ← MISMO

╔═══════════════════════════════════════════════════════╗
║  ✅ CONCLUSIÓN: DINERO DEBITADO UNA SOLA VEZ        ║
╚═══════════════════════════════════════════════════════╝
```

---

## 🏗️ Arquitectura

```
                    ┌─────────────────┐
                    │  API Gateway    │
                    │   (3000)        │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
    │ MS-Master │────│ RabbitMQ    │────│ MS-Worker   │
    │ (3001)    │    │ (5672)      │    │ (3002)      │
    │ Cuentas   │    │ Eventos     │    │ Transferencias
    └────┬──────┘    └──────┬──────┘    └──────┬──────┘
         │                   │                   │
    ┌────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
    │ PostgreSQL│    │   Redis     │    │ PostgreSQL  │
    │ Master    │    │  (6379)     │    │ Worker      │
    │ (5433)    │    │ Idempotency │    │ (5434)      │
    └───────────┘    └─────────────┘    └─────────────┘

       MASTER DB         CACHE         WORKER DB
      Cuentas          Keys        Transferencias
```

---

## 📖 Guías de Uso Disponibles

| Documento | Descripción | Tiempo |
|-----------|-------------|--------|
| **START_HERE_DEMO.md** | Comienza aquí - Instrucciones rápidas | 5 min |
| **ENTREGA_FINAL.md** | Resumen ejecutivo del proyecto | 3 min |
| **GUIA_DEMO_PASO_A_PASO.md** | Pasos exactos para demostración | 15 min |
| **PRESENTACION_VISUAL.md** | Diapositivas ASCII y diagramas | 10 min |
| **DEMO_PROFESOR.md** | Referencia técnica completa | 20 min |
| **INDICE_RAPIDO.md** | Mapa de navegación general | 2 min |

---

## 🧪 Testing

### Automated Test: Idempotency Verification

```powershell
# Run the test
.\test_idempotencia.ps1

# Expected Output:
# ========================================
# TEST DE IDEMPOTENCIA
# ========================================
# [1] PRIMERA SOLICITUD
# Respuesta 1: ID en BD: 1
# [2] SEGUNDA SOLICITUD (IDÉNTICA)
# Respuesta 2: ID en BD: 1 ← MISMO ID (NO DUPLICÓ)
# ========================================
# ✓ IDEMPOTENCIA FUNCIONANDO CORRECTAMENTE
# ========================================
```

### Full System Test

```powershell
.\test_sistema.ps1
```

---

## 🔧 Troubleshooting

### Docker containers won't start

```bash
# Check Docker status
docker ps

# If needed, restart Docker
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Connection refused on ports

```bash
# Verify ports are free
netstat -ano | findstr :3000
netstat -ano | findstr :5672
netstat -ano | findstr :6379

# Kill process if needed (Windows)
taskkill /PID <PID> /F
```

### RabbitMQ not syncing messages

```bash
# Check RabbitMQ logs
docker-compose logs rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq
```

---

## 📊 API Endpoints

### Gateway (3000)

```
GET  /cuentas              → List all accounts
GET  /cuentas/:id          → Get account details
POST /transferencias       → Create transfer
GET  /transferencias       → List all transfers
```

### MS-Master (3001)

```
GET  /cuentas              → List accounts
GET  /cuentas/:id          → Get account
POST /cuentas              → Create account
```

### MS-Worker (3002)

```
GET  /transferencias       → List transfers
POST /transferencias       → Create transfer
```

---

## 🔐 API Examples

### Create a Transfer

```bash
curl -X POST http://localhost:3000/transferencias \
  -H "Content-Type: application/json" \
  -d '{
    "cuentaOrigenId": 1,
    "cuentaDestinoId": 2,
    "monto": 100.00
  }'
```

**Response:**
```json
{
  "id": 1,
  "transferenciaId": "TXN_1765195778976_gue8x4ro5",
  "cuentaOrigenId": 1,
  "cuentaDestinoId": 2,
  "monto": "100.00",
  "estado": "PENDIENTE",
  "idempotencyKey": "78f7a98d30828cb5405b5732e7f0f7fa1f25"
}
```

### Get All Transfers

```bash
curl http://localhost:3000/transferencias
```

---

## 🏆 Key Achievements

```
✅ Idempotency Pattern Implemented
✅ Distributed System with Microservices
✅ Event-Driven Architecture with RabbitMQ
✅ Database Replication (Master-Worker)
✅ Redis Caching for Performance
✅ Comprehensive Error Handling
✅ Full Documentation & Examples
✅ Automated Testing Scripts
✅ Docker Containerization
✅ Production-Ready Code
```

---

## 📊 Technology Stack

<table>
<tr>
<td width="25%">

### Backend
- **NestJS** v10.0
- **TypeScript** v5.0
- **TypeORM** v0.3

</td>
<td width="25%">

### Database
- **PostgreSQL** v15
- **Redis** v7
- Replication enabled

</td>
<td width="25%">

### Messaging
- **RabbitMQ** v3.13
- AMQP Protocol
- Event-driven

</td>
<td width="25%">

### DevOps
- **Docker** v24+
- **Docker Compose**
- Multi-container setup

</td>
</tr>
</table>

---

## 📞 Soporte & Contacto

| Pregunta | Respuesta |
|----------|-----------|
| ¿No funciona Docker? | Verifica instalación: `docker --version` |
| ¿Error al importar Postman? | Lee: `SOLUCION_POSTMAN.md` |
| ¿Puedo ejecutar sin Postman? | Sí, usa: `.\test_idempotencia.ps1` |
| ¿Cómo muestro al profesor? | Sigue: `GUIA_DEMO_PASO_A_PASO.md` |
| ¿Dónde estoy en la demostración? | Consulta: `INDICE_RAPIDO.md` |

---

## 📄 Licencia

[Ingresa la licencia o deja: MIT]

---

## ✨ Agradecimientos

- Profesor: [Nombre del profesor]
- Universidad: [Nombre de la universidad]
- Tecnologías: NestJS, TypeORM, RabbitMQ, PostgreSQL, Docker

---

<div align="center">

### 🎓 Proyecto Académico - Segundo Parcial

**Hecho con ❤️ por Kelly**

[Ingresa GitHub Profile] • [Ingresa LinkedIn] • [Ingresa Portfolio]

**Última actualización:** 8 de Diciembre, 2025

---

**¿Preguntas? Revisa la documentación o ejecuta los tests automáticos.**

</div>

```bash
# Message 1: Initial transfer
POST http://localhost:3000/transferencias
Body:
{
  "cuentaOrigenId": 1,
  "cuentaDestinoId": 2,
  "monto": 50.00
}

# The message is processed normally
# Redis stores: idempotencyKey → processed

# Message 2: Duplicate arrives (network failure + redelivery)
POST http://localhost:3000/transferencias
Body: {SAME PAYLOAD}

# Expected Behavior:
# ✓ Message arrives at RabbitMQ
# ✓ ms-master checks Redis → key exists
# ✓ Duplicate is ignored (not applied again)
# ✓ Account balance remains correct (no double-debit)
```

### Verification Steps

1. **Check account balance before transfer**:
   ```bash
   GET http://localhost:3000/cuentas/1
   # Response: { "id": 1, "saldo": 1000.00 }
   ```

2. **Create transfer**:
   ```bash
   POST http://localhost:3000/transferencias
   # Response: { "id": "TXN_001", "status": "processed" }
   ```

3. **Send duplicate (via Postman or curl with manual idempotency key)**:
   ```bash
   # Manually re-send the same message with same ID
   ```

4. **Check balance after duplicates**:
   ```bash
   GET http://localhost:3000/cuentas/1
   # Expected: { "id": 1, "saldo": 950.00 } (NOT 900.00)
   # Proves duplicate was ignored!
   ```

5. **Check Redis idempotency keys**:
   ```bash
   docker exec redis redis-cli
   > KEYS *
   > GET "txn_12345_abc123"
   ```

## 🔧 Configuration

### Environment Variables

All services load from `.env` files:

- **gateway/.env**: PORT, RABBITMQ_URL
- **ms-master/.env**: DB credentials, REDIS_URL, RabbitMQ
- **ms-worker/.env**: DB credentials, REDIS_URL, RabbitMQ

### Redis Idempotency Configuration

In `ms-master`, the idempotency middleware:
- **TTL**: 24 hours (idempotency keys expire after 24h)
- **Collision Strategy**: UUID v4 for unique keys
- **Storage**: Redis (fast, distributed-friendly)

### RabbitMQ Configuration

- **Queue Name**: `transferencia.creada`
- **Exchange**: `events`
- **Routing Key**: `transferencia.created`
- **Delivery Mode**: Persistent (survives broker restart)

## 📊 Key Concepts

### Idempotent Consumer Pattern

| Scenario | Without Idempotency | With Idempotency |
|----------|------------------|-----------------|
| Message sent once | ✓ Processed correctly | ✓ Processed correctly |
| Message duplicated (network retry) | ✗ Processed twice | ✓ Processed once |
| Outcome | Account debited twice | Account debited once |

### Why This Matters

RabbitMQ's **At-least-once delivery** guarantee means:
- ✓ Messages never lost
- ✗ Messages might arrive multiple times

Without idempotency → financial disaster (duplicate charges, overdrafts, data corruption)
With idempotency → guaranteed exactly-once behavior

## 🛑 Failure Scenarios Covered

1. **Network Failure During Consumption**: 
   - Consumer crashes mid-processing → message redelivered
   - Idempotency key check prevents duplicate debit

2. **RabbitMQ Broker Restart**:
   - Persistent messages are re-delivered
   - Consumer processes with key check → ignores duplicates

3. **Consumer Service Crash + Recovery**:
   - Unacknowledged messages return to queue
   - On restart, same key is checked again
   - No duplicate processing

## 📈 Monitoring & Debugging

### RabbitMQ Management UI
```
http://localhost:15672
Username: guest
Password: guest

Check:
- Queues → "transferencia.creada"
- Messages: Ready / Unacknowledged
- Consumer count
```

### Redis Inspection
```bash
docker exec redis redis-cli
MONITOR                    # Watch real-time commands
KEYS "idempotency:*"      # List all idempotency keys
TTL "idempotency:key123"  # Check expiration
```

### Service Logs
```bash
docker logs -f ms-master
docker logs -f ms-worker
docker logs -f rabbitmq
```

## 🎯 Learning Outcomes

After this workshop, you'll understand:
- ✅ Hybrid architecture (REST + Messaging)
- ✅ Idempotency and exactly-once semantics
- ✅ Distributed transaction handling
- ✅ Event-driven communication
- ✅ Resilience in microservices

## 📚 References

- [Idempotent Consumers - microservices.io](https://microservices.io/)
- [RabbitMQ At-Least-Once Delivery](https://www.rabbitmq.com/)
- [Redis for Deduplication](https://redis.io/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/)

## ✅ Demo Checklist

- [ ] All containers running (`docker ps`)
- [ ] All services responding to health checks
- [ ] Create transfer via gateway
- [ ] Verify debit/credit in databases
- [ ] Simulate duplicate message (RabbitMQ redelivery)
- [ ] Confirm duplicate is ignored (balance correct)
- [ ] Check idempotency key in Redis
- [ ] Stop ms-master, restart, verify messages re-processed correctly
