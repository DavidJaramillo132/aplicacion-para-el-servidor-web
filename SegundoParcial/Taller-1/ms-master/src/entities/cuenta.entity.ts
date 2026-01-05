import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cuentas')
export class Cuenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  numero: string;

  @Column({ type: 'varchar', length: 100 })
  titularNombre: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo: number;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVA' })
  estado: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
}
