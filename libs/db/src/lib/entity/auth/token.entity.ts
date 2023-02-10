import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity()
export class Token {
  static fromUsuario(usuario: Usuario): Token {
    const t = new Token();
    t.usuario = usuario;
    return t;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, (u) => u.sesiones, { nullable: false })
  usuario: Usuario;

  @CreateDateColumn()
  creado: Date;

  @UpdateDateColumn()
  actualizado: Date;
}
