import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Estacion } from '../../estaciones/entities/estacion.entity';

@Entity({ name: 'negocios' })
export class Negocio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { nullable: true })
  admin_negocio_id?: string;

  @Column({ default: '' })
  nombre!: string;

  @Column({ default: '' })
  categoria!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  correo?: string;

  @Column({ nullable: true })
  imagen_url?: string;

  @Column({ type: 'boolean', default: true })
  estado!: boolean;

  @Column({ nullable: true })
  hora_atencion?: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'admin_negocio_id',
  })
  adminNegocio?: User;

  @OneToMany(() => Estacion, (estacion) => estacion.negocio)
  estaciones?: Estacion[];
}
