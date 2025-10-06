import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Estacion } from "./IEstacion";

@Entity({ name: "horarios_atencion" })
export class HorarioAtencion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid", { nullable: true })
  estacion_id?: string;

  @Column({ 
    type: "int",
    nullable: true
  })
  dia_semana?: number; // 1 = lunes, 7 = domingo (1-7)

  @Column({ type: "time" })
  hora_inicio!: string;

  @Column({ type: "time" })
  hora_fin!: string;

  @CreateDateColumn({ name: "creado_en" })
  creadoEn!: Date;

  // Relaciones
  @ManyToOne(() => Estacion, (estacion) => estacion.horarios, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "estacion_id" })
  estacion?: Estacion;
}
