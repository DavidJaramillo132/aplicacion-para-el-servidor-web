import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transferencias')
export class Transferencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  transferenciaId: string;

  @Column({ type: 'integer' })
  cuentaOrigenId: number;

  @Column({ type: 'integer' })
  cuentaDestinoId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 20, default: 'PENDIENTE' })
  estado: string; // PENDIENTE, PROCESADA, FALLIDA

  @Column({ type: 'varchar', length: 500, nullable: true })
  idempotencyKey: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
}
