import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Local } from './local.entity';
import { OrdenCompra } from './orden-compra.entity';

@Entity()
export class UnidadNegocio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Cliente, (cli) => cli.unidades)
  cliente: Cliente;

  @OneToMany(() => Local, (local) => local.unidad, {
    eager: true,
    cascade: true,
  })
  locales: Local[];

  @OneToMany(() => OrdenCompra, (orden) => orden.unidad)
  ordenes: OrdenCompra[];
}
