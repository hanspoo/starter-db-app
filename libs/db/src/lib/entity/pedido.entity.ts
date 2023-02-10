import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { OrdenCompra } from './orden-compra.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(() => OrdenCompra, (orden) => orden.pedido)
  ordenes: OrdenCompra[];

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  cliente: Cliente;
}
