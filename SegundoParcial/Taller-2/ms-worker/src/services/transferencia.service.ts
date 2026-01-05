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
   * Create a new transfer and publish event to RabbitMQ
   * 
   * Flow:
   * 1. Check if idempotency key already exists (IDEMPOTENCY CHECK)
   * 2. If exists, return cached response
   * 3. If not, create transferencia record locally (estado: PENDIENTE)
   * 4. Generate idempotency key (UUID)
   * 5. Publish 'transferencia.creada' event to RabbitMQ
   * 6. ms-master consumer processes it with idempotency check
   * 7. Update estado to PROCESADA when confirmed
   */
  async create(
    dto: CreateTransferenciaDto,
    rabbitClient: any,
  ): Promise<Transferencia> {
    // Generate deterministic idempotency key from input data
    // This ensures same transfer request always has same key
    const idempotencyData = `${dto.cuentaOrigenId}:${dto.cuentaDestinoId}:${dto.monto}`;
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(idempotencyData)
      .digest('hex')
      .substring(0, 36); // Create UUID-like string (36 chars)

    this.logger.log(
      `[CREATE] Verificando idempotencia para: ${idempotencyKey}`,
    );

    // IDEMPOTENCY CHECK: Verify if request was already processed
    const existingTransferencia = await this.transferenciaRepository.findOne({
      where: { idempotencyKey },
    });

    if (existingTransferencia) {
      this.logger.log(
        `[IDEMPOTENT] Transacción duplicada detectada, retornando la existente: ${existingTransferencia.transferenciaId}`,
      );
      return existingTransferencia; // Return the cached response
    }

    // Only generate new transference ID if it's not a duplicate
    const transferenciaId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.logger.log(
      `[CREATE] Iniciando nueva transferencia: ${transferenciaId} | Key: ${idempotencyKey}`,
    );

    // Step 1: Create record locally
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
      // Step 2: Publish event to RabbitMQ
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

      // Emit event (fire and forget pattern with error handling)
      rabbitClient.emit('transferencia.creada', eventPayload).subscribe(
        () => {
          this.logger.log(`[EMITTED] Evento enviado exitosamente: ${transferenciaId}`);
          // Note: We don't update estado here because we wait for the actual processing
          // In a real scenario, you might have a listener for confirmation
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
