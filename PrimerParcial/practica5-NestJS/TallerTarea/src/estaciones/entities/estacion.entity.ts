import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Negocio } from '../../negocios/entities/negocio.entity';
import { Fila } from '../../fila/entities/fila.entity';
import { HorarioAtencion } from '../../horarios-atencion/entities/horario-atencion.entity';

@Entity({ name: 'estaciones' })
export class Estacion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { nullable: true })
  negocio_id?: string;

  @Column({ default: '' })
  nombre!: string;

  @Column({
    type: 'simple-enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado!: 'activo' | 'inactivo';

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @ManyToOne(() => Negocio, (negocio) => negocio.estaciones, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'negocio_id',
  })
  negocio?: Negocio;

  @OneToMany(() => Fila, (fila) => fila.estacion)
  filas?: Fila[];

  @OneToMany(() => HorarioAtencion, (h) => h.estacion)
  horarios?: HorarioAtencion[];
}
