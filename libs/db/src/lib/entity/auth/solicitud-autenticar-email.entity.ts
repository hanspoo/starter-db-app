import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";

@Entity()
export class SolicitudAutenticarEmail {
  static vigenciaMinutos(): number {
    if (process.env.VIGENCIA_PERMISOS)
      return parseInt(process.env.VIGENCIA_PERMISOS + "");
    return 5;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  cseg: number;

  @Column()
  vigente: boolean;

  @Column({ type: "bigint" })
  created_at: number;

  @BeforeInsert()
  updateDates() {
    if (!this.created_at) this.created_at = new Date().getTime();
    this.vigente = true;
  }
}
