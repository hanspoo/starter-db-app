import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";

export enum MotivoPermiso {
  RECUPERAR_PASSWORD = "RECUPERAR_PASSWORD",
  REGISTRAR_EMPRESA = "REGISTRAR_EMPRESA",
}
@Entity()
export class PermisoUsarEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  motivo: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  vigente: boolean;

  @Column({ type: "bigint" })
  created_at: number;

  @Column({ type: "bigint", nullable: true })
  fechaUso: number;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date().getTime();
    this.vigente = true;
  }
}
