import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Estacion } from '../../estaciones/entities/estacion.entity';

@Entity({ name: 'horarios_atencion' })
export class HorarioAtencion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { nullable: true })
  estacion_id?: string;

  @Column({ type: 'int', nullable: true })
  dia_semana?: number;

  @Column({ type: 'time' })
  hora_inicio!: string;

  @Column({ type: 'time' })
  hora_fin!: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @ManyToOne(() => Estacion, (estacion) => estacion.horarios, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'estacion_id',
  })
  estacion?: Estacion;
}
