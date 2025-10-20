import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'admin_sistema' })
export class AdminSistema {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { nullable: true })
  usuario_id?: string;

  @Column({ default: '' })
  nombre!: string;

  @Column({ default: '' })
  apellidos!: string;

  @Column({ unique: true, default: '' })
  email!: string;

  @Column({ nullable: true })
  telefono?: string;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'usuario_id',
  })
  usuario?: User;
}
