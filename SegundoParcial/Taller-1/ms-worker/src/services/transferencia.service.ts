import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { Transferencia } from '../entities/transferencia.entity';
import { CreateTransferenciaDto } from '../dto/create-transferencia.dto';

@Injectable()
export class TransferenciaService {
  private readonly logger = new Logger(TransferenciaService.name);

  constructor(
    @InjectRepository(Transferencia)
    private readonly transferenciaRepository: Repository<Transferencia>,
  ) {}

  /**
   * Crea una nueva transferencia y publica el evento en RabbitMQ
   *
   * Flujo:
   * 1. Verificar si ya existe una llave de idempotencia (CHEQUEO DE IDEMPOTENCIA)
   * 2. Si existe, devolver la respuesta previamente guardada
   * 3. Si no existe, crear el registro de transferencia local (estado: PENDIENTE)
   * 4. Generar llave de idempotencia (UUID)
   * 5. Publicar el evento 'transferencia.creada' en RabbitMQ
   * 6. El consumidor ms-master lo procesa con verificación de idempotencia
   * 7. Actualizar el estado a PROCESADA cuando se confirme
   */
  async create(
    dto: CreateTransferenciaDto,
    rabbitClient: any,
  ): Promise<Transferencia> {
    // Genera una llave de idempotencia determinista a partir de los datos
    // Esto asegura que la misma solicitud de transferencia tenga siempre la misma llave
    const idempotencyData = `${dto.cuentaOrigenId}:${dto.cuentaDestinoId}:${dto.monto}`;
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(idempotencyData)
      .digest('hex')
      .substring(0, 36); // Crea una cadena similar a UUID (36 caracteres)

    this.logger.log(
      `[CREATE] Verificando idempotencia para: ${idempotencyKey}`,
    );

    // CHEQUEO DE IDEMPOTENCIA: verifica si la solicitud ya fue procesada
    const existingTransferencia = await this.transferenciaRepository.findOne({
      where: { idempotencyKey },
    });

    if (existingTransferencia) {
      this.logger.log(
        `[IDEMPOTENT] Transacción duplicada detectada, retornando la existente: ${existingTransferencia.transferenciaId}`,
      );
      return existingTransferencia; // Devuelve la respuesta almacenada
    }

    // Solo genera un nuevo ID de transferencia si no es un duplicado
    const transferenciaId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.logger.log(
      `[CREATE] Iniciando nueva transferencia: ${transferenciaId} | Key: ${idempotencyKey}`,
    );

    // Paso 1: crea el registro local
    const transferencia = this.transferenciaRepository.create({
      transferenciaId,
      cuentaOrigenId: dto.cuentaOrigenId,
      cuentaDestinoId: dto.cuentaDestinoId,
      monto: dto.monto,
      idempotencyKey,
      estado: 'PENDIENTE',
    });

    const saved = await this.transferenciaRepository.save(transferencia);
    this.logger.log(`[SAVED] Transferencia guardada localmente: ${transferenciaId}`);

    try {
      // Paso 2: publica el evento en RabbitMQ
      const eventPayload = {
        idempotencyKey,
        transferenciaId,
        cuentaOrigenId: dto.cuentaOrigenId,
        cuentaDestinoId: dto.cuentaDestinoId,
        monto: dto.monto,
        timestamp: new Date().toISOString(),
      };

      this.logger.log(
        `[PUBLISH] Publicando evento 'transferencia.creada' a RabbitMQ: ${transferenciaId}`,
      );

      // Emite el evento (patrón fire and forget con manejo de errores)
      rabbitClient.emit('transferencia.creada', eventPayload).subscribe(
        () => {
          this.logger.log(`[EMITTED] Evento enviado exitosamente: ${transferenciaId}`);
          // Nota: no actualizamos el estado aquí porque esperamos el procesamiento real
          // En un escenario real, podrías tener un listener para la confirmación
        },
        (err: Error) => {
          this.logger.error(
            `[EMIT_ERROR] Error al emitir evento: ${transferenciaId} - ${err.message}`,
          );
          saved.estado = 'FALLIDA';
          saved.errorMessage = `Error al publicar a RabbitMQ: ${err.message}`;
          this.transferenciaRepository.save(saved).catch((saveErr) => {
            this.logger.error(`[SAVE_ERROR] Error guardando estado FALLIDA: ${saveErr.message}`);
          });
        },
      );

      return saved;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      const errorStack = err instanceof Error ? err.stack : '';
      this.logger.error(`[ERROR] Error creando transferencia: ${errorMsg}`, errorStack);
      saved.estado = 'FALLIDA';
      saved.errorMessage = errorMsg;
      await this.transferenciaRepository.save(saved);
      throw err;
    }
  }

  async findAll(): Promise<Transferencia[]> {
    return this.transferenciaRepository.find();
  }

  async findById(id: number): Promise<Transferencia | null> {
    return this.transferenciaRepository.findOne({ where: { id } });
  }

  async updateEstado(id: number, estado: string, errorMessage?: string): Promise<Transferencia> {
    const transferencia = await this.findById(id);
    if (!transferencia) {
      throw new Error(`Transferencia con ID ${id} no encontrada`);
    }
    transferencia.estado = estado;
    if (errorMessage) {
      transferencia.errorMessage = errorMessage;
    }
    return this.transferenciaRepository.save(transferencia);
  }
}
