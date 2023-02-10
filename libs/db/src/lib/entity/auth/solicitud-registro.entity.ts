import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity()
export class SolicitudRegistro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identLegal: string;

  @Column()
  empresa: string;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column('boolean', { default: true })
  pendiente: boolean;

  @Column('boolean', { default: false })
  aceptada: boolean;

  @Column()
  cseg: number;

  @Column({ type: 'bigint' })
  public created_at: number;

  @Column({ type: 'bigint', nullable: true })
  public updated_at: number;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date().getTime();
  }
}
