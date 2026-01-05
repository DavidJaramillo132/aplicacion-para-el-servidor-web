import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CuentaService } from '../services/cuenta.service';
import { IdempotencyService } from '../services/idempotency.service';

@Controller('rmq')  // Se define la ruta explícitamente
export class TransferenciaListener {
  private readonly logger = new Logger(TransferenciaListener.name);

  constructor(
    private readonly cuentaService: CuentaService,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  /**
   * Escucha mensajes 'transferencia.creada'
   * Implementa el patrón de consumidor idempotente:
   * - Verifica en Redis si el mensaje ya fue procesado
   * - Si sí: ignora el duplicado (omite la lógica de negocio)
   * - Si no: procesa y almacena la llave de idempotencia
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
      // PASO 1: verifica en Redis la llave de idempotencia
      const alreadyProcessed = await this.idempotencyService.isProcessed(idempotencyKey);

      if (alreadyProcessed) {
        this.logger.warn(
          `[DUPLICATE] Transferencia ${transferenciaId} ya fue procesada. Ignorando duplicado.`,
        );
        // ACK del mensaje aunque se omita el procesamiento
        const ackChannel = context.getChannelRef();
        const originalMsg = context.getMessage();
        ackChannel.ack(originalMsg);
        return {
          status: 'IGNORED',
          reason: 'Duplicate message',
          transferenciaId,
        };
      }

      // PASO 2: procesa la transferencia (debita origen, acredita destino)
      this.logger.log(
        `[PROCESSING] Aplicando transferencia: Origen(${cuentaOrigenId}) -${monto}→ Destino(${cuentaDestinoId})`,
      );

      // Debitar desde la cuenta origen
      const cuentaOrigen = await this.cuentaService.debit(cuentaOrigenId, monto);
      this.logger.log(`[DEBIT OK] Cuenta origen ${cuentaOrigenId}: nuevo saldo = ${cuentaOrigen.saldo}`);

      // Acreditar en la cuenta destino
      const cuentaDestino = await this.cuentaService.credit(cuentaDestinoId, monto);
      this.logger.log(`[CREDIT OK] Cuenta destino ${cuentaDestinoId}: nuevo saldo = ${cuentaDestino.saldo}`);

      // PASO 3: almacena la llave de idempotencia en Redis
      // TTL: 24 horas (86400 segundos)
      await this.idempotencyService.markAsProcessed(idempotencyKey, 86400);
      this.logger.log(`[IDEMPOTENCY] Clave almacenada en Redis: ${idempotencyKey}`);

      // PASO 4: ACK del mensaje
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
      // NACK del mensaje: se reenviará
      const nackChannel = context.getChannelRef();
      const originalMsg = context.getMessage();
      nackChannel.nack(originalMsg, false, true); // Requeue
      throw error;
    }
  }
}
