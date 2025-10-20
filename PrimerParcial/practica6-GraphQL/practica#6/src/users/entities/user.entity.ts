import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Cita } from '../../citas/entities/cita.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombreCompleto!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'simple-enum',
    enum: ['cliente', 'adminNegocio', 'adminSistema'],
    name: 'rol',
  })
  rol!: 'cliente' | 'adminNegocio' | 'adminSistema';

  @Column({ nullable: true })
  telefono?: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  // Relaciones
  @OneToMany(() => Cita, (cita) => cita.usuario)
  citas!: Cita[];
}
