import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CuentaService } from '../services/cuenta.service';
import { IdempotencyService } from '../services/idempotency.service';

@Controller('rmq')  // Give it a path to make it explicit
export class TransferenciaListener {
  private readonly logger = new Logger(TransferenciaListener.name);

  constructor(
    private readonly cuentaService: CuentaService,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  /**
   * Listen for 'transferencia.creada' messages
   * Implements Idempotent Consumer pattern:
   * - Check if message was already processed via Redis
   * - If yes: ignore duplicate (skip business logic)
   * - If no: process and store idempotency key
   */
  @MessagePattern('transferencia.creada')
  async handleTransferenciaCreada(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const { idempotencyKey, transferenciaId, cuentaOrigenId, cuentaDestinoId, monto } = data;

    this.logger.log(
      `[INCOMING] Evento 'transferencia.creada' recibido - TXN: ${transferenciaId}, Key: ${idempotencyKey}`,
    );

    try {
      // STEP 1: Check Redis for idempotency key
      const alreadyProcessed = await this.idempotencyService.isProcessed(idempotencyKey);

      if (alreadyProcessed) {
        this.logger.warn(
          `[DUPLICATE] Transferencia ${transferenciaId} ya fue procesada. Ignorando duplicado.`,
        );
        // ACK the message even though we skip processing
        const ackChannel = context.getChannelRef();
        const originalMsg = context.getMessage();
        ackChannel.ack(originalMsg);
        return {
          status: 'IGNORED',
          reason: 'Duplicate message',
          transferenciaId,
        };
      }

      // STEP 2: Process the transfer (debit origen, credit destino)
      this.logger.log(
        `[PROCESSING] Aplicando transferencia: Origen(${cuentaOrigenId}) -${monto}→ Destino(${cuentaDestinoId})`,
      );

      // Debit from source account
      const cuentaOrigen = await this.cuentaService.debit(cuentaOrigenId, monto);
      this.logger.log(`[DEBIT OK] Cuenta origen ${cuentaOrigenId}: nuevo saldo = ${cuentaOrigen.saldo}`);

      // Credit to destination account
      const cuentaDestino = await this.cuentaService.credit(cuentaDestinoId, monto);
      this.logger.log(`[CREDIT OK] Cuenta destino ${cuentaDestinoId}: nuevo saldo = ${cuentaDestino.saldo}`);

      // STEP 3: Store idempotency key in Redis
      // TTL: 24 hours (86400 seconds)
      await this.idempotencyService.markAsProcessed(idempotencyKey, 86400);
      this.logger.log(`[IDEMPOTENCY] Clave almacenada en Redis: ${idempotencyKey}`);

      // STEP 4: ACK the message
      const ackChannel = context.getChannelRef();
      const originalMsg = context.getMessage();
      ackChannel.ack(originalMsg);

      this.logger.log(`[SUCCESS] Transferencia ${transferenciaId} procesada exitosamente`);

      return {
        status: 'PROCESSED',
        transferenciaId,
        cuentaOrigenSaldoNuevo: cuentaOrigen.saldo,
        cuentaDestinoSaldoNuevo: cuentaDestino.saldo,
      };
    } catch (error) {
      this.logger.error(`[ERROR] Procesando transferencia ${transferenciaId}: ${error.message}`, error.stack);
      // NACK the message - it will be redelivered
      const nackChannel = context.getChannelRef();
      const originalMsg = context.getMessage();
      nackChannel.nack(originalMsg, false, true); // Requeue
      throw error;
    }
  }
}
